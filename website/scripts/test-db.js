#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Test if tables exist
    const categories = await prisma.category.count()
    const products = await prisma.product.count()
    const advertisements = await prisma.advertisement.count()
    
    console.log('📊 Database statistics:')
    console.log(`   Categories: ${categories}`)
    console.log(`   Products: ${products}`)
    console.log(`   Advertisements: ${advertisements}`)
    
    if (categories === 0) {
      console.log('⚠️  No categories found. Run "npm run db:setup" to seed the database.')
    }
    
    console.log('✅ Database test completed successfully!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message)
    
    if (error.code === 'P1001') {
      console.log('💡 Tip: Make sure PostgreSQL is running and the DATABASE_URL is correct.')
    } else if (error.code === 'P1003') {
      console.log('💡 Tip: The database might not exist. Create it first.')
    }
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
