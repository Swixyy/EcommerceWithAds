import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // For now, we'll use a simple approach with user preferences
    // In a real app, you'd have a separate Wishlist model
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })

    const preferences = user?.preferences as any || {}
    const wishlistProductIds = preferences.wishlist || []

    if (wishlistProductIds.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: wishlistProductIds }
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({ products })

  } catch (error) {
    console.error("Error fetching wishlist:", error)
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

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get current user preferences
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })

    const preferences = user?.preferences as any || {}
    const currentWishlist = preferences.wishlist || []

    // Add product to wishlist if not already present
    if (!currentWishlist.includes(productId)) {
      const updatedWishlist = [...currentWishlist, productId]
      
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          preferences: {
            ...preferences,
            wishlist: updatedWishlist
          }
        }
      })
    }

    return NextResponse.json({ message: "Added to wishlist" })

  } catch (error) {
    console.error("Error adding to wishlist:", error)
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

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get current user preferences
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })

    const preferences = user?.preferences as any || {}
    const currentWishlist = preferences.wishlist || []

    // Remove product from wishlist
    const updatedWishlist = currentWishlist.filter((id: string) => id !== productId)
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences: {
          ...preferences,
          wishlist: updatedWishlist
        }
      }
    })

    return NextResponse.json({ message: "Removed from wishlist" })

  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
