import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Always return success to prevent email enumeration
    // In a real app, you'd send an email with a reset link
    if (user) {
      // TODO: Implement email sending service
      // For now, we'll just log the reset request
      console.log(`Password reset requested for: ${email}`)
    }

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset link."
    })

  } catch (error) {
    console.error("Error processing forgot password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
