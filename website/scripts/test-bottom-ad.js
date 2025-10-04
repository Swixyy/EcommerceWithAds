#!/usr/bin/env node

/**
 * Test Script: Bottom Advertisement
 * Tests the bottom ad functionality and image loading
 */

console.log("🧪 Testing Bottom Advertisement System...\n")

const baseUrl = "http://localhost:3000"

async function testBottomAd() {
  try {
    console.log("1. Testing bottom ad API endpoint...")
    const response = await fetch(`${baseUrl}/api/ads/personalized?position=bottom`)
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log("✅ Bottom ad API response:")
    console.log(`   ID: ${data.advertisement.id}`)
    console.log(`   Title: ${data.advertisement.title}`)
    console.log(`   Image: ${data.advertisement.imageUrl}`)
    console.log(`   Link: ${data.advertisement.link}`)
    
    // Test image loading
    console.log("\n2. Testing bottom ad image loading...")
    const imageResponse = await fetch(`${baseUrl}${data.advertisement.imageUrl}`)
    
    if (imageResponse.ok) {
      console.log("✅ Bottom ad image loads successfully")
    } else {
      console.log(`❌ Bottom ad image failed to load: ${imageResponse.status}`)
    }
    
    // Test different user scenarios
    console.log("\n3. Testing different ad positions...")
    const positions = ['top', 'bottom', 'sidebar']
    
    for (const position of positions) {
      const posResponse = await fetch(`${baseUrl}/api/ads/personalized?position=${position}`)
      if (posResponse.ok) {
        const posData = await posResponse.json()
        console.log(`✅ ${position.toUpperCase()} ad: ${posData.advertisement.title}`)
      } else {
        console.log(`❌ ${position.toUpperCase()} ad failed: ${posResponse.status}`)
      }
    }
    
    console.log("\n4. Testing homepage for bottom ad display...")
    const homeResponse = await fetch(`${baseUrl}/`)
    if (homeResponse.ok) {
      const homeHtml = await homeResponse.text()
      if (homeResponse.text.includes('AdvertisementBanner')) {
        console.log("✅ Homepage contains AdvertisementBanner component")
      } else {
        console.log("❌ Homepage missing AdvertisementBanner component")
      }
      
      if (homeResponse.text.includes('position="bottom"')) {
        console.log("✅ Homepage contains bottom position ad")
      } else {
        console.log("❌ Homepage missing bottom position ad")
      }
    } else {
      console.log(`❌ Homepage failed to load: ${homeResponse.status}`)
    }
    
    console.log("\n🎯 Bottom ad system test completed!")
    
  } catch (error) {
    console.error("❌ Test failed:", error.message)
  }
}

// Run the test
testBottomAd()
