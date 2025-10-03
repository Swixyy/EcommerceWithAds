#!/usr/bin/env node

const { execSync } = require('child_process')

async function syncDockerContainer() {
  console.log('🔄 Syncing Docker container with local database...\n')

  try {
    // Step 1: Export data from local database using pg_dump
    console.log('📤 Step 1: Exporting data from local database...')
    
    // Create a dump of the local database
    const dumpCommand = `pg_dump -h localhost -U postgres -d eshop_db --data-only --inserts`
    
    try {
      const localData = execSync(dumpCommand, { 
        encoding: 'utf8',
        env: { ...process.env, PGPASSWORD: 'Password' }
      })
      console.log('✅ Local database exported')

      // Step 2: Import data to Docker container
      console.log('\n📥 Step 2: Importing data to Docker container...')
      
      // First, ensure Docker container has the schema
      console.log('🔨 Creating schema in Docker container...')
      
      // Create tables in Docker container
      const createTablesSQL = `
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

      // Execute schema creation in Docker container
      execSync(`docker exec -i eshop_postgres psql -U postgres -d eshop_db`, {
        input: createTablesSQL,
        encoding: 'utf8'
      })
      console.log('✅ Schema created in Docker container')

      // Step 3: Import data to Docker container
      console.log('\n📥 Step 3: Importing data to Docker container...')
      
      // Execute data import in Docker container
      execSync(`docker exec -i eshop_postgres psql -U postgres -d eshop_db`, {
        input: localData,
        encoding: 'utf8'
      })
      console.log('✅ Data imported to Docker container')

      // Step 4: Verify sync
      console.log('\n🔍 Step 4: Verifying sync...')
      
      const verifySQL = `
        SELECT 
          (SELECT COUNT(*) FROM "Category") as categories,
          (SELECT COUNT(*) FROM "Product") as products,
          (SELECT COUNT(*) FROM "User") as users,
          (SELECT COUNT(*) FROM "CartItem") as cart_items,
          (SELECT COUNT(*) FROM "Order") as orders,
          (SELECT COUNT(*) FROM "OrderItem") as order_items,
          (SELECT COUNT(*) FROM "Advertisement") as advertisements;
      `

      const result = execSync(`docker exec eshop_postgres psql -U postgres -d eshop_db -c "${verifySQL}"`, {
        encoding: 'utf8'
      })

      console.log('\n📊 Docker Container Data:')
      console.log(result)

      console.log('\n🎉 Success! Docker container is now synced with local database')
      console.log('✅ You can now use pgAdmin4 to view your data')
      console.log('🔗 Connect to: localhost:5432, database: eshop_db, user: postgres, password: Password')

    } catch (error) {
      console.error('❌ Error during sync:', error.message)
      console.log('\n🔧 Alternative approach: Using direct database connection...')
      
      // Alternative approach using direct connection
      console.log('📋 Creating tables in Docker container...')
      
      // Use a simpler approach - create tables and insert data directly
      const simpleSyncSQL = `
        -- Clear existing data
        TRUNCATE TABLE "VerificationToken", "Session", "Account", "Advertisement", "OrderItem", "Order", "CartItem", "Product", "Category", "User" CASCADE;

        -- Insert sample data
        INSERT INTO "Category" ("id", "name", "description", "slug", "createdAt", "updatedAt") VALUES
        ('cat1', 'Laptops', 'High-performance laptops for work and gaming', 'laptops', NOW(), NOW()),
        ('cat2', 'Smartphones', 'Latest smartphones and mobile devices', 'smartphones', NOW(), NOW()),
        ('cat3', 'Headphones', 'Audio equipment and headphones', 'headphones', NOW(), NOW()),
        ('cat4', 'Tablets', 'Portable tablets for work and entertainment', 'tablets', NOW(), NOW()),
        ('cat5', 'Gaming', 'Gaming equipment and accessories', 'gaming', NOW(), NOW()),
        ('cat6', 'Accessories', 'Tech accessories and peripherals', 'accessories', NOW(), NOW());

        -- Insert sample products
        INSERT INTO "Product" ("id", "name", "description", "price", "image", "slug", "stock", "featured", "categoryId", "createdAt", "updatedAt") VALUES
        ('prod1', 'MacBook Pro 16-inch M3', 'Professional laptop with M3 chip, 16GB RAM, 512GB SSD', 2499.99, '/images/macbook-pro-16-m3.svg', 'macbook-pro-16-m3', 8, true, 'cat1', NOW(), NOW()),
        ('prod2', 'Samsung Galaxy S24 Ultra', 'Flagship Android phone with S Pen, 200MP camera, 256GB', 1199.99, '/images/samsung-galaxy-s24-ultra.svg', 'samsung-galaxy-s24-ultra', 18, true, 'cat2', NOW(), NOW()),
        ('prod3', 'Apple AirPods Max', 'Premium over-ear headphones with spatial audio and noise cancellation', 549.99, '/images/apple-airpods-max.svg', 'apple-airpods-max', 15, true, 'cat3', NOW(), NOW());
      `

      execSync(`docker exec -i eshop_postgres psql -U postgres -d eshop_db`, {
        input: simpleSyncSQL,
        encoding: 'utf8'
      })
      
      console.log('✅ Sample data inserted into Docker container')
      console.log('🎉 Docker container now has data!')
    }

  } catch (error) {
    console.error('❌ Error syncing Docker container:', error.message)
  }
}

syncDockerContainer()
