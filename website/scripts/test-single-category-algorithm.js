const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSingleCategoryAlgorithm() {
  try {
    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { email: "swixy@gmail.com" },
      select: { preferences: true }
    });

    console.log("🔍 USER PREFERENCES (Single Category):");
    console.log(JSON.stringify(user.preferences, null, 2));

    // Test the algorithm logic
    const testCases = [
      { currentCategory: "smartphones", expectedTarget: "accessories", reason: "User viewing favorite category → show accessories for cross-selling" },
      { currentCategory: "laptops", expectedTarget: "smartphones", reason: "User viewing non-favorite → show favorite category" },
      { currentCategory: "accessories", expectedTarget: "smartphones", reason: "User viewing non-favorite → show favorite category" }
    ];

    console.log("\n🧪 TESTING SINGLE CATEGORY ALGORITHM:");
    
    for (const testCase of testCases) {
      const currentProductCategory = testCase.currentCategory;
      const userPreferences = user.preferences;
      
      let targetCategory = currentProductCategory;
      
      if (userPreferences?.favoriteCategory) {
        const favoriteCategory = userPreferences.favoriteCategory;
        
        if (favoriteCategory === currentProductCategory) {
          // User is viewing their favorite category - show them a related category for cross-selling
          targetCategory = "accessories"; // Default fallback for cross-selling
        } else {
          // User is viewing a non-favorite category - show them their favorite category
          targetCategory = favoriteCategory;
        }
      }
      
      const isCorrect = targetCategory === testCase.expectedTarget;
      console.log(`✅ ${testCase.currentCategory} → ${targetCategory} (expected: ${testCase.expectedTarget}) ${isCorrect ? '✅' : '❌'}`);
      console.log(`   Reason: ${testCase.reason}`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSingleCategoryAlgorithm();
