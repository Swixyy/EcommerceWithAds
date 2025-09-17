"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Package } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  slug: string
  productCount?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryImage = (slug: string) => {
    // In a real app, these would be actual category images
    const categoryImages: { [key: string]: string } = {
      laptops: "/images/categories/laptops.jpg",
      smartphones: "/images/categories/smartphones.jpg",
      accessories: "/images/categories/accessories.jpg"
    }
    return categoryImages[slug] || "/images/placeholder.jpg"
  }

  const getCategoryIcon = (slug: string) => {
    // You could use different icons for different categories
    return Package
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of technology products organized by category. 
            Find exactly what you're looking for with our carefully curated collections.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category.slug)
            
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <Image
                    src={getCategoryImage(category.slug)}
                    alt={category.name}
                    width={400}
                    height={225}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount || 0} products
                    </span>
                    <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Shop Now →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Featured Categories Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Featured Categories
          </h2>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                New Arrivals
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Discover the latest technology products and stay ahead of the curve 
                with our newest arrivals in laptops, smartphones, and accessories.
              </p>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                View New Arrivals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 mb-6">
            Browse all our products or use our search feature to find exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse All Products
            </Link>
            <Link
              href="/products?search="
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Search Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
