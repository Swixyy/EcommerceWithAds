const debugRecommendations = async () => {
  console.log('🐛 Debugging Recommendations Algorithm...\n');
  
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
    
    console.log('\n🔍 Analysis:');
    console.log('   - These are featured products (anonymous user)');
    console.log('   - Need to test with authenticated user to see sliding behavior');
    console.log('   - The issue might be in how we handle the array insertion');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n🔧 Potential Issues:');
  console.log('   1. Array insertion logic might be wrong');
  console.log('   2. User preferences might not be getting tracked properly');
  console.log('   3. The unshift() might not be working as expected');
  console.log('   4. Need to verify the viewedCategories array order');
};

debugRecommendations().catch(console.error);
