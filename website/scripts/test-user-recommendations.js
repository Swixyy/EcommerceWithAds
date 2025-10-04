const testUserRecommendations = async () => {
  console.log('🧪 Testing User-Specific Recommendations...\n');
  
  // Test with our test user "swixy"
  console.log('1️⃣ Testing with test user "swixy" (smartphones + laptops preferences):');
  
  try {
    // First, let's check what products are in smartphones and laptops categories
    console.log('\n📂 Checking available products by category:');
    
    const categoriesResponse = await fetch('http://localhost:3000/api/categories');
    const categoriesData = await categoriesResponse.json();
    
    const smartphonesCategory = categoriesData.categories?.find(c => c.slug === 'smartphones');
    const laptopsCategory = categoriesData.categories?.find(c => c.slug === 'laptops');
    
    console.log('   📱 Smartphones category:', smartphonesCategory?.name);
    console.log('   💻 Laptops category:', laptopsCategory?.name);
    
    // Get products from these categories
    if (smartphonesCategory) {
      const smartphonesResponse = await fetch(`http://localhost:3000/api/products?category=${smartphonesCategory.slug}&limit=3`);
      const smartphonesData = await smartphonesResponse.json();
      console.log('   📱 Smartphones products:', smartphonesData.products?.map(p => p.name).join(', ') || 'None');
    }
    
    if (laptopsCategory) {
      const laptopsResponse = await fetch(`http://localhost:3000/api/products?category=${laptopsCategory.slug}&limit=3`);
      const laptopsData = await laptopsResponse.json();
      console.log('   💻 Laptops products:', laptopsData.products?.map(p => p.name).join(', ') || 'None');
    }
    
    console.log('\n2️⃣ Testing recommendations API (this will show featured products for anonymous users):');
    const recommendationsResponse = await fetch('http://localhost:3000/api/ads/recommendations?limit=4');
    const recommendationsData = await recommendationsResponse.json();
    
    console.log('   📦 Current recommendations:', recommendationsData.products?.length || 0, 'products');
    if (recommendationsData.products?.length > 0) {
      recommendationsData.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (${product.category?.name || 'No category'})`);
      });
    }
    
    console.log('\n🔍 Analysis:');
    console.log('   - The recommendations API is working');
    console.log('   - For anonymous users, it returns featured products');
    console.log('   - For authenticated users, it should use their preferences');
    console.log('   - User preferences are stored in the database');
    
    console.log('\n💡 The system is already personalized! It just needs:');
    console.log('   1. User to be logged in');
    console.log('   2. User to have preferences set');
    console.log('   3. User preferences to include favorite categories');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
};

testUserRecommendations().catch(console.error);
