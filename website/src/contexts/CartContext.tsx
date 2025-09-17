"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSession } from "next-auth/react"
import { CartItemWithProduct } from "@/types"

interface CartContextType {
  cartItems: CartItemWithProduct[]
  cartCount: number
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([])
  const [loading, setLoading] = useState(false)

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const fetchCartItems = async () => {
    if (!session?.user?.id) {
      setCartItems([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems || [])
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [session?.user?.id])

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      })

      if (response.ok) {
        await fetchCartItems() // Refresh cart
      }
    } catch (error) {
      console.error("Failed to update quantity:", error)
    }
  }

  const clearCart = async () => {
    if (!session?.user?.id) return

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE"
      })

      if (response.ok) {
        setCartItems([])
      }
    } catch (error) {
      console.error("Failed to clear cart:", error)
    }
  }

  const refreshCart = async () => {
    await fetchCartItems()
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
