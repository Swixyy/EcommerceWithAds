"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart } from "lucide-react"
import { ProductWithCategory } from "@/types"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { useCart } from "@/contexts/CartContext"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const { addToViewedCategories } = useUserPreferences()
  const { addToCart } = useCart()
  
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "desc"
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.search) queryParams.set("search", filters.search)
      if (filters.category) queryParams.set("category", filters.category)
      if (filters.minPrice) queryParams.set("minPrice", filters.minPrice)
      if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice)
      if (filters.sortBy) queryParams.set("sortBy", filters.sortBy)
      if (filters.sortOrder) queryParams.set("sortOrder", filters.sortOrder)

      const response = await fetch(`/api/products?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        
        // Track viewed categories for personalization
        if (filters.category) {
          addToViewedCategories(filters.category)
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const addToWishlist = async (productId: string) => {
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      })
      
      if (response.ok) {
        // Show success feedback
        console.log("Added to wishlist")
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
    }
  }

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Discover our latest technology products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search products..."
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">Newest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="price">Price Low to High</option>
                  <option value="price">Price High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => setFilters({
                  search: "",
                  category: "",
                  minPrice: "",
                  maxPrice: "",
                  sortBy: "createdAt",
                  sortOrder: "desc"
                })}
                className="w-full text-sm text-blue-600 hover:text-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {products.length} products found
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list" 
                      ? "bg-blue-100 text-blue-600" 
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" 
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={`${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-w-1 aspect-h-1"}`}>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={viewMode === "list" ? 200 : 300}
                          height={viewMode === "list" ? 200 : 300}
                          className={`${viewMode === "list" ? "h-48 w-full" : "h-full w-full"} object-cover`}
                        />
                      ) : (
                        <div className={`${viewMode === "list" ? "h-48 w-full" : "h-full w-full"} bg-gray-200 flex items-center justify-center`}>
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{product.category.name}</span>
                        {product.featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
                          {product.name}
                        </Link>
                      </h3>
                      
                      <p className={`text-sm text-gray-600 mb-3 ${viewMode === "list" ? "line-clamp-2" : "line-clamp-3"}`}>
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => addToWishlist(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAddToCart(product.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
