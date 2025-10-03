#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database setup...')

  try {
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful')

    // Create categories
    console.log('📁 Creating categories...')
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: "laptops" },
        update: {},
        create: {
          name: "Laptops",
          description: "High-performance laptops for work and gaming",
          slug: "laptops",
        },
      }),
      prisma.category.upsert({
        where: { slug: "smartphones" },
        update: {},
        create: {
          name: "Smartphones",
          description: "Latest smartphones and mobile devices",
          slug: "smartphones",
        },
      }),
      prisma.category.upsert({
        where: { slug: "accessories" },
        update: {},
        create: {
          name: "Accessories",
          description: "Tech accessories and peripherals",
          slug: "accessories",
        },
      }),
    ])

    // Create products
    console.log('📦 Creating products...')
    const products = await Promise.all([
      prisma.product.upsert({
        where: { slug: "macbook-pro-16" },
        update: {},
        create: {
          name: "MacBook Pro 16-inch",
          description: "Powerful laptop with M3 Pro chip, perfect for professionals",
          price: 2499.99,
          image: "/images/macbook-pro-16.jpg",
          slug: "macbook-pro-16",
          stock: 10,
          featured: true,
          categoryId: categories[0].id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "iphone-15-pro" },
        update: {},
        create: {
          name: "iPhone 15 Pro",
          description: "Latest iPhone with titanium design and A17 Pro chip",
          price: 999.99,
          image: "/images/iphone-15-pro.jpg",
          slug: "iphone-15-pro",
          stock: 25,
          featured: true,
          categoryId: categories[1].id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "airpods-pro" },
        update: {},
        create: {
          name: "AirPods Pro (2nd generation)",
          description: "Active noise cancellation with spatial audio",
          price: 249.99,
          image: "/images/airpods-pro.jpg",
          slug: "airpods-pro",
          stock: 50,
          featured: false,
          categoryId: categories[2].id,
        },
      }),
      prisma.product.upsert({
        where: { slug: "dell-xps-13" },
        update: {},
        create: {
          name: "Dell XPS 13",
          description: "Ultrabook with stunning display and long battery life",
          price: 1299.99,
          image: "/images/dell-xps-13.jpg",
          slug: "dell-xps-13",
          stock: 15,
          featured: false,
          categoryId: categories[0].id,
        },
      }),
    ])

    // Create advertisements
    console.log('📢 Creating advertisements...')
    await Promise.all([
      prisma.advertisement.upsert({
        where: { id: "ad-laptop-sale" },
        update: {},
        create: {
          id: "ad-laptop-sale",
          title: "Laptop Sale - Up to 30% Off!",
          description: "Get the latest laptops at unbeatable prices",
          image: "/images/ads/laptop-sale.svg",
          link: "/products?category=laptops",
          targetCategory: "laptops",
          active: true,
        },
      }),
      prisma.advertisement.upsert({
        where: { id: "ad-smartphone-deal" },
        update: {},
        create: {
          id: "ad-smartphone-deal",
          title: "New Smartphones Available",
          description: "Check out our latest smartphone collection",
          image: "/images/ads/smartphone-deal.jpg",
          link: "/products?category=smartphones",
          targetCategory: "smartphones",
          active: true,
        },
      }),
      prisma.advertisement.upsert({
        where: { id: "ad-accessories" },
        update: {},
        create: {
          id: "ad-accessories",
          title: "Essential Tech Accessories",
          description: "Complete your setup with our accessories",
          image: "/images/ads/accessories.jpg",
          link: "/products?category=accessories",
          targetCategory: "accessories",
          active: true,
        },
      }),
    ])

    console.log('✅ Database setup completed successfully!')
    console.log(`📁 Created ${categories.length} categories`)
    console.log(`📦 Created ${products.length} products`)
    console.log('📢 Created 3 advertisements')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
