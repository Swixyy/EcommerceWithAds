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
  return await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: true
        }
      }
    }
  })
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

export async function getPersonalizedAdvertisement(userPreferences: Record<string, unknown>, position: string) {
  // In a real app, this would use sophisticated targeting logic
  // For now, we'll return a mock advertisement based on position
  const mockAds = {
    top: {
      id: "ad-top-1",
      title: "🔥 Flash Sale: Up to 50% Off Laptops!",
      imageUrl: "/images/ads/laptop-sale.svg",
      link: "/products?category=laptops&sale=true"
    },
    bottom: {
      id: "ad-bottom-1", 
      title: "📱 New iPhone 15 Pro - Pre-order Now!",
      imageUrl: "/images/ads/iphone-15.jpg",
      link: "/products?category=smartphones&featured=true"
    },
    sidebar: {
      id: "ad-sidebar-1",
      title: "🎧 Premium Headphones",
      imageUrl: "/images/ads/headphones.jpg", 
      link: "/products?category=accessories&featured=true"
    }
  }

  return mockAds[position as keyof typeof mockAds] || mockAds.top
}

export async function getPersonalizedRecommendations(userPreferences: Record<string, unknown>, limit: number) {
  // In a real app, this would use ML algorithms and user behavior data
  // For now, we'll return featured products as recommendations
  return await prisma.product.findMany({
    where: {
      featured: true
    },
    include: {
      category: true
    },
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  })
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
