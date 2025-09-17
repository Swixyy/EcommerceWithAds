import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getPersonalizedAdvertisement } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const position = searchParams.get("position") || "top"

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
