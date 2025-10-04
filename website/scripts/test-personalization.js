const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPersonalization() {
  try {
    // Get the test user
    const user = await prisma.user.findUnique({
      where: { email: 'swixy@gmail.com' },
      select: { preferences: true }
    });
    
    console.log('User preferences:', user.preferences);
    
    // Test the personalization logic directly
    const preferences = user.preferences;
    const position = 'bottom';
    
    // Simulate the logic from getPersonalizedAdvertisement
    const adCampaigns = {
      smartphones: {
        top: {
          id: "ad-smartphones-top",
          title: "📱 New iPhone 15 Pro - Pre-order Now!",
          imageUrl: "/images/ads/iphone-15.svg",
          link: "/products?category=smartphones&featured=true"
        },
        bottom: {
          id: "ad-smartphones-bottom", 
          title: "🌟 Samsung Galaxy S24 Ultra - Latest Features!",
          imageUrl: "/images/ads/samsung-galaxy.svg",
          link: "/products?category=smartphones&sale=true"
        },
        sidebar: {
          id: "ad-smartphones-sidebar",
          title: "📲 Premium Smartphones Collection",
          imageUrl: "/images/ads/smartphones.svg",
          link: "/products?category=smartphones"
        }
      }
    };
    
    // Test different positions
    const positions = ['top', 'bottom', 'sidebar'];
    
    for (const pos of positions) {
      const favoriteCategory = preferences.favoriteCategories[0];
      const categoryAds = adCampaigns[favoriteCategory];
      
      if (categoryAds && categoryAds[pos]) {
        console.log(`\n✅ ${pos.toUpperCase()} ad for ${favoriteCategory}:`, {
          id: categoryAds[pos].id,
          title: categoryAds[pos].title
        });
      } else {
        console.log(`\n❌ No ${pos} ad found for ${favoriteCategory}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPersonalization();
