import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPersonalizedRecommendations } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "4")

    // Get user preferences for personalization
    let userPreferences = null
    if (session?.user?.id) {
      // In a real app, you'd fetch user preferences from the database
      // For now, we'll use a mock preference based on the user ID
      userPreferences = {
        viewedCategories: ["laptops", "smartphones"],
        favoriteCategories: ["laptops"],
        adPreferences: ["technology", "gadgets"]
      }
    }

    const products = await getPersonalizedRecommendations(userPreferences, limit)

    return NextResponse.json({ products })

  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
