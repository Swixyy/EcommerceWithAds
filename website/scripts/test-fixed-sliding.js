const testFixedSliding = async () => {
  console.log('🔧 Testing Fixed Sliding Window Algorithm...\n');
  
  console.log('🐛 Issue Found & Fixed:');
  console.log('   ❌ Problem: addToViewedCategories only added category if not already present');
  console.log('   ✅ Solution: Always add category to viewedCategories array');
  console.log('   📝 This allows same category to appear multiple times for sliding window\n');
  
  console.log('🎯 How It Works Now:');
  console.log('   1. User browses smartphones → viewedCategories = [smartphones]');
  console.log('   2. User browses tablets → viewedCategories = [smartphones, tablets]');
  console.log('   3. User browses headphones → viewedCategories = [smartphones, tablets, headphones]');
  console.log('   4. User browses headphones AGAIN → viewedCategories = [smartphones, tablets, headphones, headphones]');
  console.log('   5. Recommendations show: [headphones, headphones, tablets, smartphones]\n');
  
  console.log('📋 Sliding Window Behavior:');
  console.log('   - Newest category appears on the left');
  console.log('   - Same category can appear multiple times');
  console.log('   - Each browse action slides existing products right');
  console.log('   - Rightmost product gets removed when limit reached\n');
  
  console.log('🧪 Testing Current System:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
    }
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n🚀 Ready to Test Fixed Sliding Window:');
  console.log('   1. Sign in as user "swixy"');
  console.log('   2. Browse smartphones → Check homepage');
  console.log('   3. Browse tablets → Check homepage (tablet should appear on left)');
  console.log('   4. Browse headphones → Check homepage (headphone should appear on left)');
  console.log('   5. Browse headphones AGAIN → Check homepage (NEW headphone should appear on left)');
  console.log('   6. Browse smartphones AGAIN → Check homepage (NEW smartphone should appear on left)');
  console.log('\n💡 The sliding window should now work perfectly with duplicate categories!');
};

testFixedSliding().catch(console.error);
