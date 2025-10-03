#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

async function checkDatabaseConnection() {
  console.log('🔍 Checking database connection...\n')

  try {
    // Connect to the database using current .env.local configuration
    const prisma = new PrismaClient()
    await prisma.$connect()
    console.log('✅ Connected to database')

    // Get database info
    const dbInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `
    
    console.log('\n📊 Database Connection Info:')
    console.log('Database:', dbInfo[0].database_name)
    console.log('User:', dbInfo[0].current_user)
    console.log('Server IP:', dbInfo[0].server_ip || 'localhost')
    console.log('Server Port:', dbInfo[0].server_port || '5432')

    // Check if we're connected to Docker or local
    const isDocker = dbInfo[0].server_ip !== null
    console.log('\n🐳 Connection Type:', isDocker ? 'Docker Container' : 'Local PostgreSQL')

    // Get table counts
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    console.log(`\n📋 Tables in database (${tables.length}):`)
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table.table_name}`)
    })

    // Get product count
    const productCount = await prisma.product.count()
    console.log(`\n📦 Products in database: ${productCount}`)

    // Get sample products
    const sampleProducts = await prisma.product.findMany({
      take: 3,
      select: {
        name: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      }
    })

    console.log('\n🛍️ Sample Products:')
    sampleProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.category.name})`)
    })

    // Get category count
    const categoryCount = await prisma.category.count()
    console.log(`\n📁 Categories in database: ${categoryCount}`)

    // Get sample categories
    const sampleCategories = await prisma.category.findMany({
      take: 3,
      select: {
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    console.log('\n📂 Sample Categories:')
    sampleCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category._count.products} products)`)
    })

    console.log('\n🎯 Summary:')
    console.log(`✅ Connected to: ${isDocker ? 'Docker PostgreSQL' : 'Local PostgreSQL'}`)
    console.log(`✅ Database: ${dbInfo[0].database_name}`)
    console.log(`✅ Tables: ${tables.length}`)
    console.log(`✅ Products: ${productCount}`)
    console.log(`✅ Categories: ${categoryCount}`)

    if (isDocker) {
      console.log('\n🐳 Your app is connected to the Docker container!')
      console.log('✅ pgAdmin4 will show the same data as your app')
    } else {
      console.log('\n💻 Your app is connected to local PostgreSQL!')
      console.log('⚠️  pgAdmin4 (Docker) will show different data than your app')
      console.log('💡 To sync: Update .env.local to point to Docker or sync the data')
    }

  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
  }
}

checkDatabaseConnection()
