const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSidebarAlgorithm() {
  try {
    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { email: "swixy@gmail.com" },
      select: { preferences: true }
    });

    console.log("🔍 USER PREFERENCES:");
    console.log(JSON.stringify(user.preferences, null, 2));

    // Test the algorithm logic
    const testCases = [
      { currentCategory: "smartphones", expectedTarget: "laptops" },
      { currentCategory: "laptops", expectedTarget: "smartphones" },
      { currentCategory: "accessories", expectedTarget: "smartphones" } // non-favorite should show first favorite
    ];

    console.log("\n🧪 TESTING ALGORITHM LOGIC:");
    
    for (const testCase of testCases) {
      const currentProductCategory = testCase.currentCategory;
      const userPreferences = user.preferences;
      
      let targetCategory = currentProductCategory;
      
      if (userPreferences?.favoriteCategories?.length) {
        const favorites = userPreferences.favoriteCategories;
        
        if (favorites.includes(currentProductCategory)) {
          targetCategory = favorites.find(fav => fav !== currentProductCategory) || favorites[0];
        } else {
          targetCategory = favorites[0];
        }
      }
      
      const isCorrect = targetCategory === testCase.expectedTarget;
      console.log(`✅ ${testCase.currentCategory} → ${targetCategory} (expected: ${testCase.expectedTarget}) ${isCorrect ? '✅' : '❌'}`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSidebarAlgorithm();
