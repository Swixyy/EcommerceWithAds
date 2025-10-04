const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPremiumUpsell() {
  try {
    console.log('🧪 Testing Premium Upsell Feature...\n');

    // Get a test user
    const user = await prisma.user.findUnique({
      where: { email: "swixy@gmail.com" },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      console.log('❌ Test user not found. Please create swixy@gmail.com user first.');
      return;
    }

    console.log(`👤 Test User: ${user.name} (${user.email})`);

    // Test with headphones category (since user is viewing Grado SRX325x)
    const currentCategory = "headphones";
    console.log(`📱 Current Category: ${currentCategory}`);

    // Get category info
    const categoryInfo = await prisma.category.findUnique({
      where: { slug: currentCategory },
      select: { id: true, name: true, slug: true }
    });

    if (!categoryInfo) {
      console.log('❌ Category not found.');
      return;
    }

    console.log(`📂 Category: ${categoryInfo.name}`);

    // Get all products in the category to find the most expensive
    const categoryProducts = await prisma.product.findMany({
      where: {
        categoryId: categoryInfo.id
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true
      },
      orderBy: { price: "desc" }
    });

    console.log(`\n📊 Products in ${categoryInfo.name} (by price):`);
    categoryProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name}: $${product.price.toFixed(2)}`);
    });

    if (categoryProducts.length === 0) {
      console.log('❌ No products found in this category.');
      return;
    }

    // Get the most expensive product
    const mostExpensiveProduct = categoryProducts[0];
    console.log(`\n💎 Most Expensive Product: ${mostExpensiveProduct.name}`);
    console.log(`   Original Price: $${mostExpensiveProduct.price.toFixed(2)}`);

    // Calculate 16% discount
    const premiumDiscountedPrice = Math.round(mostExpensiveProduct.price * 0.84 * 100) / 100;
    const savings = Math.round((mostExpensiveProduct.price - premiumDiscountedPrice) * 100) / 100;

    console.log(`   Discounted Price: $${premiumDiscountedPrice.toFixed(2)} (16% off)`);
    console.log(`   Total Savings: $${savings.toFixed(2)}`);

    // Simulate the API call
    console.log('\n🔬 Testing API Response...');
    const simulatedApiResponse = {
      category: categoryInfo,
      products: [
        // First 3 products with 8% discount (tiered pricing)
        ...categoryProducts.slice(1, 4).map(product => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          originalPrice: product.price,
          discountedPrice: Math.round(product.price * 0.92 * 100) / 100,
          discount: 8,
          savings: Math.round((product.price * 0.08) * 100) / 100,
          category: categoryInfo.name,
          range: "Budget/Mid-Range/Premium"
        })),
        // Fourth product with 16% discount (premium upsell)
        {
          id: mostExpensiveProduct.id,
          name: mostExpensiveProduct.name,
          slug: mostExpensiveProduct.slug,
          originalPrice: mostExpensiveProduct.price,
          discountedPrice: premiumDiscountedPrice,
          discount: 16,
          savings: savings,
          category: categoryInfo.name,
          range: "premium"
        }
      ],
      discount: 8,
      message: `${categoryInfo.name} - Special Pricing with Premium Upsell`
    };

    console.log('✅ API Response Structure:');
    console.log(`   Total Products: ${simulatedApiResponse.products.length}`);
    console.log(`   Category: ${simulatedApiResponse.category.name}`);
    
    console.log('\n📋 Product Breakdown:');
    simulatedApiResponse.products.forEach((product, index) => {
      const isPremium = product.range === "premium";
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      Price: $${product.originalPrice.toFixed(2)} → $${product.discountedPrice.toFixed(2)}`);
      console.log(`      Discount: ${product.discount}% (${product.range})`);
      console.log(`      Savings: $${product.savings.toFixed(2)}`);
      if (isPremium) {
        console.log(`      🎯 PREMIUM UPSELL - Most expensive in category!`);
      }
    });

    // Test URL generation
    const premiumProductUrl = `/products/${mostExpensiveProduct.slug}?discount=16&source=sidebar_ad&productId=${mostExpensiveProduct.id}`;
    console.log(`\n🔗 Premium Product URL: ${premiumProductUrl}`);

    console.log('\n🎉 Premium Upsell Test Completed!');
    console.log('\n📋 Expected Behavior:');
    console.log('1. Sidebar shows 4 products total');
    console.log('2. First 3 products have 8% discount with tiered pricing');
    console.log('3. Fourth product is most expensive with 16% discount');
    console.log('4. Premium product has purple styling and "Premium Upsell" badge');
    console.log('5. Clicking premium product applies 16% discount on product page');
    console.log('6. Cart shows the discounted premium price');

  } catch (error) {
    console.error('❌ Error testing premium upsell:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPremiumUpsell();
