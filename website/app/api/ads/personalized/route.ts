import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPersonalizedAdvertisement } from "@/lib/database"
import { prisma } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position") || "top"

    // Get real user preferences from database
    let userPreferences = null
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { preferences: true }
      })
      
      if (user?.preferences) {
        userPreferences = user.preferences as {
          viewedCategories?: string[]
          favoriteCategories?: string[]
          adPreferences?: string[]
        }
      }
    }

    const advertisement = await getPersonalizedAdvertisement(userPreferences, position)

    return NextResponse.json({ advertisement })

  } catch (error) {
    console.error("Error fetching personalized ad:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
