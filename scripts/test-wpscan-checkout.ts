/**
 * Test WP Scan checkout API call
 * Simulates what the button does
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

async function testCheckout() {
  try {
    console.log('🧪 Testing WP Scan checkout API...\n');
    
    const testCases = [
      { productSlug: 'wp-scan', tierName: 'pro-monthly', label: 'Pro Monthly' },
      { productSlug: 'wp-scan', tierName: 'pro-yearly', label: 'Pro Yearly' },
      { productSlug: 'wp-scan', tierName: 'agency-monthly', label: 'Agency Monthly' },
      { productSlug: 'wp-scan', tierName: 'agency-yearly', label: 'Agency Yearly' },
    ];
    
    for (const testCase of testCases) {
      console.log(`📝 Testing: ${testCase.label}`);
      console.log(`   productSlug: "${testCase.productSlug}"`);
      console.log(`   tierName: "${testCase.tierName}"`);
      
      try {
        const response = await fetch('http://localhost:3000/api/checkout/dynamic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productSlug: testCase.productSlug,
            tierName: testCase.tierName,
            quantity: 1,
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`   ✅ Success!`);
          console.log(`   Session ID: ${data.sessionId?.substring(0, 20)}...`);
          console.log(`   URL: ${data.url?.substring(0, 50)}...`);
        } else {
          console.log(`   ❌ Error: ${data.error}`);
          if (data.details) console.log(`   Details: ${data.details}`);
        }
      } catch (error) {
        console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

console.log('⚠️  Make sure the dev server is running: npm run dev\n');
testCheckout();
