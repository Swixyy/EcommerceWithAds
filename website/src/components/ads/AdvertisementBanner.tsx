"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ExternalLink } from "lucide-react"
import { Advertisement } from "@/types"
import { useUserPreferences } from "@/hooks/useUserPreferences"

interface AdvertisementBannerProps {
  position?: "top" | "bottom" | "sidebar"
  className?: string
}

export default function AdvertisementBanner({ 
  position = "top", 
  className = "" 
}: AdvertisementBannerProps) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const { userPreferences } = useUserPreferences()

  useEffect(() => {
    fetchPersonalizedAd()
  }, [userPreferences])

  const fetchPersonalizedAd = async () => {
    try {
      const response = await fetch("/api/ads/personalized")
      if (response.ok) {
        const data = await response.json()
        setAdvertisement(data.advertisement)
      }
    } catch (error) {
      console.error("Failed to fetch advertisement:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  const handleAdClick = async (adId: string) => {
    try {
      // Track ad click for analytics
      await fetch("/api/ads/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId, action: "click" })
      })
    } catch (error) {
      console.error("Failed to track ad click:", error)
    }
  }

  if (loading || dismissed || !advertisement) {
    return null
  }

  const getBannerStyles = () => {
    switch (position) {
      case "top":
        return "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      case "bottom":
        return "bg-gradient-to-r from-green-600 to-teal-600 text-white"
      case "sidebar":
        return "bg-white border border-gray-200 shadow-md"
      default:
        return "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    }
  }

  const getTextColor = () => {
    return position === "sidebar" ? "text-gray-900" : "text-white"
  }

  return (
    <div className={`relative ${getBannerStyles()} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            {advertisement.imageUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={advertisement.imageUrl}
                  alt={advertisement.title}
                  width={position === "sidebar" ? 80 : 60}
                  height={position === "sidebar" ? 80 : 60}
                  className={`${position === "sidebar" ? "h-20 w-20" : "h-15 w-15"} object-cover rounded`}
                />
              </div>
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${getTextColor()}`}>
                {advertisement.title}
              </h3>
              {position !== "sidebar" && (
                <p className={`text-sm ${getTextColor()} opacity-90 mt-1`}>
                  Discover amazing deals on technology products!
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={advertisement.link}
              onClick={() => handleAdClick(advertisement.id)}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
                position === "sidebar" 
                  ? "text-white bg-blue-600 hover:bg-blue-700" 
                  : "text-blue-600 bg-white hover:bg-gray-50"
              } transition-colors`}
            >
              Shop Now
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
            
            <button
              onClick={handleDismiss}
              className={`p-1 ${getTextColor()} opacity-70 hover:opacity-100 transition-opacity`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
