/**
 * Apply Tiered Pricing to plugins-data.ts
 * Tier 1: $49.99/year - 7 plugins
 * Tier 2: $69.99/year - 5 plugins
 */

import * as fs from 'fs';
import * as path from 'path';

const pluginsDataPath = path.join(process.cwd(), 'config', 'plugins-data.ts');

const tier1Plugins = [
  'instant-image-optimizer',
  'instant-broken-link-fixer',
  'instant-duplicator',
  'instant-forms',
  'instant-cache',
  'instant-popup-master',
  'instant-ai-writer',
];

const tier2Plugins = [
  'instant-security-guard',
  'instant-seo',
  'instant-backup',
  'instant-review-booster',
  'instant-cart-recovery',
];

function updatePricing() {
  console.log('📝 Reading plugins-data.ts...\n');
  
  let content = fs.readFileSync(pluginsDataPath, 'utf-8');
  const originalContent = content;
  
  // Replace all current pricing with Tier 1 pricing first (for Tier 1 plugins)
  // Then separately update Tier 2 plugins
  
  // Current prices that need to be replaced:
  // pro: { price: 49, ... }
  // agency: { price: 149, ... }
  // enterprise: { price: 399, ... }
  
  // We need to be smart about this - replace within each plugin's context
  
  // Strategy: Find each plugin, extract its pricing section, update it, replace it back
  
  const pluginRegex = /slug: "([^"]+)",[\s\S]*?pricing: \{[\s\S]*?\n    \},\n    screenshots/g;
  
  let matches = [...content.matchAll(pluginRegex)];
  
  console.log(`Found ${matches.length} plugins with pricing sections\n`);
  
  matches.forEach(match => {
    const slug = match[1];
    const fullMatch = match[0];
    
    if (tier1Plugins.includes(slug)) {
      console.log(`Updating ${slug} to Tier 1 pricing ($49.99, $999.99, $4999)...`);
      
      let updated = fullMatch;
      // Update Pro price
      updated = updated.replace(/pro: \{\s*price: \d+\.?\d*,/g, 'pro: {\n        price: 49.99,');
      // Update Agency price
      updated = updated.replace(/agency: \{\s*price: \d+\.?\d*,/g, 'agency: {\n        price: 999.99,');
      // Update Enterprise price
      updated = updated.replace(/enterprise: \{\s*price: \d+\.?\d*,/g, 'enterprise: {\n        price: 4999,');
      
      content = content.replace(fullMatch, updated);
    } else if (tier2Plugins.includes(slug)) {
      console.log(`Updating ${slug} to Tier 2 pricing ($69.99, $1099.99, $6999)...`);
      
      let updated = fullMatch;
      // Update Pro price
      updated = updated.replace(/pro: \{\s*price: \d+\.?\d*,/g, 'pro: {\n        price: 69.99,');
      // Update Agency price
      updated = updated.replace(/agency: \{\s*price: \d+\.?\d*,/g, 'agency: {\n        price: 1099.99,');
      // Update Enterprise price
      updated = updated.replace(/enterprise: \{\s*price: \d+\.?\d*,/g, 'enterprise: {\n        price: 6999,');
      
      content = content.replace(fullMatch, updated);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(pluginsDataPath, content, 'utf-8');
    console.log('\n✅ Successfully updated plugins-data.ts');
    console.log(`   - ${tier1Plugins.length} Tier 1 plugins updated`);
    console.log(`   - ${tier2Plugins.length} Tier 2 plugins updated`);
  } else {
    console.log('\n⚠️  No changes made');
  }
}

try {
  updatePricing();
} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
}
