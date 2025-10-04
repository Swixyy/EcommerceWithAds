const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserToSingleCategory() {
  const email = "swixy@gmail.com";
  
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        preferences: {
          adPreferences: ["technology", "mobile"],
          viewedCategories: ["smartphones", "laptops", "accessories"],
          favoriteCategory: "smartphones" // Now using single category instead of array
        }
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        preferences: true 
      }
    });
    
    console.log(`✅ User '${user.name}' updated to single category format!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 User ID: ${user.id}`);
    console.log(`⭐ Favorite Category: ${user.preferences.favoriteCategory}`);
    console.log(`👀 Viewed Categories: ${user.preferences.viewedCategories.join(', ')}`);
    console.log(`🎯 Ad Preferences: ${user.preferences.adPreferences.join(', ')}`);
    
  } catch (error) {
    console.error("❌ Error updating user preferences:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserToSingleCategory();
