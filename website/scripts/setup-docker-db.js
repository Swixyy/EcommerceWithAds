#!/usr/bin/env node

const { execSync } = require('child_process')

function setupDockerDatabase() {
  console.log('🔄 Setting up Docker database...\n')

  try {
    // Step 1: Create database schema in Docker container
    console.log('📋 Step 1: Creating database schema...')
    
    const createSchemaSQL = `
      -- Create database if not exists
      SELECT 'CREATE DATABASE eshop_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eshop_db');
      
      -- Connect to eshop_db database
      \\c eshop_db;
      
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS "VerificationToken" CASCADE;
      DROP TABLE IF EXISTS "Session" CASCADE;
      DROP TABLE IF EXISTS "Account" CASCADE;
      DROP TABLE IF EXISTS "Advertisement" CASCADE;
      DROP TABLE IF EXISTS "OrderItem" CASCADE;
      DROP TABLE IF EXISTS "Order" CASCADE;
      DROP TABLE IF EXISTS "CartItem" CASCADE;
      DROP TABLE IF EXISTS "Product" CASCADE;
      DROP TABLE IF EXISTS "Category" CASCADE;
      DROP TABLE IF EXISTS "User" CASCADE;

      -- Create User table
      CREATE TABLE "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "password" TEXT,
        "preferences" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );

      -- Create Category table
      CREATE TABLE "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "slug" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );

      -- Create Product table
      CREATE TABLE "Product" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "price" DOUBLE PRECISION NOT NULL,
        "image" TEXT,
        "slug" TEXT NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "categoryId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
      );

      -- Create CartItem table
      CREATE TABLE "CartItem" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
      );

      -- Create Order table
      CREATE TABLE "Order" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "total" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
      );

      -- Create OrderItem table
      CREATE TABLE "OrderItem" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "quantity" INTEGER NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
      );

      -- Create Advertisement table
      CREATE TABLE "Advertisement" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "image" TEXT NOT NULL,
        "link" TEXT,
        "targetCategory" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Advertisement_pkey" PRIMARY KEY ("id")
      );

      -- Create Account table
      CREATE TABLE "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
      );

      -- Create Session table
      CREATE TABLE "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
      );

      -- Create VerificationToken table
      CREATE TABLE "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
      );

      -- Create indexes
      CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
      CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
      CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
      CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
      CREATE UNIQUE INDEX "CartItem_userId_productId_key" ON "CartItem"("userId","productId");
      CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider","providerAccountId");
      CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

      -- Create foreign key constraints
      ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    `

    // Execute schema creation
    execSync(`docker exec -i eshop_postgres psql -U postgres`, {
      input: createSchemaSQL,
      encoding: 'utf8'
    })
    console.log('✅ Database schema created')

    // Step 2: Insert sample data
    console.log('\n📦 Step 2: Inserting sample data...')
    
    const insertDataSQL = `
      \\c eshop_db;
      
      -- Insert categories
      INSERT INTO "Category" ("id", "name", "description", "slug", "createdAt", "updatedAt") VALUES
      ('cat1', 'Laptops', 'High-performance laptops for work and gaming', 'laptops', NOW(), NOW()),
      ('cat2', 'Smartphones', 'Latest smartphones and mobile devices', 'smartphones', NOW(), NOW()),
      ('cat3', 'Headphones', 'Audio equipment and headphones', 'headphones', NOW(), NOW()),
      ('cat4', 'Tablets', 'Portable tablets for work and entertainment', 'tablets', NOW(), NOW()),
      ('cat5', 'Gaming', 'Gaming equipment and accessories', 'gaming', NOW(), NOW()),
      ('cat6', 'Accessories', 'Tech accessories and peripherals', 'accessories', NOW(), NOW());

      -- Insert products
      INSERT INTO "Product" ("id", "name", "description", "price", "image", "slug", "stock", "featured", "categoryId", "createdAt", "updatedAt") VALUES
      ('prod1', 'MacBook Pro 16-inch M3', 'Professional laptop with M3 chip, 16GB RAM, 512GB SSD', 2499.99, '/images/macbook-pro-16-m3.svg', 'macbook-pro-16-m3', 8, true, 'cat1', NOW(), NOW()),
      ('prod2', 'Samsung Galaxy S24 Ultra', 'Flagship Android phone with S Pen, 200MP camera, 256GB', 1199.99, '/images/samsung-galaxy-s24-ultra.svg', 'samsung-galaxy-s24-ultra', 18, true, 'cat2', NOW(), NOW()),
      ('prod3', 'Apple AirPods Max', 'Premium over-ear headphones with spatial audio and noise cancellation', 549.99, '/images/apple-airpods-max.svg', 'apple-airpods-max', 15, true, 'cat3', NOW(), NOW()),
      ('prod4', 'iPad Air 5th Gen', 'Tablet with M1 chip, 10.9-inch display, 256GB storage', 749.99, '/images/ipad-air-5th-gen.svg', 'ipad-air-5th-gen', 20, true, 'cat4', NOW(), NOW()),
      ('prod5', 'PlayStation 5', 'Next-gen gaming console with 825GB SSD, DualSense controller', 499.99, '/images/playstation-5.svg', 'playstation-5', 15, true, 'cat5', NOW(), NOW()),
      ('prod6', 'Anker PowerCore 26800', 'High-capacity portable charger with 26,800mAh battery', 79.99, '/images/anker-powercore-26800.svg', 'anker-powercore-26800', 50, false, 'cat6', NOW(), NOW());

      -- Insert sample user
      INSERT INTO "User" ("id", "name", "email", "createdAt", "updatedAt") VALUES
      ('user1', 'Test User', 'test@example.com', NOW(), NOW());

      -- Insert sample advertisements
      INSERT INTO "Advertisement" ("id", "title", "description", "image", "link", "targetCategory", "active", "createdAt", "updatedAt") VALUES
      ('ad1', '🔥 Flash Sale: Up to 50% Off Laptops!', 'Get the latest laptops at unbeatable prices', '/images/ads/laptop-sale.svg', '/products?category=laptops&sale=true', 'laptops', true, NOW(), NOW()),
      ('ad2', '📱 New Smartphones Arrived!', 'Check out the latest smartphone collection', '/images/ads/smartphone-ad.svg', '/products?category=smartphones', 'smartphones', true, NOW(), NOW());
    `

    // Execute data insertion
    execSync(`docker exec -i eshop_postgres psql -U postgres`, {
      input: insertDataSQL,
      encoding: 'utf8'
    })
    console.log('✅ Sample data inserted')

    // Step 3: Verify setup
    console.log('\n🔍 Step 3: Verifying setup...')
    
    const verifySQL = `
      \\c eshop_db;
      SELECT 
        (SELECT COUNT(*) FROM "Category") as categories,
        (SELECT COUNT(*) FROM "Product") as products,
        (SELECT COUNT(*) FROM "User") as users,
        (SELECT COUNT(*) FROM "Advertisement") as advertisements;
    `

    const result = execSync(`docker exec eshop_postgres psql -U postgres -c "${verifySQL}"`, {
      encoding: 'utf8'
    })

    console.log('\n📊 Docker Container Data:')
    console.log(result)

    console.log('\n🎉 Success! Docker container is now set up with sample data')
    console.log('✅ You can now use pgAdmin4 to view your data')
    console.log('🔗 Connection details:')
    console.log('   Host: localhost')
    console.log('   Port: 5432')
    console.log('   Database: eshop_db')
    console.log('   Username: postgres')
    console.log('   Password: Password')

  } catch (error) {
    console.error('❌ Error setting up Docker database:', error.message)
  }
}

setupDockerDatabase()
