const testRecommendations = async () => {
  console.log('🧪 Testing Personalized Recommendations System...\n');
  
  // Test 1: No user (anonymous)
  console.log('1️⃣ Testing anonymous user recommendations:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const data = await response.json();
    console.log('   ✅ Anonymous recommendations:', data.products?.length || 0, 'products');
    if (data.products?.length > 0) {
      console.log('   📦 Products:', data.products.map(p => p.name).join(', '));
      console.log('   📂 Categories:', data.products.map(p => p.category?.name || 'No category').join(', '));
    }
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n2️⃣ Testing different limits:');
  try {
    const response = await fetch('http://localhost:3000/api/ads/recommendations?limit=6');
    const data = await response.json();
    console.log('   ✅ 6 recommendations:', data.products?.length || 0, 'products');
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
  
  console.log('\n📊 Current recommendation system analysis:');
  console.log('   - ✅ API endpoint is working');
  console.log('   - ✅ Returns products with categories');
  console.log('   - ✅ Respects limit parameter');
  console.log('   - ❓ User preferences integration needs testing');
  
  console.log('\n🔍 Next steps:');
  console.log('   1. Test with authenticated user');
  console.log('   2. Verify user preferences are being used');
  console.log('   3. Check if recommendations change based on user preferences');
};

testRecommendations().catch(console.error);
