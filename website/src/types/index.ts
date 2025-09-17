import { User, Product, Category, CartItem, Order, Advertisement } from "@prisma/client"

export type UserWithPreferences = User & {
  preferences?: {
    viewedCategories?: string[]
    favoriteCategories?: string[]
    adPreferences?: string[]
  }
}

export type ProductWithCategory = Product & {
  category: Category
}

export type CartItemWithProduct = CartItem & {
  product: Product
}

export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product
  })[]
}

export type AdvertisementWithTargeting = Advertisement & {
  targetCategory?: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface CartItemInput {
  productId: string
  quantity: number
}

export interface UserPreferences {
  viewedCategories?: string[]
  favoriteCategories?: string[]
  adPreferences?: string[]
}

export interface SearchFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'name' | 'price' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}
