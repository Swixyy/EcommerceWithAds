import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { productId, discountPercent = 8, source = "sidebar_ad" } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, price: true, name: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Calculate discount
    const discountMultiplier = (100 - discountPercent) / 100
    const discountedPrice = Math.round(product.price * discountMultiplier * 100) / 100

    // Check if user already has a temporary discount for this product
    const existingDiscount = await prisma.temporaryDiscount.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id
        }
      }
    })

    // If discount exists and is still valid, return it
    if (existingDiscount && existingDiscount.expiresAt > new Date()) {
      return NextResponse.json({
        discount: {
          id: existingDiscount.id,
          productId: existingDiscount.productId,
          originalPrice: existingDiscount.originalPrice,
          discountPrice: existingDiscount.discountPrice,
          discountPercent: existingDiscount.discountPercent,
          expiresAt: existingDiscount.expiresAt,
          source: existingDiscount.source
        }
      })
    }

    // Create new temporary discount (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    const temporaryDiscount = await prisma.temporaryDiscount.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: product.id
        }
      },
      update: {
        originalPrice: product.price,
        discountPrice: discountedPrice,
        discountPercent,
        expiresAt,
        source,
        addedToCart: false,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        productId: product.id,
        originalPrice: product.price,
        discountPrice: discountedPrice,
        discountPercent,
        expiresAt,
        source
      }
    })

    return NextResponse.json({
      discount: {
        id: temporaryDiscount.id,
        productId: temporaryDiscount.productId,
        originalPrice: temporaryDiscount.originalPrice,
        discountPrice: temporaryDiscount.discountPrice,
        discountPercent: temporaryDiscount.discountPercent,
        expiresAt: temporaryDiscount.expiresAt,
        source: temporaryDiscount.source
      }
    })

  } catch (error) {
    console.error("Error creating temporary discount:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Get active discount for this product
    const discount = await prisma.temporaryDiscount.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    // Check if discount is still valid
    if (!discount || discount.expiresAt <= new Date()) {
      return NextResponse.json({ discount: null })
    }

    return NextResponse.json({
      discount: {
        id: discount.id,
        productId: discount.productId,
        originalPrice: discount.originalPrice,
        discountPrice: discount.discountPrice,
        discountPercent: discount.discountPercent,
        expiresAt: discount.expiresAt,
        source: discount.source
      }
    })

  } catch (error) {
    console.error("Error fetching temporary discount:", error)
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
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { productId, addedToCart } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Update discount status when added to cart
    const updatedDiscount = await prisma.temporaryDiscount.updateMany({
      where: {
        userId: session.user.id,
        productId,
        expiresAt: {
          gt: new Date() // Only update if still valid
        }
      },
      data: {
        addedToCart: addedToCart === true,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      updated: updatedDiscount.count > 0
    })

  } catch (error) {
    console.error("Error updating temporary discount:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
