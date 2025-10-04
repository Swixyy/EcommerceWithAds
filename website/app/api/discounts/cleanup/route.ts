import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    // Clean up expired discounts that haven't been added to cart
    const deletedCount = await prisma.temporaryDiscount.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        addedToCart: false
      }
    })

    // Also clean up very old discounts that were added to cart (older than 24 hours)
    const oldDeletedCount = await prisma.temporaryDiscount.deleteMany({
      where: {
        createdAt: {
          lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        },
        addedToCart: true
      }
    })

    return NextResponse.json({
      success: true,
      expiredDiscountsDeleted: deletedCount.count,
      oldCartDiscountsDeleted: oldDeletedCount.count,
      totalDeleted: deletedCount.count + oldDeletedCount.count
    })

  } catch (error) {
    console.error("Error cleaning up expired discounts:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
