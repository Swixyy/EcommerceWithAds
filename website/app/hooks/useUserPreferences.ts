"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserPreferences {
  viewedCategories?: string[]
  favoriteCategories?: string[]
  adPreferences?: string[]
}

export function useUserPreferences() {
  const { data: session } = useSession()
  const [preferences, setPreferences] = useState<UserPreferences>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserPreferences()
    }
  }, [session?.user?.id])

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences || {})
      }
    } catch (error) {
      console.error("Failed to fetch user preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data.preferences)
        return true
      }
    } catch (error) {
      console.error("Failed to update preferences:", error)
    }
    return false
  }

  const addToViewedCategories = async (category: string) => {
    const currentViewed = preferences.viewedCategories || []
    if (!currentViewed.includes(category)) {
      const updatedViewed = [...currentViewed, category].slice(-10) // Keep last 10
      await updatePreferences({ viewedCategories: updatedViewed })
    }
  }

  const toggleFavoriteCategory = async (category: string) => {
    const currentFavorites = preferences.favoriteCategories || []
    const updatedFavorites = currentFavorites.includes(category)
      ? currentFavorites.filter(c => c !== category)
      : [...currentFavorites, category]
    
    await updatePreferences({ favoriteCategories: updatedFavorites })
  }

  const updateAdPreferences = async (prefs: string[]) => {
    await updatePreferences({ adPreferences: prefs })
  }

  return {
    preferences,
    loading,
    updatePreferences,
    addToViewedCategories,
    toggleFavoriteCategory,
    updateAdPreferences,
  }
}
