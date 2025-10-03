#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')

async function updateImagePath() {
  const prisma = new PrismaClient()
  
  try {
    // First find the product by name
    const product = await prisma.product.findFirst({
      where: {
        name: 'Samsung Galaxy S24'
      }
    })
    
    if (!product) {
      console.log('❌ Samsung Galaxy S24 product not found')
      return
    }
    
    // Then update using the ID
    const updated = await prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        image: '/images/samsung-galaxy-s24.svg'
      }
    })
    
    console.log('✅ Updated Samsung Galaxy S24 image path to:', updated.image)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

updateImagePath()
