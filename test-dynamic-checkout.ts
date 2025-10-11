/**
 * Test Script for Dynamic Checkout API
 * Tests all checkout types: single product, service, bundle
 */

// Test 1: Single Plugin Purchase
async function testPluginCheckout() {
  console.log('\n🧪 Test 1: Single Plugin Purchase');
  console.log('Testing: Instant Backup Pro');
  
  const response = await fetch('http://localhost:3000/api/checkout/dynamic', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': 'next-auth.session-token=YOUR_SESSION_TOKEN_HERE' // Replace with actual session
    },
    body: JSON.stringify({
      productSlug: 'instant-backup',
      tierName: 'pro',
      quantity: 1
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Plugin checkout successful!');
    console.log('Checkout URL:', data.url);
    console.log('Product:', data.product);
  } else {
    console.log('❌ Plugin checkout failed:', data.error);
  }
  
  return data;
}

// Test 2: Service Booking
async function testServiceCheckout() {
  console.log('\n🧪 Test 2: Service Booking');
  console.log('Testing: Stripe Implementation Service');
  
  const response = await fetch('http://localhost:3000/api/checkout/dynamic', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': 'next-auth.session-token=YOUR_SESSION_TOKEN_HERE'
    },
    body: JSON.stringify({
      productSlug: 'stripe-implementation',
      tierName: 'basic'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Service checkout successful!');
    console.log('Checkout URL:', data.url);
    console.log('Service:', data.product);
  } else {
    console.log('❌ Service checkout failed:', data.error);
  }
  
  return data;
}

// Test 3: Bundle Purchase
async function testBundleCheckout() {
  console.log('\n🧪 Test 3: Bundle Purchase');
  console.log('Testing: Multiple plugins bundle');
  
  const response = await fetch('http://localhost:3000/api/checkout/dynamic', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': 'next-auth.session-token=YOUR_SESSION_TOKEN_HERE'
    },
    body: JSON.stringify({
      items: [
        { productSlug: 'instant-backup', tierName: 'pro', quantity: 1 },
        { productSlug: 'instant-security-guard', tierName: 'pro', quantity: 1 },
        { productSlug: 'instant-cache-pro', tierName: 'pro', quantity: 1 }
      ]
    })
  });

  const data = await response.json();
  
  if (data.success) {
    console.log('✅ Bundle checkout successful!');
    console.log('Checkout URL:', data.url);
    console.log('Items:', data.items);
  } else {
    console.log('❌ Bundle checkout failed:', data.error);
  }
  
  return data;
}

// Test 4: Check Products in Database
async function testDatabaseProducts() {
  console.log('\n🧪 Test 4: Database Products');
  console.log('Checking seeded products...');
  
  // This would need to be run with database access
  console.log('⚠️  Run this query in Neon console:');
  console.log(`
    SELECT 
      p.name, 
      pt.tier_name, 
      pt.price / 100 as price_dollars,
      pt.pricing_model
    FROM products p
    JOIN pricing_tiers pt ON p.id = pt.product_id
    WHERE p.is_active = true
    ORDER BY p.name, pt.price;
  `);
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Dynamic Checkout API Tests');
  console.log('=' .repeat(50));
  
  try {
    await testPluginCheckout();
    await testServiceCheckout();
    await testBundleCheckout();
    await testDatabaseProducts();
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed!');
    console.log('\nNote: To test authenticated requests, you need to:');
    console.log('1. Sign in to http://localhost:3000');
    console.log('2. Copy the session cookie from browser DevTools');
    console.log('3. Replace YOUR_SESSION_TOKEN_HERE in this script');
    console.log('\nOr test directly via the frontend by clicking buy buttons!');
  } catch (error) {
    console.error('\n❌ Test error:', error);
  }
}

// Run tests
runTests();
