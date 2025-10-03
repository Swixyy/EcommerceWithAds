#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const { execSync } = require('child_process')

// Create Prisma client for local database
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Password@localhost:5432/eshop_db?schema=public&sslmode=disable"
    }
  }
})

// Create Prisma client for Docker database
const dockerPrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:Password@localhost:5432/eshop_db?schema=public&sslmode=disable"
    }
  }
})

async function syncDockerWithLocal() {
  console.log('🔄 Syncing Docker container with local database...\n')

  try {
    // First, let's use Prisma to push the schema to Docker
    console.log('📋 Step 1: Pushing schema to Docker container...')
    
    // Set environment to use Docker
    process.env.DATABASE_URL = "postgresql://postgres:Password@localhost:5432/eshop_db?schema=public&sslmode=disable"
    
    // Push schema to Docker
    execSync('npx prisma db push --accept-data-loss', { 
      stdio: 'inherit',
      cwd: process.cwd()
    })
    
    console.log('✅ Schema pushed to Docker container')

    // Step 2: Export data from local database
    console.log('\n📤 Step 2: Exporting data from local database...')
    
    try {
      // Connect to local database
      await localPrisma.$connect()
      console.log('✅ Connected to local database')

      // Get all categories
      const categories = await localPrisma.category.findMany()
      console.log(`📁 Found ${categories.length} categories`)

      // Get all products
      const products = await localPrisma.product.findMany({
        include: { category: true }
      })
      console.log(`📦 Found ${products.length} products`)

      // Get all users
      const users = await localPrisma.user.findMany()
      console.log(`👥 Found ${users.length} users`)

      // Get all cart items
      const cartItems = await localPrisma.cartItem.findMany()
      console.log(`🛒 Found ${cartItems.length} cart items`)

      // Get all orders
      const orders = await localPrisma.order.findMany()
      console.log(`📋 Found ${orders.length} orders`)

      // Get all order items
      const orderItems = await localPrisma.orderItem.findMany()
      console.log(`📄 Found ${orderItems.length} order items`)

      // Get all advertisements
      const advertisements = await localPrisma.advertisement.findMany()
      console.log(`📢 Found ${advertisements.length} advertisements`)

      // Step 3: Import data to Docker database
      console.log('\n📥 Step 3: Importing data to Docker container...')
      
      // Connect to Docker database
      await dockerPrisma.$connect()
      console.log('✅ Connected to Docker database')

      // Insert categories
      if (categories.length > 0) {
        console.log('📁 Inserting categories...')
        for (const category of categories) {
          await dockerPrisma.category.upsert({
            where: { id: category.id },
            update: category,
            create: category
          })
        }
        console.log(`✅ Inserted ${categories.length} categories`)
      }

      // Insert products
      if (products.length > 0) {
        console.log('📦 Inserting products...')
        for (const product of products) {
          await dockerPrisma.product.upsert({
            where: { id: product.id },
            update: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              slug: product.slug,
              stock: product.stock,
              featured: product.featured,
              categoryId: product.categoryId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt
            },
            create: {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image: product.image,
              slug: product.slug,
              stock: product.stock,
              featured: product.featured,
              categoryId: product.categoryId,
              createdAt: product.createdAt,
              updatedAt: product.updatedAt
            }
          })
        }
        console.log(`✅ Inserted ${products.length} products`)
      }

      // Insert users
      if (users.length > 0) {
        console.log('👥 Inserting users...')
        for (const user of users) {
          await dockerPrisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user
          })
        }
        console.log(`✅ Inserted ${users.length} users`)
      }

      // Insert cart items
      if (cartItems.length > 0) {
        console.log('🛒 Inserting cart items...')
        for (const item of cartItems) {
          await dockerPrisma.cartItem.upsert({
            where: { id: item.id },
            update: item,
            create: item
          })
        }
        console.log(`✅ Inserted ${cartItems.length} cart items`)
      }

      // Insert orders
      if (orders.length > 0) {
        console.log('📋 Inserting orders...')
        for (const order of orders) {
          await dockerPrisma.order.upsert({
            where: { id: order.id },
            update: order,
            create: order
          })
        }
        console.log(`✅ Inserted ${orders.length} orders`)
      }

      // Insert order items
      if (orderItems.length > 0) {
        console.log('📄 Inserting order items...')
        for (const item of orderItems) {
          await dockerPrisma.orderItem.upsert({
            where: { id: item.id },
            update: item,
            create: item
          })
        }
        console.log(`✅ Inserted ${orderItems.length} order items`)
      }

      // Insert advertisements
      if (advertisements.length > 0) {
        console.log('📢 Inserting advertisements...')
        for (const ad of advertisements) {
          await dockerPrisma.advertisement.upsert({
            where: { id: ad.id },
            update: ad,
            create: ad
          })
        }
        console.log(`✅ Inserted ${advertisements.length} advertisements`)
      }

      // Step 4: Verify sync
      console.log('\n🔍 Step 4: Verifying sync...')
      
      const dockerCategories = await dockerPrisma.category.count()
      const dockerProducts = await dockerPrisma.product.count()
      const dockerUsers = await dockerPrisma.user.count()
      const dockerCartItems = await dockerPrisma.cartItem.count()
      const dockerOrders = await dockerPrisma.order.count()
      const dockerOrderItems = await dockerPrisma.orderItem.count()
      const dockerAds = await dockerPrisma.advertisement.count()

      console.log('\n📊 Sync Results:')
      console.log(`Categories: ${categories.length} → ${dockerCategories}`)
      console.log(`Products: ${products.length} → ${dockerProducts}`)
      console.log(`Users: ${users.length} → ${dockerUsers}`)
      console.log(`Cart Items: ${cartItems.length} → ${dockerCartItems}`)
      console.log(`Orders: ${orders.length} → ${dockerOrders}`)
      console.log(`Order Items: ${orderItems.length} → ${dockerOrderItems}`)
      console.log(`Advertisements: ${advertisements.length} → ${dockerAds}`)

      if (dockerProducts === products.length && dockerCategories === categories.length) {
        console.log('\n🎉 Success! Docker container is now synced with local database')
        console.log('✅ You can now use pgAdmin4 to view your data')
      } else {
        console.log('\n⚠️  Warning: Some data may not have synced correctly')
      }

    } catch (error) {
      console.error('❌ Error during data sync:', error.message)
    }

  } catch (error) {
    console.error('❌ Error syncing Docker container:', error.message)
  } finally {
    await localPrisma.$disconnect()
    await dockerPrisma.$disconnect()
  }
}

syncDockerWithLocal()
