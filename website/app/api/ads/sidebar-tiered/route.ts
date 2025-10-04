import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const currentProductCategory = searchParams.get("category") || "smartphones"

    // Get user preferences to determine category
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

    // Smart category selection algorithm
    // For the first 3 products: Use cross-selling logic
    let targetCategory = currentProductCategory
    
    if (userPreferences?.favoriteCategories?.length) {
      const favorites = userPreferences.favoriteCategories
      
      // Smart logic: Show a DIFFERENT favorite category for cross-selling
      if (favorites.includes(currentProductCategory)) {
        // User is viewing a favorite category - show them the OTHER favorite category
        targetCategory = favorites.find(fav => fav !== currentProductCategory) || favorites[0]
      } else {
        // User is viewing a non-favorite category - show them their most relevant favorite
        targetCategory = favorites[0]
      }
    } else if (userPreferences?.viewedCategories?.length) {
      targetCategory = userPreferences.viewedCategories[userPreferences.viewedCategories.length - 1]
    }

    // For the premium upsell (4th product): Always use current category
    const premiumTargetCategory = currentProductCategory


    // Get category info
    const categoryInfo = await prisma.category.findUnique({
      where: { slug: targetCategory },
      select: { id: true, name: true, slug: true }
    })

    if (!categoryInfo) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Define price ranges with 8% discount consideration
    const priceRanges = [
      { min: 0, max: 350, label: "Budget", discountMultiplier: 0.92 },
      { min: 350, max: 700, label: "Mid-Range", discountMultiplier: 0.92 },
      { min: 700, max: Infinity, label: "Premium", discountMultiplier: 0.92 }
    ]

    const tieredProducts = []
    let categoriesToSearch = [targetCategory]

    // If user has multiple favorite categories and we're not showing their current category,
    // consider showing products from different favorite categories
    if (userPreferences?.favoriteCategories?.length > 1 && 
        targetCategory !== currentProductCategory &&
        userPreferences.favoriteCategories.includes(targetCategory)) {
      
      // Add one more category from favorites for variety
      const otherFavorite = userPreferences.favoriteCategories.find(fav => fav !== targetCategory)
      if (otherFavorite) {
        categoriesToSearch.push(otherFavorite)
      }
    }

    // Get category IDs for searching
    const categoryInfos = await prisma.category.findMany({
      where: { slug: { in: categoriesToSearch } },
      select: { id: true, name: true, slug: true }
    })

    const categoryMap = new Map(categoryInfos.map(cat => [cat.slug, cat]))

    for (const range of priceRanges) {
      // Try to find products in each category for this price range
      for (const categorySlug of categoriesToSearch) {
        const categoryInfo = categoryMap.get(categorySlug)
        if (!categoryInfo) continue

        const products = await prisma.product.findMany({
          where: {
            categoryId: categoryInfo.id,
            price: {
              gte: range.min,
              lte: range.max === Infinity ? undefined : range.max / range.discountMultiplier
            }
          },
          include: { category: true },
          take: 1,
          orderBy: [
            { price: "asc" },
            { createdAt: "desc" }
          ]
        })

        if (products.length > 0) {
          const product = products[0]
          const discountedPrice = Math.round(product.price * range.discountMultiplier * 100) / 100
          const originalPrice = product.price

          tieredProducts.push({
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            originalPrice,
            discountedPrice,
            discount: Math.round((1 - range.discountMultiplier) * 100),
            savings: Math.round((originalPrice - discountedPrice) * 100) / 100,
            category: product.category.name,
            range: range.label,
            priceRange: `${range.min}-${range.max === Infinity ? '∞' : range.max}`,
            categorySlug: categoryInfo.slug
          })
          break // Found a product for this range, move to next range
        }
      }
    }

        // If we don't have enough products, try to get some from the category
        if (tieredProducts.length < 2) {
          const fallbackProducts = await prisma.product.findMany({
            where: {
              categoryId: categoryInfo.id,
              id: {
                notIn: tieredProducts.map(p => p.id)
              }
            },
            include: { category: true },
            take: 3 - tieredProducts.length,
            orderBy: { createdAt: "desc" }
          })

          for (const product of fallbackProducts) {
            const discountedPrice = Math.round(product.price * 0.92 * 100) / 100
            const originalPrice = product.price

            tieredProducts.push({
              id: product.id,
              name: product.name,
              slug: product.slug,
              image: product.image,
              originalPrice,
              discountedPrice,
              discount: 8,
              savings: Math.round((originalPrice - discountedPrice) * 100) / 100,
              category: product.category.name,
              range: "special"
            })
          }
        }

        // Add fourth product: Most expensive from CURRENT category with 16% discount
        // Get the current category info for premium upsell
        const currentCategoryInfo = await prisma.category.findUnique({
          where: { slug: premiumTargetCategory },
          select: { id: true, name: true, slug: true }
        })

        if (!currentCategoryInfo) {
          console.log(`Current category ${premiumTargetCategory} not found`)
        } else {
          const mostExpensiveProduct = await prisma.product.findFirst({
            where: {
              categoryId: currentCategoryInfo.id,
              id: {
                notIn: tieredProducts.map(p => p.id)
              }
            },
            include: { category: true },
            orderBy: { price: "desc" }
          })

          if (mostExpensiveProduct) {
            const premiumDiscountedPrice = Math.round(mostExpensiveProduct.price * 0.84 * 100) / 100 // 16% discount
            const originalPrice = mostExpensiveProduct.price

            tieredProducts.push({
              id: mostExpensiveProduct.id,
              name: mostExpensiveProduct.name,
              slug: mostExpensiveProduct.slug,
              image: mostExpensiveProduct.image,
              originalPrice,
              discountedPrice: premiumDiscountedPrice,
              discount: 16,
              savings: Math.round((originalPrice - premiumDiscountedPrice) * 100) / 100,
              category: mostExpensiveProduct.category.name,
              range: "premium"
            })
          }
        }


    return NextResponse.json({
      category: categoryInfo,
      products: tieredProducts,
      discount: 8,
      message: `${categoryInfo.name} - Special Pricing`
    })

  } catch (error) {
    console.error("Error fetching tiered sidebar products:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
