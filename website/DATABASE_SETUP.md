# Database Setup Guide

This guide will help you set up the PostgreSQL database for the TechShop e-commerce application.

## Prerequisites

1. **PostgreSQL** installed on your system
2. **Node.js** and **npm** installed
3. **Environment variables** configured

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user

### macOS
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Step 2: Create Database

1. **Connect to PostgreSQL**:
   ```bash
   psql -U postgres
   ```

2. **Create the database**:
   ```sql
   CREATE DATABASE eshop_db;
   ```

3. **Create a user** (optional, you can use postgres user):
   ```sql
   CREATE USER eshop_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE eshop_db TO eshop_user;
   ```

4. **Exit PostgreSQL**:
   ```sql
   \q
   ```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root with the following content:

```env
# Database
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/eshop_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

**Important**: Replace `your_password` with your actual PostgreSQL password.

## Step 4: Set Up Database Schema

1. **Generate Prisma client**:
   ```bash
   npm run db:generate
   ```

2. **Push schema to database**:
   ```bash
   npm run db:push
   ```

3. **Seed the database with sample data**:
   ```bash
   npm run db:setup
   ```

## Step 5: Verify Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**:
   - Visit `http://localhost:3002/api/products`
   - Visit `http://localhost:3002/api/categories`

3. **Open Prisma Studio** (optional):
   ```bash
   npm run db:studio
   ```

## Available Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:setup` - Complete database setup with sample data
- `npm run db:studio` - Open Prisma Studio

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_ctl status`
- Check if the database exists: `psql -U postgres -l`
- Verify connection string in `.env.local`

### Permission Issues
- Ensure the user has proper permissions on the database
- Check if the database exists and is accessible

### Port Issues
- Default PostgreSQL port is 5432
- If using a different port, update the `DATABASE_URL`

## Database Schema

The application includes the following main tables:

- **Users** - User accounts and preferences
- **Products** - Product catalog
- **Categories** - Product categories
- **CartItems** - Shopping cart items
- **Orders** - Order information
- **OrderItems** - Individual order items
- **Advertisements** - Personalized ads
- **Accounts/Sessions** - NextAuth.js tables

## Next Steps

Once the database is set up, you can:

1. Start implementing the product catalog pages
2. Set up user authentication
3. Build the shopping cart functionality
4. Implement the personalized advertisement system
