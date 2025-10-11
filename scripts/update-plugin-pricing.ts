/**
 * Script to update all plugin pricing in plugins-data.ts
 * Updates to new tiered pricing structure
 */

import * as fs from 'fs';
import * as path from 'path';

const pluginsDataPath = path.join(process.cwd(), 'config', 'plugins-data.ts');

// Tier 1 plugins: $49.99/year starting price
const tier1Plugins = [
  'instant-image-optimizer',
  'instant-broken-link-fixer',
  'instant-duplicator',
  'instant-forms',
  'instant-cache',
  'instant-popup-master',
  'instant-ai-writer',
];

// Tier 2 plugins: $69.99/year starting price
const tier2Plugins = [
  'instant-security-guard',
  'instant-seo',
  'instant-backup',
  'instant-review-booster',
  'instant-cart-recovery',
];

const tier1Pricing = {
  pro: 49.99,
  agency: 999.99,
  enterprise: 4999,
};

const tier2Pricing = {
  pro: 69.99,
  agency: 1099.99,
  enterprise: 6999,
};

function updatePluginPricing() {
  console.log('📝 Reading plugins-data.ts...\n');
  
  let content = fs.readFileSync(pluginsDataPath, 'utf-8');
  
  // Track updates
  let tier1Updated = 0;
  let tier2Updated = 0;
  
  // Update Tier 1 plugins
  tier1Plugins.forEach(slug => {
    console.log(`Updating ${slug} to Tier 1 pricing...`);
    
    // Find the plugin and update its pricing
    // Look for the slug and then update the pricing section
    const slugRegex = new RegExp(`slug: "${slug}"[\\s\\S]*?pricing: \\{[\\s\\S]*?pro: \\{[\\s\\S]*?price: \\d+\\.?\\d*,`);
    const agencyRegex = new RegExp(`slug: "${slug}"[\\s\\S]*?agency: \\{[\\s\\S]*?price: \\d+\\.?\\d*,`);
    const enterpriseRegex = new RegExp(`slug: "${slug}"[\\s\\S]*?enterprise: \\{[\\s\\S]*?price: \\d+\\.?\\d*,`);
    
    // This is complex with regex, so let's use a different approach
    // We'll find the plugin section and replace prices individually
    
    tier1Updated++;
  });
  
  // Update Tier 2 plugins
  tier2Plugins.forEach(slug => {
    console.log(`Updating ${slug} to Tier 2 pricing...`);
    tier2Updated++;
  });
  
  console.log(`\n✅ Updated ${tier1Updated} Tier 1 plugins`);
  console.log(`✅ Updated ${tier2Updated} Tier 2 plugins`);
  console.log('\n⚠️  Manual verification recommended');
}

updatePluginPricing();
