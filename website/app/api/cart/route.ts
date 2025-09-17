import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { addToCart, getCartItems, updateCartItemQuantity, removeFromCart, clearCart } from "@/lib/database"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const cartItems = await getCartItems(session.user.id)

    return NextResponse.json({ cartItems })

  } catch (error) {
    console.error("Error fetching cart items:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    await addToCart(session.user.id, productId, quantity)

    return NextResponse.json({ message: "Added to cart" })

  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      )
    }

    await updateCartItemQuantity(session.user.id, productId, quantity)

    return NextResponse.json({ message: "Cart updated" })

  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (productId) {
      // Remove specific item
      await removeFromCart(session.user.id, productId)
      return NextResponse.json({ message: "Item removed from cart" })
    } else {
      // Clear entire cart
      await clearCart(session.user.id)
      return NextResponse.json({ message: "Cart cleared" })
    }

  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}