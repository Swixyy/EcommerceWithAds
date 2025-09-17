"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { ProductWithCategory } from "@/types"
import { useCart } from "@/contexts/CartContext"
import { Card, CardContent } from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"

interface ProductCardProps {
  product: ProductWithCategory
  showAddToCart?: boolean
  showWishlist?: boolean
  className?: string
}

export default function ProductCard({ 
  product, 
  showAddToCart = true, 
  showWishlist = true,
  className 
}: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await addToCart(product.id, 1)
  }

  const addToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const response = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id })
      })
      
      if (response.ok) {
        console.log("Added to wishlist")
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error)
    }
  }

  return (
    <Card className={`group overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category.name}
          </Badge>
          {product.featured && (
            <Badge variant="warning" className="text-xs">
              Featured
            </Badge>
          )}
        </div>
        
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < 4 ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">(4.0)</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">
              {product.stock} in stock
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showWishlist && (
              <Button
                variant="ghost"
                size="icon"
                onClick={addToWishlist}
                className="text-gray-400 hover:text-red-500"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
            {showAddToCart && (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="text-xs"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
