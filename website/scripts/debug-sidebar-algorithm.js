const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugSidebarAlgorithm() {
  try {
    // Get user preferences
    const user = await prisma.user.findUnique({
      where: { email: "swixy@gmail.com" },
      select: { preferences: true }
    });

    console.log("🔍 USER PREFERENCES:");
    console.log(JSON.stringify(user.preferences, null, 2));

    const currentProductCategory = "smartphones";
    const userPreferences = user.preferences;

    console.log("\n🧠 ALGORITHM LOGIC:");
    console.log(`Current product category: ${currentProductCategory}`);
    console.log(`User favorite categories: ${userPreferences.favoriteCategories.join(', ')}`);
    console.log(`User viewed categories: ${userPreferences.viewedCategories.join(', ')}`);

    let targetCategory = currentProductCategory;
    
    if (userPreferences?.favoriteCategories?.length) {
      const favorites = userPreferences.favoriteCategories;
      
      console.log(`\n✅ User has favorite categories: ${favorites.join(', ')}`);
      
      if (favorites.includes(currentProductCategory)) {
        console.log(`✅ Current category (${currentProductCategory}) IS in favorites`);
        targetCategory = favorites.find(fav => fav !== currentProductCategory) || favorites[0];
        console.log(`🎯 Selected target category: ${targetCategory}`);
      } else {
        console.log(`❌ Current category (${currentProductCategory}) is NOT in favorites`);
        targetCategory = favorites[0];
        console.log(`🎯 Selected target category: ${targetCategory}`);
      }
    }

    console.log(`\n🏁 FINAL TARGET CATEGORY: ${targetCategory}`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSidebarAlgorithm();
