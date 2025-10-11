/**
 * API Route: User Settings Management
 * Manages WP Scan user settings including Slack webhooks and notification preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sql } from '@/lib/db-neon';
import { testSlackWebhook } from '@/lib/slack-notifier';

// GET - Fetch user settings
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

    // Get settings
    const settings = await sql`
      SELECT settings FROM wp_scan_user_settings
      WHERE user_id = ${user.id}
      LIMIT 1
    `;

    const userSettings = settings.length > 0 ? settings[0].settings : {
      notifications: {
        email: true,
        slack: false,
        slackWebhookUrl: '',
      },
      whiteLabel: {
        companyName: '',
        companyLogo: '',
        hideInstantBranding: false,
        primaryColor: '#667eea',
      },
    };

    return NextResponse.json({
      settings: userSettings,
      plan: user.plan,
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings are required' },
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

    // Check if Slack webhook URL is being set and test it
    if (settings.notifications?.slackWebhookUrl) {
      const isValid = await testSlackWebhook(settings.notifications.slackWebhookUrl);
      
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid Slack webhook URL. Please check and try again.' },
          { status: 400 }
        );
      }
    }

    // Update or insert settings
    const existing = await sql`
      SELECT id FROM wp_scan_user_settings
      WHERE user_id = ${user.id}
      LIMIT 1
    `;

    if (existing.length > 0) {
      // Update
      await sql`
        UPDATE wp_scan_user_settings
        SET 
          settings = ${JSON.stringify(settings)}::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${user.id}
      `;
    } else {
      // Insert
      await sql`
        INSERT INTO wp_scan_user_settings (user_id, settings)
        VALUES (${user.id}, ${JSON.stringify(settings)}::jsonb)
      `;
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update settings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Test Slack webhook
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
    const { webhookUrl } = body;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL is required' },
        { status: 400 }
      );
    }

    // Test the webhook
    const isValid = await testSlackWebhook(webhookUrl);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Slack webhook test successful! Check your Slack channel.',
      });
    } else {
      return NextResponse.json(
        { error: 'Slack webhook test failed. Please check the URL.' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
