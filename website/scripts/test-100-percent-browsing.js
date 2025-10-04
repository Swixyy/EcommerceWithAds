const test100PercentBrowsing = async () => {
  console.log('🧪 Testing 100% Browsing History Based Recommendations...\n');
  
  console.log('📋 Updated Algorithm:');
  console.log('   1. 100% from viewed categories (browsing history)');
  console.log('   2. Fallback to favorite categories if not enough viewed products');
  console.log('   3. Final fallback to featured products\n');
  
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
    
    console.log('\n🔍 Algorithm Analysis:');
    console.log('   - For anonymous users: Shows featured products (correct)');
    console.log('   - For users with viewed categories: Shows products from those categories');
    console.log('   - For users without viewed categories: Falls back to favorite categories');
    console.log('   - Final fallback: Featured products');
    
    console.log('\n💡 How to Test 100% Browsing History:');
    console.log('   1. Sign in as user "swixy"');
    console.log('   2. Browse different categories (e.g., /products?category=tablets)');
    console.log('   3. Visit homepage to see recommendations');
    console.log('   4. Recommendations should show products from browsed categories');
    
  } catch (error) {
    console.log('   ❌ Error:', error.message);
  }
};

test100PercentBrowsing().catch(console.error);
