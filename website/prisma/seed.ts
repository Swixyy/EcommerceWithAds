import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Create categories
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
    prisma.category.upsert({
      where: { slug: "tablets" },
      update: {},
      create: {
        name: "Tablets",
        description: "Portable tablets for work and entertainment",
        slug: "tablets",
      },
    }),
    prisma.category.upsert({
      where: { slug: "headphones" },
      update: {},
      create: {
        name: "Headphones",
        description: "Audio equipment and headphones",
        slug: "headphones",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        name: "Gaming",
        description: "Gaming equipment and accessories",
        slug: "gaming",
      },
    }),
  ])

  // Create products
  const products = await Promise.all([
    // Laptops
    prisma.product.upsert({
      where: { slug: "macbook-pro-16" },
      update: {},
      create: {
        name: "MacBook Pro 16-inch",
        description: "Powerful laptop with M3 Pro chip, perfect for professionals",
        price: 2499.99,
        image: "/images/macbook-pro-16.svg",
        slug: "macbook-pro-16",
        stock: 10,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "dell-xps-13" },
      update: {},
      create: {
        name: "Dell XPS 13",
        description: "Ultrabook with stunning display and long battery life",
        price: 1299.99,
        image: "/images/dell-xps-13.svg",
        slug: "dell-xps-13",
        stock: 15,
        featured: false,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "hp-spectre-x360" },
      update: {},
      create: {
        name: "HP Spectre x360",
        description: "2-in-1 convertible laptop with 360-degree hinge",
        price: 1199.99,
        image: "/images/hp-spectre-x360.svg",
        slug: "hp-spectre-x360",
        stock: 12,
        featured: false,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "asus-rog-strix" },
      update: {},
      create: {
        name: "ASUS ROG Strix G15",
        description: "Gaming laptop with RTX 4060 and high refresh rate display",
        price: 1499.99,
        image: "/images/asus-rog-strix.svg",
        slug: "asus-rog-strix",
        stock: 8,
        featured: true,
        categoryId: categories[0].id,
      },
    }),

    // Smartphones
    prisma.product.upsert({
      where: { slug: "iphone-15-pro" },
      update: {},
      create: {
        name: "iPhone 15 Pro",
        description: "Latest iPhone with titanium design and A17 Pro chip",
        price: 999.99,
        image: "/images/iphone-15-pro.svg",
        slug: "iphone-15-pro",
        stock: 25,
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "samsung-galaxy-s24" },
      update: {},
      create: {
        name: "Samsung Galaxy S24",
        description: "Premium Android smartphone with AI features",
        price: 799.99,
        image: "/images/samsung-galaxy-s24.svg",
        slug: "samsung-galaxy-s24",
        stock: 20,
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "google-pixel-8" },
      update: {},
      create: {
        name: "Google Pixel 8",
        description: "Pure Android experience with advanced camera features",
        price: 699.99,
        image: "/images/google-pixel-8.svg",
        slug: "google-pixel-8",
        stock: 18,
        featured: false,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "oneplus-12" },
      update: {},
      create: {
        name: "OnePlus 12",
        description: "Flagship killer with fast charging and smooth performance",
        price: 799.99,
        image: "/images/oneplus-12.svg",
        slug: "oneplus-12",
        stock: 15,
        featured: false,
        categoryId: categories[1].id,
      },
    }),

    // Tablets
    prisma.product.upsert({
      where: { slug: "ipad-pro-12-9" },
      update: {},
      create: {
        name: "iPad Pro 12.9-inch",
        description: "Professional tablet with M2 chip and Liquid Retina XDR display",
        price: 1099.99,
        image: "/images/ipad-pro-12-9.svg",
        slug: "ipad-pro-12-9",
        stock: 12,
        featured: true,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "samsung-tab-s9" },
      update: {},
      create: {
        name: "Samsung Galaxy Tab S9",
        description: "Premium Android tablet with S Pen included",
        price: 799.99,
        image: "/images/samsung-tab-s9.svg",
        slug: "samsung-tab-s9",
        stock: 10,
        featured: false,
        categoryId: categories[3].id,
      },
    }),

    // Headphones
    prisma.product.upsert({
      where: { slug: "airpods-pro" },
      update: {},
      create: {
        name: "AirPods Pro (2nd generation)",
        description: "Active noise cancellation with spatial audio",
        price: 249.99,
        image: "/images/airpods-pro.svg",
        slug: "airpods-pro",
        stock: 50,
        featured: true,
        categoryId: categories[4].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "sony-wh-1000xm5" },
      update: {},
      create: {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling wireless headphones",
        price: 399.99,
        image: "/images/sony-wh-1000xm5.svg",
        slug: "sony-wh-1000xm5",
        stock: 25,
        featured: true,
        categoryId: categories[4].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "bose-quietcomfort-45" },
      update: {},
      create: {
        name: "Bose QuietComfort 45",
        description: "Premium noise-canceling headphones with superior comfort",
        price: 329.99,
        image: "/images/bose-quietcomfort-45.svg",
        slug: "bose-quietcomfort-45",
        stock: 20,
        featured: false,
        categoryId: categories[4].id,
      },
    }),

    // Gaming
    prisma.product.upsert({
      where: { slug: "ps5-console" },
      update: {},
      create: {
        name: "PlayStation 5 Console",
        description: "Next-gen gaming console with 4K gaming and ray tracing",
        price: 499.99,
        image: "/images/ps5-console.svg",
        slug: "ps5-console",
        stock: 5,
        featured: true,
        categoryId: categories[5].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "xbox-series-x" },
      update: {},
      create: {
        name: "Xbox Series X",
        description: "Most powerful Xbox console with 4K gaming",
        price: 499.99,
        image: "/images/xbox-series-x.svg",
        slug: "xbox-series-x",
        stock: 7,
        featured: true,
        categoryId: categories[5].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "nintendo-switch-oled" },
      update: {},
      create: {
        name: "Nintendo Switch OLED",
        description: "Handheld gaming console with vibrant OLED display",
        price: 349.99,
        image: "/images/nintendo-switch-oled.svg",
        slug: "nintendo-switch-oled",
        stock: 15,
        featured: false,
        categoryId: categories[5].id,
      },
    }),

    // Accessories
    prisma.product.upsert({
      where: { slug: "magic-mouse" },
      update: {},
      create: {
        name: "Apple Magic Mouse",
        description: "Wireless mouse with multi-touch surface",
        price: 79.99,
        image: "/images/magic-mouse.svg",
        slug: "magic-mouse",
        stock: 30,
        featured: false,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "logitech-mx-master-3" },
      update: {},
      create: {
        name: "Logitech MX Master 3",
        description: "Advanced wireless mouse for productivity",
        price: 99.99,
        image: "/images/logitech-mx-master-3.svg",
        slug: "logitech-mx-master-3",
        stock: 25,
        featured: false,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "apple-watch-series-9" },
      update: {},
      create: {
        name: "Apple Watch Series 9",
        description: "Smartwatch with health monitoring and fitness tracking",
        price: 399.99,
        image: "/images/apple-watch-series-9.svg",
        slug: "apple-watch-series-9",
        stock: 20,
        featured: true,
        categoryId: categories[2].id,
      },
    }),
  ])

  // Create advertisements
  await Promise.all([
    // Laptop Ads
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
      where: { id: "ad-gaming-laptops" },
      update: {},
      create: {
        id: "ad-gaming-laptops",
        title: "Gaming Laptops - RTX Graphics",
        description: "High-performance gaming laptops with latest RTX graphics",
        image: "/images/ads/gaming-laptops.svg",
        link: "/products?category=gaming",
        targetCategory: "gaming",
        active: true,
      },
    }),

    // Smartphone Ads
    prisma.advertisement.upsert({
      where: { id: "ad-smartphone-deal" },
      update: {},
      create: {
        id: "ad-smartphone-deal",
        title: "New Smartphones Available",
        description: "Check out our latest smartphone collection",
        image: "/images/ads/smartphone-deal.svg",
        link: "/products?category=smartphones",
        targetCategory: "smartphones",
        active: true,
      },
    }),
    prisma.advertisement.upsert({
      where: { id: "ad-iphone-15" },
      update: {},
      create: {
        id: "ad-iphone-15",
        title: "iPhone 15 Pro - Pre-order Now!",
        description: "Be among the first to get the revolutionary iPhone 15 Pro",
        image: "/images/ads/iphone-15-pro.svg",
        link: "/products/iphone-15-pro",
        targetCategory: "smartphones",
        active: true,
      },
    }),

    // Tablet Ads
    prisma.advertisement.upsert({
      where: { id: "ad-tablets" },
      update: {},
      create: {
        id: "ad-tablets",
        title: "Tablets for Work & Play",
        description: "Powerful tablets for productivity and entertainment",
        image: "/images/ads/tablets.svg",
        link: "/products?category=tablets",
        targetCategory: "tablets",
        active: true,
      },
    }),

    // Headphone Ads
    prisma.advertisement.upsert({
      where: { id: "ad-headphones" },
      update: {},
      create: {
        id: "ad-headphones",
        title: "Premium Headphones",
        description: "Experience crystal clear audio with our headphone collection",
        image: "/images/ads/headphones.svg",
        link: "/products?category=headphones",
        targetCategory: "headphones",
        active: true,
      },
    }),

    // Gaming Ads
    prisma.advertisement.upsert({
      where: { id: "ad-gaming-consoles" },
      update: {},
      create: {
        id: "ad-gaming-consoles",
        title: "Next-Gen Gaming Consoles",
        description: "PlayStation 5, Xbox Series X, and Nintendo Switch",
        image: "/images/ads/gaming-consoles.svg",
        link: "/products?category=gaming",
        targetCategory: "gaming",
        active: true,
      },
    }),

    // Accessories Ads
    prisma.advertisement.upsert({
      where: { id: "ad-accessories" },
      update: {},
      create: {
        id: "ad-accessories",
        title: "Essential Tech Accessories",
        description: "Complete your setup with our accessories",
        image: "/images/ads/accessories.svg",
        link: "/products?category=accessories",
        targetCategory: "accessories",
        active: true,
      },
    }),
    prisma.advertisement.upsert({
      where: { id: "ad-apple-watch" },
      update: {},
      create: {
        id: "ad-apple-watch",
        title: "Apple Watch Series 9",
        description: "Track your health and stay connected",
        image: "/images/ads/apple-watch.svg",
        link: "/products/apple-watch-series-9",
        targetCategory: "accessories",
        active: true,
      },
    }),

    // Seasonal/General Ads
    prisma.advertisement.upsert({
      where: { id: "ad-black-friday" },
      update: {},
      create: {
        id: "ad-black-friday",
        title: "Black Friday Sale - 50% Off!",
        description: "Biggest sale of the year - limited time offer",
        image: "/images/ads/black-friday.svg",
        link: "/products",
        targetCategory: "all",
        active: true,
      },
    }),
    prisma.advertisement.upsert({
      where: { id: "ad-free-shipping" },
      update: {},
      create: {
        id: "ad-free-shipping",
        title: "Free Shipping on Orders Over $50",
        description: "No minimum order required for free shipping",
        image: "/images/ads/free-shipping.svg",
        link: "/products",
        targetCategory: "all",
        active: true,
      },
    }),
    prisma.advertisement.upsert({
      where: { id: "ad-tech-bundle" },
      update: {},
      create: {
        id: "ad-tech-bundle",
        title: "Complete Tech Bundle",
        description: "Laptop + Headphones + Mouse - Save $200",
        image: "/images/ads/tech-bundle.svg",
        link: "/products",
        targetCategory: "all",
        active: true,
      },
    }),
  ])

  console.log("Database seeded successfully!")
  console.log(`Created ${categories.length} categories`)
  console.log(`Created ${products.length} products`)
  console.log("Created 12 advertisements")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
