import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAllAdvertisements, createAdvertisement } from "@/lib/database"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // In a real app, you'd check if the user has admin privileges
    const advertisements = await getAllAdvertisements()

    return NextResponse.json({ advertisements })

  } catch (error) {
    console.error("Error fetching advertisements:", error)
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

    const { title, imageUrl, link, targetAudience } = await request.json()

    if (!title || !link) {
      return NextResponse.json(
        { error: "Title and link are required" },
        { status: 400 }
      )
    }

    const advertisement = await createAdvertisement({
      title,
      imageUrl,
      link,
      targetAudience: targetAudience ? JSON.stringify(targetAudience) : null
    })

    return NextResponse.json({ advertisement })

  } catch (error) {
    console.error("Error creating advertisement:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
