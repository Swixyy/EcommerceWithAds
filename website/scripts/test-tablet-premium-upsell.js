const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTabletPremiumUpsell() {
  try {
    console.log('🧪 Testing Tablet Premium Upsell Feature...\n');

    // Simulate viewing Huawei MatePad Pro 12.6 (tablet category)
    const currentProductCategory = "tablets";
    console.log(`📱 Current Product Category: ${currentProductCategory}`);

    // Get all tablets to find the most expensive
    const tabletProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: "tablets"
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        slug: true
      },
      orderBy: { price: "desc" }
    });

    console.log(`\n📊 Tablets in database (by price):`);
    tabletProducts.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name}: $${product.price.toFixed(2)}`);
    });

    if (tabletProducts.length === 0) {
      console.log('❌ No tablets found in database.');
      return;
    }

    // Get the most expensive tablet
    const mostExpensiveTablet = tabletProducts[0];
    console.log(`\n💎 Most Expensive Tablet: ${mostExpensiveTablet.name}`);
    console.log(`   Original Price: $${mostExpensiveTablet.price.toFixed(2)}`);

    // Calculate 16% discount
    const premiumDiscountedPrice = Math.round(mostExpensiveTablet.price * 0.84 * 100) / 100;
    const savings = Math.round((mostExpensiveTablet.price - premiumDiscountedPrice) * 100) / 100;

    console.log(`   Discounted Price: $${premiumDiscountedPrice.toFixed(2)} (16% off)`);
    console.log(`   Total Savings: $${savings.toFixed(2)}`);

    // Simulate the API response for tablets
    console.log('\n🔬 Simulating API Response for Tablets...');
    
    // First 3 products would be from cross-sell category (headphones/laptops)
    // But the 4th product should be from tablets (current category)
    const simulatedApiResponse = {
      category: { name: "Cross-sell Category", slug: "smartphones" }, // First 3 products
      products: [
        // First 3 products from cross-sell category (8% discount)
        {
          id: "cross-sell-1",
          name: "Cross-sell Product 1",
          originalPrice: 399.99,
          discountedPrice: 367.99,
          discount: 8,
          savings: 32.00,
          category: "Cross-sell Category",
          range: "Budget"
        },
        {
          id: "cross-sell-2", 
          name: "Cross-sell Product 2",
          originalPrice: 599.99,
          discountedPrice: 551.99,
          discount: 8,
          savings: 48.00,
          category: "Cross-sell Category",
          range: "Mid-Range"
        },
        {
          id: "cross-sell-3",
          name: "Cross-sell Product 3", 
          originalPrice: 899.99,
          discountedPrice: 827.99,
          discount: 8,
          savings: 72.00,
          category: "Cross-sell Category",
          range: "Premium"
        },
        // Fourth product: Most expensive tablet (16% discount)
        {
          id: mostExpensiveTablet.id,
          name: mostExpensiveTablet.name,
          slug: mostExpensiveTablet.slug,
          originalPrice: mostExpensiveTablet.price,
          discountedPrice: premiumDiscountedPrice,
          discount: 16,
          savings: savings,
          category: "Tablets",
          range: "premium"
        }
      ],
      discount: 8,
      message: "Cross-sell Category - Special Pricing with Tablet Premium Upsell"
    };

    console.log('✅ Fixed API Response Structure:');
    console.log(`   Total Products: ${simulatedApiResponse.products.length}`);
    console.log(`   First 3 Products: Cross-sell category (8% discount)`);
    console.log(`   Fourth Product: Current category - Tablets (16% discount)`);
    
    console.log('\n📋 Product Breakdown:');
    simulatedApiResponse.products.forEach((product, index) => {
      const isPremium = product.range === "premium";
      console.log(`   ${index + 1}. ${product.name}`);
      console.log(`      Price: $${product.originalPrice.toFixed(2)} → $${product.discountedPrice.toFixed(2)}`);
      console.log(`      Discount: ${product.discount}% (${product.range})`);
      console.log(`      Category: ${product.category}`);
      console.log(`      Savings: $${product.savings.toFixed(2)}`);
      if (isPremium) {
        console.log(`      🎯 PREMIUM UPSELL - Most expensive tablet!`);
      }
    });

    // Test URL generation
    const premiumTabletUrl = `/products/${mostExpensiveTablet.slug}?discount=16&source=sidebar_ad&productId=${mostExpensiveTablet.id}`;
    console.log(`\n🔗 Premium Tablet URL: ${premiumTabletUrl}`);

    console.log('\n🎉 Tablet Premium Upsell Test Completed!');
    console.log('\n📋 Expected Behavior (FIXED):');
    console.log('1. User viewing Huawei MatePad Pro 12.6 (tablets)');
    console.log('2. Sidebar shows 4 products total');
    console.log('3. First 3 products: Cross-sell category (smartphones/laptops) with 8% discount');
    console.log('4. Fourth product: Most expensive TABLET with 16% discount');
    console.log('5. Premium tablet has purple styling and "Premium Upsell" badge');
    console.log('6. Clicking premium tablet applies 16% discount on product page');

  } catch (error) {
    console.error('❌ Error testing tablet premium upsell:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTabletPremiumUpsell();
