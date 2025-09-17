import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { 
  getTotalUsers, 
  getTotalProducts, 
  getTotalOrders, 
  getTotalRevenue,
  getRecentOrders,
  getTopProducts
} from "@/lib/database"

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
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      getTotalUsers(),
      getTotalProducts(),
      getTotalOrders(),
      getTotalRevenue(),
      getRecentOrders(5),
      getTopProducts(5)
    ])

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts
    })

  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
