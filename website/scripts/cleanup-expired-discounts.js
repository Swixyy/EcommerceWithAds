const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupExpiredDiscounts() {
  try {
    console.log('🧹 Starting cleanup of expired discounts...');

    // Clean up expired discounts that haven't been added to cart
    const expiredDeleted = await prisma.temporaryDiscount.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        addedToCart: false
      }
    });

    console.log(`✅ Deleted ${expiredDeleted.count} expired discounts (not in cart)`);

    // Also clean up very old discounts that were added to cart (older than 24 hours)
    const oldDeleted = await prisma.temporaryDiscount.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        },
        addedToCart: true
      }
    });

    console.log(`✅ Deleted ${oldDeleted.count} old cart discounts (older than 24h)`);

    // Show remaining active discounts
    const activeDiscounts = await prisma.temporaryDiscount.findMany({
      where: {
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: { select: { email: true } },
        product: { select: { name: true } }
      }
    });

    console.log(`📊 Remaining active discounts: ${activeDiscounts.length}`);
    
    if (activeDiscounts.length > 0) {
      console.log('\n📋 Active Discounts:');
      activeDiscounts.forEach(discount => {
        const expiresIn = Math.round((new Date(discount.expiresAt) - new Date()) / 1000 / 60);
        console.log(`  - ${discount.product.name} for ${discount.user.email}`);
        console.log(`    Price: $${discount.originalPrice} → $${discount.discountPrice} (${discount.discountPercent}% off)`);
        console.log(`    Expires in: ${expiresIn} minutes, In cart: ${discount.addedToCart}`);
        console.log(`    Source: ${discount.source}`);
      });
    }

    console.log('\n🎉 Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupExpiredDiscounts();
