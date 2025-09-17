"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  DollarSign,
  BarChart3,
  Settings
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchDashboardStats()
    }
  }, [status, router])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-purple-500",
      change: "+23%",
      changeType: "positive"
    },
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      change: "+15%",
      changeType: "positive"
    }
  ]

  const quickActions = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove products",
      href: "/admin/products",
      icon: Package,
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      href: "/admin/users",
      icon: Users,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "View Orders",
      description: "Process and track orders",
      href: "/admin/orders",
      icon: ShoppingCart,
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Manage Ads",
      description: "Create and manage advertisements",
      href: "/admin/ads",
      icon: Eye,
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "Analytics",
      description: "View detailed analytics and reports",
      href: "/admin/analytics",
      icon: BarChart3,
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Settings",
      description: "Configure system settings",
      href: "/admin/settings",
      icon: Settings,
      color: "bg-gray-600 hover:bg-gray-700"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name || "Admin"}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
              >
                View Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            </div>
            <div className="p-6">
              {stats?.recentOrders?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-gray-500">{order.user?.name || "Guest"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{order.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            </div>
            <div className="p-6">
              {stats?.topProducts?.length > 0 ? (
                <div className="space-y-4">
                  {stats.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{product.stock} in stock</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No products available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
