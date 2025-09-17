import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { trackAdInteraction } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { adId, action } = await request.json()

    if (!adId || !action) {
      return NextResponse.json(
        { error: "Ad ID and action are required" },
        { status: 400 }
      )
    }

    // Track the ad interaction
    await trackAdInteraction(adId, action, session?.user?.id)

    return NextResponse.json({ message: "Ad interaction tracked" })

  } catch (error) {
    console.error("Error tracking ad interaction:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
