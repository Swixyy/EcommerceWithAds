import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data (optional - remove this if you want to keep existing data)
    console.log('🧹 Clearing existing data...')
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // Create categories
    console.log('📁 Creating categories...')
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Laptops',
          slug: 'laptops',
          description: 'High-performance laptops for work and gaming'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Latest smartphones and mobile devices'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Accessories',
          slug: 'accessories',
          description: 'Tech accessories and peripherals'
        }
      })
    ])

    console.log(`✅ Created ${categories.length} categories`)

    // Create products
    console.log('📦 Creating products...')
    const products = await Promise.all([
      // Laptops
      prisma.product.create({
        data: {
          name: 'MacBook Pro 15"',
          slug: 'macbook-pro-15',
          description: 'Powerful laptop with M3 chip, perfect for professionals',
          price: 2499.99,
          categoryId: categories[0].id,
          stock: 15,
          featured: true,
          image: '/images/products/macbook-pro-15.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Dell XPS 13',
          slug: 'dell-xps-13',
          description: 'Ultra-thin laptop with stunning display',
          price: 1299.99,
          categoryId: categories[0].id,
          stock: 20,
          featured: true,
          image: '/images/products/dell-xps-13.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Gaming Laptop RTX 4080',
          slug: 'gaming-laptop-rtx-4080',
          description: 'High-end gaming laptop with RTX 4080 graphics',
          price: 1999.99,
          categoryId: categories[0].id,
          stock: 8,
          featured: false,
          image: '/images/products/gaming-laptop.jpg'
        }
      }),

      // Smartphones
      prisma.product.create({
        data: {
          name: 'iPhone 15 Pro',
          slug: 'iphone-15-pro',
          description: 'Latest iPhone with titanium design and A17 Pro chip',
          price: 999.99,
          categoryId: categories[1].id,
          stock: 25,
          featured: true,
          image: '/images/products/iphone-15-pro.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Samsung Galaxy S24',
          slug: 'samsung-galaxy-s24',
          description: 'Premium Android smartphone with AI features',
          price: 899.99,
          categoryId: categories[1].id,
          stock: 18,
          featured: true,
          image: '/images/products/galaxy-s24.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Google Pixel 8',
          slug: 'google-pixel-8',
          description: 'Pure Android experience with excellent camera',
          price: 699.99,
          categoryId: categories[1].id,
          stock: 12,
          featured: false,
          image: '/images/products/pixel-8.jpg'
        }
      }),

      // Accessories
      prisma.product.create({
        data: {
          name: 'AirPods Pro 2',
          slug: 'airpods-pro-2',
          description: 'Wireless earbuds with active noise cancellation',
          price: 249.99,
          categoryId: categories[2].id,
          stock: 30,
          featured: true,
          image: '/images/products/airpods-pro-2.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wireless Charging Pad',
          slug: 'wireless-charging-pad',
          description: 'Fast wireless charging pad for smartphones',
          price: 49.99,
          categoryId: categories[2].id,
          stock: 40,
          featured: false,
          image: '/images/products/wireless-charger.jpg'
        }
      }),
      prisma.product.create({
        data: {
          name: 'USB-C Hub',
          slug: 'usb-c-hub',
          description: 'Multi-port USB-C hub with HDMI and USB 3.0',
          price: 79.99,
          categoryId: categories[2].id,
          stock: 25,
          featured: false,
          image: '/images/products/usb-c-hub.jpg'
        }
      })
    ])

    console.log(`✅ Created ${products.length} products`)

    // Create or find test user
    console.log('👤 Creating or finding test user...')
    let testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })
    
    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: '$2a$10$example.hash.here', // This is just a placeholder
          preferences: {
            favoriteCategories: ['laptops', 'smartphones'],
            adPreferences: ['electronics', 'gaming'],
            newsletter: true
          }
        }
      })
    }

    console.log(`✅ Created test user: ${testUser.email}`)

    // Create some sample cart items
    console.log('🛒 Creating sample cart items...')
    const cartItems = []
    
    try {
      const cartItem1 = await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: testUser.id,
            productId: products[0].id
          }
        },
        update: { quantity: 1 },
        create: {
          userId: testUser.id,
          productId: products[0].id,
          quantity: 1
        }
      })
      cartItems.push(cartItem1)
      
      const cartItem2 = await prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: testUser.id,
            productId: products[3].id
          }
        },
        update: { quantity: 2 },
        create: {
          userId: testUser.id,
          productId: products[3].id,
          quantity: 2
        }
      })
      cartItems.push(cartItem2)
    } catch (error) {
      console.log('Note: Some cart items may already exist')
    }

    console.log(`✅ Created ${cartItems.length} cart items`)

    // Create a sample order
    console.log('📋 Creating sample order...')
    const order = await prisma.order.create({
      data: {
        userId: testUser.id,
        total: 4499.97, // MacBook Pro + 2x iPhone 15 Pro
        status: 'PENDING',
        items: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              price: 2499.99
            },
            {
              productId: products[3].id,
              quantity: 2,
              price: 999.99
            }
          ]
        }
      }
    })

    console.log(`✅ Created sample order: ${order.id}`)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- ${categories.length} categories created`)
    console.log(`- ${products.length} products created`)
    console.log(`- 1 test user created`)
    console.log(`- ${cartItems.length} cart items created`)
    console.log(`- 1 sample order created`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
