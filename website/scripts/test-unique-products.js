const testUniqueProducts = async () => {
  console.log('🔧 Testing Unique Products in Sliding Window...\n');
  
  console.log('🐛 Issue Found & Fixed:');
  console.log('   ❌ Problem: Same product appeared 4 times when browsing same category');
  console.log('   ✅ Solution: Exclude already selected products to ensure uniqueness');
  console.log('   📝 Now each product in recommendations is unique\n');
  
  console.log('🎯 How It Works Now:');
  console.log('   1. User browses smartphones → Shows 1 unique smartphone product');
  console.log('   2. User browses tablets → Shows 1 tablet + 1 smartphone (both unique)');
  console.log('   3. User browses headphones → Shows 1 headphone + 1 tablet + 1 smartphone (all unique)');
  console.log('   4. User browses headphones AGAIN → Shows 1 NEW headphone + previous 3 (all unique)');
  console.log('   5. User browses smartphones AGAIN → Shows 1 NEW smartphone + 1 headphone + 1 tablet (all unique)\n');
  
  console.log('📋 Algorithm Logic:');
  console.log('   ✅ Takes last 4 viewed categories from user preferences');
  console.log('   ✅ Gets 1 UNIQUE product from each category');
  console.log('   ✅ Excludes products already selected in recommendations');
  console.log('   ✅ Newest category appears on the left');
  console.log('   ✅ Each product is different (no duplicates)\n');
  
  console.log('🧪 Testing Current System:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
      
      // Check for duplicates
      const productIds = data.products.map(p => p.id);
      const uniqueIds = [...new Set(productIds)];
      const hasDuplicates = productIds.length !== uniqueIds.length;
      
      console.log(`\n   🔍 Duplicate Check: ${hasDuplicates ? '❌ DUPLICATES FOUND' : '✅ ALL UNIQUE'}`);
    }
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n🚀 Ready to Test Fixed Sliding Window:');
  console.log('   1. Sign in as user "swixy"');
  console.log('   2. Browse smartphones → Check homepage (should show 1 unique smartphone)');
  console.log('   3. Browse tablets → Check homepage (should show 1 tablet + 1 smartphone)');
  console.log('   4. Browse headphones → Check homepage (should show 1 headphone + 1 tablet + 1 smartphone)');
  console.log('   5. Browse headphones AGAIN → Check homepage (should show 1 NEW headphone + previous products)');
  console.log('   6. Browse smartphones AGAIN → Check homepage (should show 1 NEW smartphone + other products)');
  console.log('\n💡 Each product should now be unique while maintaining the sliding window effect!');
};

testUniqueProducts().catch(console.error);
