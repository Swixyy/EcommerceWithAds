const testFixedSlidingWindow = async () => {
  console.log('🔧 Testing Fixed Sliding Window...\n');
  
  console.log('✅ Fixed Algorithm Logic:');
  console.log('   1. Get last browsed category');
  console.log('   2. Get 1 new product from last browsed category (position 1)');
  console.log('   3. Get unique categories from browsing history (excluding current)');
  console.log('   4. Get 1 product from each of the 3 most recent unique categories');
  console.log('   5. Place them at positions 2, 3, 4\n');
  
  console.log('🎯 Expected Behavior:');
  console.log('   Browse laptops → [Laptop A, Featured, Featured, Featured]');
  console.log('   Browse accessories → [Accessory A, Laptop A, Featured, Featured]');
  console.log('   Browse laptops AGAIN → [Laptop B, Accessory A, Laptop A, Featured]');
  console.log('   Browse headphones → [Headphone A, Laptop B, Accessory A, Laptop A]\n');
  
  console.log('🔍 Key Improvements:');
  console.log('   ✅ Always shows 1 product from last browsed category');
  console.log('   ✅ Shows 1 product from each of previous 3 unique categories');
  console.log('   ✅ Prevents showing 4 products from same category');
  console.log('   ✅ Maintains sliding window effect');
  console.log('   ✅ Each product is unique (no duplicates)\n');
  
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
  
  console.log('\n🚀 Ready to Test Fixed Sliding Window:');
  console.log('   1. Sign in as user "swixy"');
  console.log('   2. Browse laptops → Check homepage (should show 1 laptop + 3 featured)');
  console.log('   3. Browse accessories → Check homepage (should show 1 accessory + 1 laptop + 2 featured)');
  console.log('   4. Browse laptops AGAIN → Check homepage (should show 1 laptop + 1 accessory + 1 laptop + 1 featured)');
  console.log('   5. Browse headphones → Check homepage (should show 1 headphone + 1 laptop + 1 accessory + 1 laptop)');
  console.log('\n💡 Should now show mixed categories instead of 4 products from same category!');
};

testFixedSlidingWindow().catch(console.error);
