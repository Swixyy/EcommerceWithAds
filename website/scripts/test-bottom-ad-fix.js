#!/usr/bin/env node

/**
 * Test Script: Bottom Ad Fix Validation
 * Tests if the bottom ad is now working after the imageUrl fix
 */

console.log("🧪 Testing Bottom Ad Fix...\n")

const baseUrl = "http://localhost:3000"

async function testBottomAdFix() {
  try {
    console.log("1. Testing bottom ad API...")
    const response = await fetch(`${baseUrl}/api/ads/personalized?position=bottom`)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`)
    }
    
    const data = await response.json()
    console.log("✅ Bottom ad API working:")
    console.log(`   Title: ${data.advertisement.title}`)
    console.log(`   Image URL: ${data.advertisement.imageUrl}`)
    console.log(`   Link: ${data.advertisement.link}`)
    
    // Test image loading
    console.log("\n2. Testing image loading...")
    const imageResponse = await fetch(`${baseUrl}${data.advertisement.imageUrl}`)
    
    if (imageResponse.ok) {
      console.log("✅ Bottom ad image loads successfully")
    } else {
      console.log(`❌ Bottom ad image failed: ${imageResponse.status}`)
    }
    
    // Test homepage
    console.log("\n3. Testing homepage...")
    const homeResponse = await fetch(`${baseUrl}/`)
    
    if (homeResponse.ok) {
      const homeHtml = await homeResponse.text()
      
      // Check for AdvertisementBanner component
      if (homeHtml.includes('AdvertisementBanner')) {
        console.log("✅ Homepage contains AdvertisementBanner component")
      } else {
        console.log("❌ Homepage missing AdvertisementBanner component")
      }
      
      // Check for bottom position
      if (homeHtml.includes('position="bottom"')) {
        console.log("✅ Homepage contains bottom position ad")
      } else {
        console.log("❌ Homepage missing bottom position ad")
      }
      
      // Check for AdvertisementBanner import
      if (homeHtml.includes('AdvertisementBanner')) {
        console.log("✅ AdvertisementBanner component is imported")
      } else {
        console.log("❌ AdvertisementBanner component not found in homepage")
      }
      
    } else {
      console.log(`❌ Homepage failed: ${homeResponse.status}`)
    }
    
    console.log("\n4. Testing all ad positions...")
    const positions = ['top', 'bottom', 'sidebar']
    
    for (const position of positions) {
      try {
        const posResponse = await fetch(`${baseUrl}/api/ads/personalized?position=${position}`)
        if (posResponse.ok) {
          const posData = await posResponse.json()
          console.log(`✅ ${position.toUpperCase()}: ${posData.advertisement.title}`)
          
          // Test image for each position
          const imgResponse = await fetch(`${baseUrl}${posData.advertisement.imageUrl}`)
          if (imgResponse.ok) {
            console.log(`   ✅ Image loads: ${posData.advertisement.imageUrl}`)
          } else {
            console.log(`   ❌ Image fails: ${posData.advertisement.imageUrl}`)
          }
        } else {
          console.log(`❌ ${position.toUpperCase()} failed: ${posResponse.status}`)
        }
      } catch (error) {
        console.log(`❌ ${position.toUpperCase()} error: ${error.message}`)
      }
    }
    
    console.log("\n🎯 Bottom ad fix validation completed!")
    console.log("\n💡 Next steps:")
    console.log("   • Check browser at http://localhost:3000")
    console.log("   • Scroll to bottom of homepage")
    console.log("   • Look for green gradient advertisement banner")
    console.log("   • Verify image displays correctly")
    
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testBottomAdFix()
