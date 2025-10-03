"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, X } from "lucide-react"
import { Advertisement } from "@/types"
import { useUserPreferences } from "@/hooks/useUserPreferences"

interface SidebarAdProps {
  className?: string
}

export default function SidebarAd({ className = "" }: SidebarAdProps) {
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const { preferences } = useUserPreferences()

  useEffect(() => {
    fetchPersonalizedAd()
  }, [preferences])

  const fetchPersonalizedAd = async () => {
    try {
      const response = await fetch("/api/ads/personalized?position=sidebar")
      if (response.ok) {
        const data = await response.json()
        setAdvertisement(data.advertisement)
      }
    } catch (error) {
      console.error("Failed to fetch sidebar ad:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
  }

  const handleAdClick = async (adId: string) => {
    try {
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

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Sponsored
          </span>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {advertisement.image && (
            <div className="aspect-w-16 aspect-h-9">
              <Image
                src={advertisement.image}
                alt={advertisement.title}
                width={300}
                height={200}
                className="w-full h-32 object-cover rounded"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {advertisement.title}
            </h3>
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              Discover amazing deals on technology products tailored just for you!
            </p>
          </div>

          <Link
            href={advertisement.link}
            onClick={() => handleAdClick(advertisement.id)}
            className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Learn More
            <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
