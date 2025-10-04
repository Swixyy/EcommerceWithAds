const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserPreferences() {
  const email = "swixy@gmail.com";
  
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        preferences: {
          adPreferences: ["technology", "mobile", "computing"],
          viewedCategories: ["smartphones", "laptops", "accessories"],
          favoriteCategories: ["smartphones", "laptops"] // Now has both!
        }
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        preferences: true 
      }
    });
    
    console.log(`✅ User '${user.name}' preferences updated successfully!`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 User ID: ${user.id}`);
    console.log(`⭐ Favorite Categories: ${user.preferences.favoriteCategories.join(', ')}`);
    console.log(`👀 Viewed Categories: ${user.preferences.viewedCategories.join(', ')}`);
    console.log(`🎯 Ad Preferences: ${user.preferences.adPreferences.join(', ')}`);
    
  } catch (error) {
    console.error("❌ Error updating user preferences:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserPreferences();
