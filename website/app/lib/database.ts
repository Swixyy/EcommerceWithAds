import { PrismaClient } from "@prisma/client"
import { ProductWithCategory, CartItemWithProduct, UserWithPreferences } from "@/types"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Product operations
export async function getProducts(filters?: {
  category?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}): Promise<ProductWithCategory[]> {
  const where: {
    category?: { slug: string }
    OR?: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }>
    featured?: boolean
  } = {}
  
  if (filters?.category) {
    where.category = { slug: filters.category }
  }
  
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } }
    ]
  }
  
  if (filters?.featured !== undefined) {
    where.featured = filters.featured
  }

  return await prisma.product.findMany({
    where,
    include: {
      category: true
    },
    take: filters?.limit || 20,
    skip: filters?.offset || 0,
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  return await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true
    }
  })
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}

// Cart operations
export async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  })

  // Check for active discounts for each cart item
  const cartItemsWithDiscounts = await Promise.all(
    cartItems.map(async (item) => {
      // Check if there's an active discount for this product
      const discount = await prisma.temporaryDiscount.findUnique({
        where: {
          userId_productId: {
            userId: userId,
            productId: item.productId
          }
        }
      })

      // If discount exists and is still valid, apply it
      if (discount && discount.expiresAt > new Date()) {
        return {
          ...item,
          product: {
            ...item.product,
            originalPrice: item.product.price,
            price: discount.discountPrice, // Use discounted price
            discountApplied: {
              originalPrice: discount.originalPrice,
              discountPrice: discount.discountPrice,
              discountPercent: discount.discountPercent,
              expiresAt: discount.expiresAt,
              source: discount.source
            }
          }
        }
      }

      return item
    })
  )

  return cartItemsWithDiscounts
}

export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  return await prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    update: {
      quantity: {
        increment: quantity
      }
    },
    create: {
      userId,
      productId,
      quantity
    }
  })
}

export async function removeFromCart(userId: string, productId: string) {
  return await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId,
        productId
      }
    }
  })
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number) {
  if (quantity <= 0) {
    return await removeFromCart(userId, productId)
  }
  
  return await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId
      }
    },
    data: { quantity }
  })
}

// User operations
export async function getUserById(id: string): Promise<UserWithPreferences | null> {
  return await prisma.user.findUnique({
    where: { id }
  })
}

export async function updateUserPreferences(userId: string, preferences: Record<string, unknown>) {
  return await prisma.user.update({
    where: { id: userId },
    data: { preferences }
  })
}

// Advertisement operations
export async function getAdvertisements(targetCategory?: string) {
  return await prisma.advertisement.findMany({
    where: {
      active: true,
      ...(targetCategory && { targetCategory })
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Order operations
export async function createOrder(userId: string, items: Array<{ productId: string; quantity: number; price: number }>) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  })
}

export async function getUserOrders(userId: string) {
  return await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function clearCart(userId: string) {
  return await prisma.cartItem.deleteMany({
    where: { userId }
  })
}

export async function getPersonalizedAdvertisement(userPreferences: Record<string, unknown> | null, position: string) {
  // Real personalization logic based on user preferences
  const preferences = userPreferences as {
    viewedCategories?: string[]
    favoriteCategories?: string[]
    adPreferences?: string[]
  } | null

  // Define ad campaigns for different categories and positions
  const adCampaigns = {
    laptops: {
      top: {
        id: "ad-laptops-top",
        title: "🔥 Flash Sale: Up to 50% Off Gaming Laptops!",
        imageUrl: "/images/ads/laptop-sale.svg",
        link: "/products?category=laptops&sale=true"
      },
      bottom: {
        id: "ad-laptops-bottom",
        title: "💻 New MacBook Pro 16\" - Pre-order Today!",
        imageUrl: "/images/ads/macbook-pro.svg",
        link: "/products?category=laptops&featured=true"
      },
      sidebar: {
        id: "ad-laptops-sidebar",
        title: "🎮 Gaming Laptops Starting at $999",
        imageUrl: "/images/ads/gaming-laptop.svg",
        link: "/products?category=laptops"
      }
    },
    smartphones: {
      top: {
        id: "ad-smartphones-top",
        title: "📱 New iPhone 15 Pro - Pre-order Now!",
        imageUrl: "/images/ads/iphone-15.svg",
        link: "/products?category=smartphones&featured=true"
      },
      bottom: {
        id: "ad-smartphones-bottom",
        title: "🌟 Samsung Galaxy S24 Ultra - Latest Features!",
        imageUrl: "/images/ads/samsung-galaxy.svg",
        link: "/products?category=smartphones&sale=true"
      },
      sidebar: {
        id: "ad-smartphones-sidebar",
        title: "📲 Premium Smartphones Collection",
        imageUrl: "/images/ads/smartphones.svg",
        link: "/products?category=smartphones"
      }
    },
    accessories: {
      top: {
        id: "ad-accessories-top",
        title: "🎧 Premium Headphones - 30% Off!",
        imageUrl: "/images/ads/headphones.svg",
        link: "/products?category=accessories&sale=true"
      },
      bottom: {
        id: "ad-accessories-bottom",
        title: "⌚ Smart Watches & Fitness Trackers",
        imageUrl: "/images/ads/smart-watch.svg",
        link: "/products?category=accessories&featured=true"
      },
      sidebar: {
        id: "ad-accessories-sidebar",
        title: "🔌 USB-C Hubs & Chargers",
        imageUrl: "/images/ads/accessories.svg",
        link: "/products?category=accessories"
      }
    },
    gaming: {
      top: {
        id: "ad-gaming-top",
        title: "🎮 Gaming Console Sale - PS5 & Xbox!",
        imageUrl: "/images/ads/gaming-consoles.svg",
        link: "/products?category=gaming&sale=true"
      },
      bottom: {
        id: "ad-gaming-bottom",
        title: "🕹️ Gaming Accessories & Controllers",
        imageUrl: "/images/ads/gaming-accessories.svg",
        link: "/products?category=gaming&featured=true"
      },
      sidebar: {
        id: "ad-gaming-sidebar",
        title: "🎯 Gaming Laptops RTX 4080",
        imageUrl: "/images/ads/gaming-laptops.svg",
        link: "/products?category=gaming"
      }
    },
    tablets: {
      top: {
        id: "ad-tablets-top",
        title: "📱 iPad Pro 12.9\" - Latest Model!",
        imageUrl: "/images/ads/ipad-pro.svg",
        link: "/products?category=tablets&featured=true"
      },
      bottom: {
        id: "ad-tablets-bottom",
        title: "📊 Samsung Tab S9 Ultra - Productivity Power!",
        imageUrl: "/images/ads/samsung-tab.svg",
        link: "/products?category=tablets&sale=true"
      },
      sidebar: {
        id: "ad-tablets-sidebar",
        title: "📱 Premium Tablets Collection",
        imageUrl: "/images/ads/tablets.svg",
        link: "/products?category=tablets"
      }
    },
    headphones: {
      top: {
        id: "ad-headphones-top",
        title: "🎧 Sony WH-1000XM5 - Noise Canceling!",
        imageUrl: "/images/ads/sony-headphones.svg",
        link: "/products?category=headphones&featured=true"
      },
      bottom: {
        id: "ad-headphones-bottom",
        title: "🔊 Bose QuietComfort 45 - Premium Audio",
        imageUrl: "/images/ads/bose-headphones.svg",
        link: "/products?category=headphones&sale=true"
      },
      sidebar: {
        id: "ad-headphones-sidebar",
        title: "🎵 Premium Audio Headphones",
        imageUrl: "/images/ads/headphones.svg",
        link: "/products?category=headphones"
      }
    }
  }

  // Default ads for users without preferences
  const defaultAds = {
    top: {
      id: "ad-default-top",
      title: "🔥 Tech Sale - Up to 50% Off Everything!",
      imageUrl: "/images/ads/tech-sale.svg",
      link: "/products?sale=true"
    },
    bottom: {
      id: "ad-default-bottom",
      title: "💡 Discover Latest Technology Products",
      imageUrl: "/images/ads/tech-bundle.svg",
      link: "/products?featured=true"
    },
    sidebar: {
      id: "ad-default-sidebar",
      title: "🛍️ Shop by Category",
      imageUrl: "/images/ads/categories.svg",
      link: "/categories"
    }
  }

  // Personalization logic
  if (!preferences || !preferences.favoriteCategories || preferences.favoriteCategories.length === 0) {
    // No preferences - return default ads
    return defaultAds[position as keyof typeof defaultAds] || defaultAds.top
  }

  // Find the most relevant category based on user preferences
  const favoriteCategory = preferences.favoriteCategories[0]
  const viewedCategories = preferences.viewedCategories || []
  
  // Check if user has viewed specific categories recently
  let targetCategory = favoriteCategory
  
  // If user has viewed other categories recently, consider them too
  if (viewedCategories.length > 0) {
    const recentCategory = viewedCategories[viewedCategories.length - 1]
    // 70% chance to show ad for recently viewed category, 30% for favorite
    targetCategory = Math.random() < 0.7 ? recentCategory : favoriteCategory
  }

  // Get ad for the target category and position
  const categoryAds = adCampaigns[targetCategory as keyof typeof adCampaigns]
  if (categoryAds && categoryAds[position as keyof typeof categoryAds]) {
    return categoryAds[position as keyof typeof categoryAds]
  }

  // Fallback to default if category not found
  return defaultAds[position as keyof typeof defaultAds] || defaultAds.top
}

export async function getPersonalizedRecommendations(userPreferences: Record<string, unknown> | null, limit: number) {
  // Real personalization logic for product recommendations
  const preferences = userPreferences as {
    viewedCategories?: string[]
    favoriteCategories?: string[]
    adPreferences?: string[]
  } | null

  // If no preferences, return featured products
  if (!preferences || !preferences.favoriteCategories || preferences.favoriteCategories.length === 0) {
    return await prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: limit,
      orderBy: { createdAt: "desc" }
    })
  }

  // Get products from favorite categories first
  const favoriteCategoryProducts = await prisma.product.findMany({
    where: {
      category: {
        slug: {
          in: preferences.favoriteCategories
        }
      }
    },
    include: { category: true },
    take: Math.ceil(limit * 0.7), // 70% from favorite categories
    orderBy: { createdAt: "desc" }
  })

  // Get products from recently viewed categories
  const viewedCategories = preferences.viewedCategories || []
  let viewedCategoryProducts: any[] = []
  
  if (viewedCategories.length > 0) {
    viewedCategoryProducts = await prisma.product.findMany({
      where: {
        category: {
          slug: {
            in: viewedCategories
          }
        },
        id: {
          notIn: favoriteCategoryProducts.map(p => p.id) // Exclude already selected products
        }
      },
      include: { category: true },
      take: Math.ceil(limit * 0.3), // 30% from viewed categories
      orderBy: { createdAt: "desc" }
    })
  }

  // Combine and shuffle the results for variety
  let recommendations = [...favoriteCategoryProducts, ...viewedCategoryProducts]
  
  // If we don't have enough products, fill with featured products
  if (recommendations.length < limit) {
    const remainingSlots = limit - recommendations.length
    const existingIds = recommendations.map(p => p.id)
    
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        id: {
          notIn: existingIds
        }
      },
      include: { category: true },
      take: remainingSlots,
      orderBy: { createdAt: "desc" }
    })
    
    recommendations = [...recommendations, ...featuredProducts]
  }

  // Shuffle the array to provide variety while maintaining preference weighting
  for (let i = recommendations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[recommendations[i], recommendations[j]] = [recommendations[j], recommendations[i]]
  }

  return recommendations.slice(0, limit)
}

export async function trackAdInteraction(adId: string, action: string, userId?: string) {
  // In a real app, you'd store this in an analytics table
  console.log(`Ad interaction tracked: ${adId} - ${action} by user ${userId || 'anonymous'}`)
  
  // For now, we'll just log it
  // In production, you'd want to store this in a proper analytics system
  return true
}

export async function getAllAdvertisements() {
  return await prisma.advertisement.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function createAdvertisement(data: {
  title: string
  imageUrl?: string
  link: string
  targetAudience?: string
}) {
  return await prisma.advertisement.create({
    data
  })
}

export async function updateAdvertisement(id: string, data: {
  title?: string
  imageUrl?: string
  link?: string
  targetAudience?: string
}) {
  return await prisma.advertisement.update({
    where: { id },
    data
  })
}

export async function deleteAdvertisement(id: string) {
  return await prisma.advertisement.delete({
    where: { id }
  })
}

// Admin dashboard functions
export async function getTotalUsers() {
  return await prisma.user.count()
}

export async function getTotalProducts() {
  return await prisma.product.count()
}

export async function getTotalOrders() {
  return await prisma.order.count()
}

export async function getTotalRevenue() {
  const result = await prisma.order.aggregate({
    _sum: {
      total: true
    }
  })
  return result._sum.total || 0
}

export async function getRecentOrders(limit: number = 5) {
  return await prisma.order.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })
}

export async function getTopProducts(limit: number = 5) {
  return await prisma.product.findMany({
    take: limit,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      category: {
        select: {
          name: true
        }
      }
    }
  })
}

export async function getAllProducts() {
  return await prisma.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function getAllUsersWithStats() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        select: {
          id: true,
          total: true,
          createdAt: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    orderCount: user.orders.length,
    totalSpent: user.orders.reduce((sum, order) => sum + order.total, 0),
    lastOrderDate: user.orders.length > 0 
      ? user.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
      : null
  }))
}

export async function getAllOrdersWithDetails() {
  return await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}
