"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, ArrowLeft, Trash2 } from "lucide-react"
import { ProductWithCategory } from "@/types"

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlist, setWishlist] = useState<ProductWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchWishlist()
    }
  }, [status, router])

  const fetchWishlist = async () => {
    try {
      const response = await fetch("/api/user/wishlist")
      if (response.ok) {
        const data = await response.json()
        setWishlist(data.products || [])
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.id !== productId))
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        // Optionally show a success message
        console.log("Added to cart successfully")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-gray-600">
            Save items you love and add them to your cart when you're ready to buy.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding items to your wishlist by browsing our products.
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.category.name}</span>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
