# TechShop - E-commerce Website

A modern e-commerce website built with Next.js, featuring personalized advertisements and user management.

## Features

- 🛍️ **Product Catalog** - Browse technology products with categories
- 👤 **User Authentication** - Sign up, login, and profile management
- 🛒 **Shopping Cart** - Add and manage items in your cart
- 🎯 **Personalized Ads** - Targeted advertisements based on user preferences
- 🛠️ **Admin Panel** - Manage products, users, and advertisements
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/eshop_db?schema=public"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GITHUB_CLIENT_ID=""
   GITHUB_CLIENT_SECRET=""
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Project Structure

```
website/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   ├── cart/              # Shopping cart pages
│   ├── profile/           # User profile pages
│   └── admin/             # Admin panel pages
├── src/
│   ├── components/        # React components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript types
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## Database Schema

The application uses the following main entities:

- **Users** - User accounts with preferences
- **Products** - Product catalog with categories
- **Categories** - Product categorization
- **Cart Items** - Shopping cart functionality
- **Orders** - Order management
- **Advertisements** - Personalized ads system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.