import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateAdvertisement, deleteAdvertisement } from "@/lib/database"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, imageUrl, link, targetAudience } = await request.json()
    const { id } = await params

    const advertisement = await updateAdvertisement(id, {
      title,
      imageUrl,
      link,
      targetAudience: targetAudience ? JSON.stringify(targetAudience) : null
    })

    return NextResponse.json({ advertisement })

  } catch (error) {
    console.error("Error updating advertisement:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    await deleteAdvertisement(id)

    return NextResponse.json({ message: "Advertisement deleted" })

  } catch (error) {
    console.error("Error deleting advertisement:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
