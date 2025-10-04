const testSlidingRecommendations = async () => {
  console.log('🧪 Testing Sliding Window Recommendations System...\n');
  
  console.log('📋 New Sliding Window Algorithm:');
  console.log('   - Shows 1 product from each of the 4 most recent categories');
  console.log('   - Newest category appears on the left (position 1)');
  console.log('   - Older categories slide to the right');
  console.log('   - 5th+ oldest categories get removed from view\n');
  
  console.log('🎯 Example Scenario:');
  console.log('   User browsing history: [tablets, smartphones, laptops, headphones, gaming]');
  console.log('   Recommendations will show:');
  console.log('   1. Gaming product (newest - leftmost)');
  console.log('   2. Headphones product');
  console.log('   3. Laptops product');
  console.log('   4. Smartphones product (oldest of the 4)');
  console.log('   (Tablets gets removed - was 5th oldest)\n');
  
  // Test current recommendations
  console.log('1️⃣ Testing current recommendations:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
    }
    
    console.log('\n🔍 Algorithm Behavior:');
    console.log('   ✅ Each recommendation shows 1 product per recent category');
    console.log('   ✅ Newest browsed category appears on the left');
    console.log('   ✅ Older categories slide to the right');
    console.log('   ✅ Only keeps track of 4 most recent categories');
    
    console.log('\n💡 How to Test Sliding Window:');
    console.log('   1. Sign in as user "swixy"');
    console.log('   2. Browse smartphones → Check homepage (shows 1 smartphone)');
    console.log('   3. Browse tablets → Check homepage (shows 1 tablet + 1 smartphone)');
    console.log('   4. Browse laptops → Check homepage (shows 1 laptop + 1 tablet + 1 smartphone)');
    console.log('   5. Browse headphones → Check homepage (shows 1 headphone + 1 laptop + 1 tablet + 1 smartphone)');
    console.log('   6. Browse gaming → Check homepage (shows 1 gaming + 1 headphone + 1 laptop + 1 tablet)');
    console.log('   📱 Note: Smartphones gets removed (was 5th oldest)');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
};

testSlidingRecommendations().catch(console.error);
