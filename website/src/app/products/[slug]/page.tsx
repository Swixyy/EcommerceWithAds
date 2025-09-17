"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Heart, ShoppingCart, Star, Share2, Plus, Minus } from "lucide-react"
import { ProductWithCategory } from "@/types"
import { useUserPreferences } from "@/hooks/useUserPreferences"
import { useCart } from "@/contexts/CartContext"
import SidebarAd from "@/components/ads/SidebarAd"

export default function ProductDetailPage() {
  const params = useParams()
  const { addToViewedCategories } = useUserPreferences()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        
        // Track viewed category for personalization
        if (data.product?.category?.slug) {
          addToViewedCategories(data.product.category.slug)
        }
      }
    } catch (error) {
      console.error("Failed to fetch product:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async () => {
    if (!product) return
    
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id })
      })
      
      if (response.ok) {
        setInWishlist(true)
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    await addToCart(product.id, quantity)
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  // Mock images array - in a real app, this would come from the product data
  const productImages = [
    product.image || "/images/placeholder.jpg",
    product.image || "/images/placeholder.jpg",
    product.image || "/images/placeholder.jpg"
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="h-full w-full object-cover object-center"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">{product.category.name}</span>
                {product.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.0)</span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">In Stock ({product.stock} available)</span>
              </div>
              
              <p className="text-lg text-gray-900 mb-6">{product.description}</p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${(product.price * 1.2).toFixed(2)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Save 20%
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-md min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                
                <button
                  onClick={addToWishlist}
                  className={`p-3 border rounded-md ${
                    inWishlist 
                      ? "border-red-300 text-red-600 bg-red-50" 
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
                
                <button
                  onClick={shareProduct}
                  className="p-3 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  High-quality materials and construction
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Free shipping on orders over $50
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  30-day return policy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  1-year warranty included
                </li>
              </ul>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product.id.slice(-8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Stock:</span>
                  <span className="ml-2 text-gray-600">{product.stock} available</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Added:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Advertisement */}
          <div className="lg:col-span-1">
            <SidebarAd className="sticky top-8" />
          </div>
        </div>
      </div>
    </div>
  )
}
