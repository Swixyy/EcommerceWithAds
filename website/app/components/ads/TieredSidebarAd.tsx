"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Tag, Clock, Star } from "lucide-react"
import { useUserPreferences } from "@/hooks/useUserPreferences"

interface TieredProduct {
  id: string
  name: string
  slug: string
  image: string
  originalPrice: number
  discountedPrice: number
  discount: number
  savings: number
  category: string
  range: string
  priceRange?: string
  categorySlug?: string
}

interface TieredSidebarAdProps {
  className?: string
}

export default function TieredSidebarAd({ className = "" }: TieredSidebarAdProps) {
  const [products, setProducts] = useState<TieredProduct[]>([])
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const { preferences } = useUserPreferences()

  useEffect(() => {
    fetchTieredProducts()
  }, [preferences])

  const fetchTieredProducts = async () => {
    try {
      const response = await fetch("/api/ads/sidebar-tiered")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        setCategory(data.category)
      }
    } catch (error) {
      console.error("Failed to fetch tiered products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-md p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex space-x-3">
                <div className="h-16 w-16 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (dismissed || products.length === 0) {
    return null
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">{category?.name} Specials</h3>
            <p className="text-blue-100 text-sm">Limited Time Offer</p>
          </div>
          <div className="flex items-center space-x-1">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-semibold">8% OFF</span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="p-4">
        <div className="space-y-4">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors"
            >
              <div className="flex space-x-3">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    {product.category}
                    {product.categorySlug && product.categorySlug !== category?.slug && (
                      <span className="ml-1 text-blue-600 font-medium">• Cross-category</span>
                    )}
                  </p>
                  
                  {/* Pricing */}
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-green-600">
                      ${product.discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                      Save ${product.savings.toFixed(2)}
                    </span>
                  </div>

                  {/* Price Range Badge */}
                  {product.range !== "special" && (
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-1"></span>
                        {product.range} Tier
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Limited Time</span>
            </div>
            <Link
              href={`/products?category=${category?.slug}&sale=true`}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All Deals
              <ShoppingCart className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Dismiss Button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setDismissed(true)}
          className="w-full text-xs text-gray-400 hover:text-gray-600 text-center py-2"
        >
          Dismiss this ad
        </button>
      </div>
    </div>
  )
}
