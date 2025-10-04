const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        name: 'swixy',
        email: 'swixy@gmail.com',
        password: hashedPassword,
        preferences: {
          viewedCategories: ['smartphones'],
          favoriteCategories: ['smartphones'],
          adPreferences: ['technology', 'mobile']
        }
      }
    });
    
    console.log('✅ User created successfully:', {
      id: user.id,
      name: user.name,
      email: user.email,
      preferences: user.preferences
    });
    
    // Test the personalized ads
    console.log('\n🧪 Testing personalized ads...');
    
    // Import the database function
    const { getPersonalizedAdvertisement } = require('../app/lib/database.ts');
    
    const userPreferences = user.preferences;
    
    console.log('User preferences:', userPreferences);
    
    // Test different ad positions
    const positions = ['top', 'bottom', 'sidebar'];
    
    for (const position of positions) {
      const ad = await getPersonalizedAdvertisement(userPreferences, position);
      console.log(`\n📢 ${position.toUpperCase()} ad:`, {
        id: ad.id,
        title: ad.title,
        category: 'smartphones'
      });
    }
    
  } catch (error) {
    console.error('❌ Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
