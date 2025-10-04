const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDiscountSystem() {
  try {
    console.log('🧪 Testing Discount System...\n');

    // Get a test user (swixy)
    const user = await prisma.user.findUnique({
      where: { email: "swixy@gmail.com" },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      console.log('❌ Test user not found. Please create swixy@gmail.com user first.');
      return;
    }

    console.log(`👤 Test User: ${user.name} (${user.email})`);

    // Get a smartphone product
    const product = await prisma.product.findFirst({
      where: {
        category: {
          slug: 'smartphones'
        }
      },
      select: { id: true, name: true, price: true, slug: true }
    });

    if (!product) {
      console.log('❌ No smartphone products found.');
      return;
    }

    console.log(`📱 Test Product: ${product.name} - $${product.price}`);

    // Test 1: Create a temporary discount
    console.log('\n🔬 Test 1: Creating temporary discount...');
    
    const discountPercent = 8;
    const discountMultiplier = (100 - discountPercent) / 100;
    const discountedPrice = Math.round(product.price * discountMultiplier * 100) / 100;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const tempDiscount = await prisma.temporaryDiscount.create({
      data: {
        userId: user.id,
        productId: product.id,
        originalPrice: product.price,
        discountPrice: discountedPrice,
        discountPercent,
        expiresAt,
        source: 'sidebar_ad'
      }
    });

    console.log(`✅ Discount created:`);
    console.log(`   ID: ${tempDiscount.id}`);
    console.log(`   Original: $${tempDiscount.originalPrice}`);
    console.log(`   Discounted: $${tempDiscount.discountPrice}`);
    console.log(`   Percent: ${tempDiscount.discountPercent}%`);
    console.log(`   Expires: ${tempDiscount.expiresAt.toLocaleString()}`);
    console.log(`   Source: ${tempDiscount.source}`);

    // Test 2: Simulate URL parameters
    console.log('\n🔬 Test 2: Simulating sidebar ad click...');
    const simulatedUrl = `/products/${product.slug}?discount=8&source=sidebar_ad&productId=${product.id}`;
    console.log(`   Simulated URL: ${simulatedUrl}`);

    // Test 3: Check if discount is active
    console.log('\n🔬 Test 3: Checking active discount...');
    const activeDiscount = await prisma.temporaryDiscount.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id
        }
      }
    });

    if (activeDiscount && activeDiscount.expiresAt > new Date()) {
      console.log(`✅ Active discount found:`);
      console.log(`   Valid until: ${activeDiscount.expiresAt.toLocaleString()}`);
      console.log(`   In cart: ${activeDiscount.addedToCart}`);
    } else {
      console.log('❌ No active discount found');
    }

    // Test 4: Simulate adding to cart
    console.log('\n🔬 Test 4: Simulating add to cart...');
    await prisma.temporaryDiscount.update({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id
        }
      },
      data: {
        addedToCart: true,
        updatedAt: new Date()
      }
    });

    const updatedDiscount = await prisma.temporaryDiscount.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id
        }
      }
    });

    console.log(`✅ Discount updated - Added to cart: ${updatedDiscount?.addedToCart}`);

    // Test 5: Show all discounts for this user
    console.log('\n🔬 Test 5: All user discounts...');
    const userDiscounts = await prisma.temporaryDiscount.findMany({
      where: { userId: user.id },
      include: {
        product: { select: { name: true, price: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 User has ${userDiscounts.length} discount(s):`);
    userDiscounts.forEach((discount, index) => {
      const isExpired = discount.expiresAt <= new Date();
      const status = isExpired ? '❌ EXPIRED' : '✅ ACTIVE';
      console.log(`   ${index + 1}. ${discount.product.name} - ${status}`);
      console.log(`      $${discount.originalPrice} → $${discount.discountPrice} (${discount.discountPercent}% off)`);
      console.log(`      Expires: ${discount.expiresAt.toLocaleString()}`);
      console.log(`      In cart: ${discount.addedToCart}, Source: ${discount.source}`);
    });

    console.log('\n🎉 Discount system test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Visit a product page with sidebar ad');
    console.log('2. Click on a discounted product in the sidebar');
    console.log('3. Verify the discount appears on the product page');
    console.log('4. Add to cart and verify discount persists');
    console.log('5. Run cleanup script to remove expired discounts');

  } catch (error) {
    console.error('❌ Error testing discount system:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDiscountSystem();
