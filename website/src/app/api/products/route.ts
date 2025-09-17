import { NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    const products = await getProducts({
      category,
      search,
      featured,
      limit,
      offset
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
