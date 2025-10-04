const debugBrowsingIssue = async () => {
  console.log('🐛 Debugging Browsing Issue...\n');
  
  console.log('❌ Problem Identified:');
  console.log('   - Browse laptops → Homepage shows 4 laptop products (WRONG)');
  console.log('   - Browse accessories → Homepage shows 4 accessory products (WRONG)');
  console.log('   - Should show: 1 new product + 3 previous products (sliding window)\n');
  
  console.log('🔍 Expected vs Actual:');
  console.log('   Expected: [Laptop A, Featured, Featured, Featured] (after first browse)');
  console.log('   Actual:   [Laptop A, Laptop B, Laptop C, Laptop D] (4 laptops)');
  console.log('   ');
  console.log('   Expected: [Accessory A, Laptop A, Featured, Featured] (after second browse)');
  console.log('   Actual:   [Accessory A, Accessory B, Accessory C, Accessory D] (4 accessories)\n');
  
  console.log('🔧 Root Cause Analysis:');
  console.log('   The algorithm is getting multiple products from the same category');
  console.log('   instead of maintaining the sliding window with previous categories.\n');
  
  console.log('💡 Possible Issues:');
  console.log('   1. viewedCategories array might not be tracking properly');
  console.log('   2. Algorithm might be getting products from wrong categories');
  console.log('   3. The "previous 3 products" logic might be broken');
  console.log('   4. Database query might be returning multiple products from same category\n');
  
  console.log('🧪 Testing Current System:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
      
      // Check if all products are from the same category
      const categories = data.products.map(p => p.category?.name).filter(Boolean);
      const uniqueCategories = [...new Set(categories)];
      const allSameCategory = uniqueCategories.length === 1;
      
      console.log(`\n   🔍 Category Analysis: ${allSameCategory ? '❌ ALL SAME CATEGORY' : '✅ MIXED CATEGORIES'}`);
      console.log(`   Categories found: ${uniqueCategories.join(', ')}`);
    }
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Need to debug the algorithm logic');
  console.log('   2. Check if viewedCategories is being tracked correctly');
  console.log('   3. Verify the "previous 3 products" selection logic');
  console.log('   4. Fix the sliding window implementation');
};

debugBrowsingIssue().catch(console.error);
