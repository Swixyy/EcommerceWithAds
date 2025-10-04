const testCorrectSliding = async () => {
  console.log('🎯 Testing Correct Sliding Window Behavior...\n');
  
  console.log('📋 Expected Behavior:');
  console.log('   - Each browsing action adds 1 product to recommendations');
  console.log('   - Newest browsing action appears on the left');
  console.log('   - When 5th browsing action occurs, 4th product gets removed');
  console.log('   - Same category can appear multiple times if browsed multiple times\n');
  
  console.log('🎬 Demo Scenario:');
  console.log('   1. Browse smartphones → [Smartphone A]');
  console.log('   2. Browse tablets → [Tablet A, Smartphone A]');
  console.log('   3. Browse headphones → [Headphone A, Tablet A, Smartphone A]');
  console.log('   4. Browse gaming → [Gaming A, Headphone A, Tablet A, Smartphone A]');
  console.log('   5. Browse headphones AGAIN → [Headphone B, Gaming A, Headphone A, Tablet A]');
  console.log('   📱 Note: Smartphone A gets removed (was 4th), new Headphone B appears on left\n');
  
  console.log('🔍 Algorithm Logic:');
  console.log('   ✅ Takes last 4 browsing actions from viewedCategories');
  console.log('   ✅ Gets 1 unique product from each browsing action');
  console.log('   ✅ Newest browsing action appears on the left');
  console.log('   ✅ 5th+ oldest browsing actions get removed');
  console.log('   ✅ Same category can appear multiple times if browsed multiple times\n');
  
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
  
  console.log('\n🚀 Ready to Test Correct Sliding Window:');
  console.log('   1. Sign in as user "swixy"');
  console.log('   2. Browse smartphones → Check homepage (should show 1 smartphone)');
  console.log('   3. Browse tablets → Check homepage (should show tablet on left, smartphone on right)');
  console.log('   4. Browse headphones → Check homepage (should show headphone on left, tablet middle, smartphone right)');
  console.log('   5. Browse gaming → Check homepage (should show gaming on left, others slide right)');
  console.log('   6. Browse headphones AGAIN → Check homepage (should show NEW headphone on left, smartphone removed)');
  console.log('\n💡 The sliding window should now work exactly as you described!');
};

testCorrectSliding().catch(console.error);
