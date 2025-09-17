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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })

    return NextResponse.json({
      preferences: user?.preferences || {}
    })

  } catch (error) {
    console.error("Error fetching user preferences:", error)
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

    const { viewedCategories, favoriteCategories, adPreferences } = await request.json()

    // Get current user preferences
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true }
    })

    const updateData: any = {}
    
    if (viewedCategories !== undefined) {
      updateData.viewedCategories = viewedCategories
    }
    if (favoriteCategories !== undefined) {
      updateData.favoriteCategories = favoriteCategories
    }
    if (adPreferences !== undefined) {
      updateData.adPreferences = adPreferences
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences: {
          ...(currentUser?.preferences as any || {}),
          ...updateData
        }
      },
      select: { preferences: true }
    })

    return NextResponse.json({
      preferences: user.preferences
    })

  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
