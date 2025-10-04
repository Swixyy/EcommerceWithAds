const debugDetailedRecommendations = async () => {
  console.log('🐛 Detailed Debug: Recommendations Algorithm...\n');
  
  console.log('📋 Algorithm Logic Analysis:');
  console.log('   1. viewedCategories = [oldest, ..., newest] (chronological order)');
  console.log('   2. recentCategories = viewedCategories.slice(-4) (last 4 categories)');
  console.log('   3. recentCategories[0] = 4th newest category');
  console.log('   4. recentCategories[3] = newest category');
  console.log('   5. Loop: i from 3 to 0 (newest to oldest)');
  console.log('   6. unshift() adds each to beginning');
  console.log('   7. Result: newest on left, oldest on right\n');
  
  console.log('🎯 Expected Behavior:');
  console.log('   viewedCategories = [smartphones, tablets, headphones, gaming]');
  console.log('   recentCategories = [smartphones, tablets, headphones, gaming]');
  console.log('   Loop: gaming → headphones → tablets → smartphones');
  console.log('   unshift: gaming → [gaming, headphones] → [gaming, headphones, tablets] → [gaming, headphones, tablets, smartphones]');
  console.log('   Result: [gaming, headphones, tablets, smartphones]\n');
  
  console.log('🔍 Testing Current Implementation:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    
    console.log('   📦 Current recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      data.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
    }
    
    console.log('\n💡 To Test the Sliding Window:');
    console.log('   1. Sign in as user "swixy"');
    console.log('   2. Browse smartphones → Check homepage');
    console.log('   3. Browse tablets → Check homepage (should show tablet on left, smartphone on right)');
    console.log('   4. Browse headphones → Check homepage (should show headphone on left, tablet middle, smartphone right)');
    console.log('   5. Browse gaming → Check homepage (should show gaming on left, others slide right)');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
};

debugDetailedRecommendations().catch(console.error);
