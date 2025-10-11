/**
 * API Route: API Key Management
 * Manage API keys for Enterprise users
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db-neon';
import { 
  createApiKey, 
  listApiKeys, 
  revokeApiKey, 
  deleteApiKey 
} from '@/lib/api-key-manager';

// GET - List all API keys
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const users = await sql`
      SELECT id, plan FROM wp_scan_users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Check if user has Enterprise plan
    if (user.plan !== 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'API access is only available for Enterprise plan' },
        { status: 403 }
      );
    }

    // List API keys
    const keys = await listApiKeys(user.id);

    return NextResponse.json({ keys });

  } catch (error) {
    console.error('Error listing API keys:', error);
    return NextResponse.json(
      { error: 'Failed to list API keys' },
      { status: 500 }
    );
  }
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, expiresInDays } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    // Get user
    const users = await sql`
      SELECT id, plan FROM wp_scan_users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Check if user has Enterprise plan
    if (user.plan !== 'ENTERPRISE') {
      return NextResponse.json(
        { error: 'API access is only available for Enterprise plan' },
        { status: 403 }
      );
    }

    // Create API key
    const { apiKey, id } = await createApiKey(user.id, name, expiresInDays);

    return NextResponse.json({
      success: true,
      apiKey, // This is the only time the plain key is shown
      id,
      message: 'API key created successfully. Save this key securely - you won\'t be able to see it again!',
    });

  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('id');

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      );
    }

    // Get user
    const users = await sql`
      SELECT id, plan FROM wp_scan_users
      WHERE email = ${session.user.email}
      LIMIT 1
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = users[0];

    // Delete API key
    const deleted = await deleteApiKey(keyId, user.id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'API key not found or already deleted' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}
