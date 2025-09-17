"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { User, Mail, Calendar, Settings, ShoppingBag, Heart } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userPreferences, setUserPreferences] = useState({
    viewedCategories: [],
    favoriteCategories: [],
    adPreferences: []
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {session.user?.image ? (
                  <img
                    className="h-16 w-16 rounded-full"
                    src={session.user.image}
                    alt={session.user.name || "User"}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {session.user?.name || "User"}
                </h1>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Account Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Name: {session.user?.name || "Not provided"}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Email: {session.user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Member since: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/profile/orders"
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">View Orders</span>
                </Link>
                <Link
                  href="/profile/wishlist"
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Heart className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Wishlist</span>
                </Link>
                <Link
                  href="/profile/settings"
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600">Settings</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favorite Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.favoriteCategories.length > 0 ? (
                      userPreferences.favoriteCategories.map((category: string) => (
                        <span
                          key={category}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No preferences set</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Preferences
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {userPreferences.adPreferences.length > 0 ? (
                      userPreferences.adPreferences.map((pref: string) => (
                        <span
                          key={pref}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {pref}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No ad preferences set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your recent orders and activity will appear here.
                </p>
                <div className="mt-6">
                  <Link
                    href="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
