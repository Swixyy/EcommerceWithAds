const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkLaptopProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        category: { slug: 'laptops' } 
      },
      select: { 
        name: true, 
        price: true,
        slug: true
      },
      orderBy: { price: 'asc' }
    });
    
    console.log('Laptop products:');
    products.forEach(p => {
      console.log(`- ${p.name}: $${p.price} (slug: ${p.slug})`);
    });
    
    console.log(`\nTotal laptop products: ${products.length}`);
    
    // Check price ranges
    const lowRange = products.filter(p => p.price >= 0 && p.price <= 350);
    const midRange = products.filter(p => p.price > 350 && p.price <= 700);
    const highRange = products.filter(p => p.price > 700);
    
    console.log(`\nPrice ranges:`);
    console.log(`- 0-350: ${lowRange.length} products`);
    console.log(`- 350-700: ${midRange.length} products`);
    console.log(`- 700+: ${highRange.length} products`);
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLaptopProducts();
