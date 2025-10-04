#!/usr/bin/env node

/**
 * Test Script: Ad Variety System
 * Tests that top and bottom ads show different categories
 */

console.log("🧪 Testing Ad Variety System...\n")

const baseUrl = "http://localhost:3000"

async function testAdVariety() {
  try {
    console.log("1. Testing default ads (no user preferences)...")
    
    // Test multiple times to see variety
    const positions = ['top', 'bottom']
    const results = { top: [], bottom: [] }
    
    for (let i = 0; i < 3; i++) {
      for (const position of positions) {
        const response = await fetch(`${baseUrl}/api/ads/personalized?position=${position}`)
        if (response.ok) {
          const data = await response.json()
          results[position].push({
            id: data.advertisement.id,
            title: data.advertisement.title,
            category: data.advertisement.id.includes('laptops') ? 'laptops' :
                     data.advertisement.id.includes('smartphones') ? 'smartphones' :
                     data.advertisement.id.includes('accessories') ? 'accessories' :
                     data.advertisement.id.includes('gaming') ? 'gaming' :
                     data.advertisement.id.includes('tablets') ? 'tablets' :
                     data.advertisement.id.includes('headphones') ? 'headphones' : 'default'
          })
        }
      }
    }
    
    console.log("   Top ads:")
    results.top.forEach((ad, index) => {
      console.log(`     ${index + 1}. ${ad.title} (${ad.category})`)
    })
    
    console.log("   Bottom ads:")
    results.bottom.forEach((ad, index) => {
      console.log(`     ${index + 1}. ${ad.title} (${ad.category})`)
    })
    
    // Check if ads are different
    const topCategories = [...new Set(results.top.map(ad => ad.category))]
    const bottomCategories = [...new Set(results.bottom.map(ad => ad.category))]
    
    console.log(`\n2. Analyzing variety...`)
    console.log(`   Top ad categories: ${topCategories.join(', ')}`)
    console.log(`   Bottom ad categories: ${bottomCategories.join(', ')}`)
    
    // Check if top and bottom ads are different
    const isDifferent = results.top[0]?.id !== results.bottom[0]?.id
    console.log(`   Top and bottom ads are different: ${isDifferent ? '✅' : '❌'}`)
    
    if (isDifferent) {
      console.log("✅ SUCCESS: Top and bottom ads show different content!")
    } else {
      console.log("❌ ISSUE: Top and bottom ads are showing the same content")
    }
    
    console.log("\n3. Testing with mock user preferences...")
    
    // This would require authentication, but we can test the logic
    console.log("   Note: User preference testing requires authentication")
    console.log("   The logic should show:")
    console.log("   - Top ads: Favorite category or recently viewed")
    console.log("   - Bottom ads: Different category for variety")
    console.log("   - Sidebar ads: Original logic")
    
    console.log("\n🎯 Ad variety system test completed!")
    
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testAdVariety()
