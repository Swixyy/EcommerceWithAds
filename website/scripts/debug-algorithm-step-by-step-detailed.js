const debugAlgorithmStepByStepDetailed = async () => {
  console.log('🔍 Debugging Algorithm Step by Step (Detailed)...\n');
  
  // Let's trace through what the algorithm should be doing
  console.log('📊 Current Result:');
  console.log('   Position 1: ASUS ROG Flow Z13 (Tablets)');
  console.log('   Position 2: Samsung Galaxy Tab S9 Ultra (Tablets)');
  console.log('   Position 3: iPad Air 5th Gen (Tablets)');
  console.log('   Position 4: Vivo X100 Pro (Smartphones)');
  
  console.log('\n❌ Problem: 3 products from Tablets category');
  console.log('✅ Expected: 1 product from each unique category');
  
  console.log('\n🔍 Algorithm Logic Analysis:');
  console.log('   The algorithm should work like this:');
  console.log('   1. Get 1 product from last browsed category (tablets)');
  console.log('   2. Get 1 product from laptops (previous unique category)');
  console.log('   3. Get 1 product from smartphones (previous unique category)');
  console.log('   4. Get 1 product from fallback (favorite categories or featured)');
  
  console.log('\n🎯 Possible Issues:');
  console.log('   1. The algorithm is getting multiple products from tablets in step 1');
  console.log('   2. The algorithm is not properly handling the unique category selection');
  console.log('   3. The fallback logic is still interfering');
  console.log('   4. There\'s a bug in the database query');
  
  console.log('\n🔧 Let me check the database queries...');
  
  try {
    // Test getting products from tablets category
    const tabletsResponse = await fetch('http://localhost:3000/api/products?category=tablets');
    if (tabletsResponse.ok) {
      const tabletsData = await tabletsResponse.json();
      console.log(`\n📱 Tablets Category Products (${tabletsData.products.length} total):`);
      tabletsData.products.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
      });
      if (tabletsData.products.length > 5) {
        console.log(`   ... and ${tabletsData.products.length - 5} more`);
      }
    }
    
    // Test getting products from laptops category
    const laptopsResponse = await fetch('http://localhost:3000/api/products?category=laptops');
    if (laptopsResponse.ok) {
      const laptopsData = await laptopsResponse.json();
      console.log(`\n💻 Laptops Category Products (${laptopsData.products.length} total):`);
      laptopsData.products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
      });
    }
    
    // Test getting products from smartphones category
    const smartphonesResponse = await fetch('http://localhost:3000/api/products?category=smartphones');
    if (smartphonesResponse.ok) {
      const smartphonesData = await smartphonesResponse.json();
      console.log(`\n📱 Smartphones Category Products (${smartphonesData.products.length} total):`);
      smartphonesData.products.slice(0, 5).forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} (ID: ${product.id})`);
      });
      if (smartphonesData.products.length > 5) {
        console.log(`   ... and ${smartphonesData.products.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n🎯 Analysis:');
  console.log('   If the database has products in all categories,');
  console.log('   then the algorithm should be able to find products');
  console.log('   from each unique category. The issue must be in');
  console.log('   the algorithm logic itself, not the database.');
  
  console.log('\n🔧 Hypothesis:');
  console.log('   The algorithm is working correctly for the first product,');
  console.log('   but then it\'s not properly handling the subsequent products.');
  console.log('   The issue might be that the algorithm is getting multiple');
  console.log('   products from the same category in a single query,');
  console.log('   or the fallback logic is interfering.');
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Check if the algorithm is using findFirst() correctly');
  console.log('   2. Verify that the unique category selection is working');
  console.log('   3. Ensure the fallback logic is not interfering');
  console.log('   4. Add more debugging to the algorithm');
};

debugAlgorithmStepByStepDetailed().catch(console.error);
