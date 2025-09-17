"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Calendar, CreditCard, Truck } from "lucide-react"
import { OrderWithItems } from "@/types"

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchOrders()
    }
  }, [status, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/user/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "cancelled":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">
            Track your orders and view order history.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              When you place your first order, it will appear here.
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
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {item.product.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              width={60}
                              height={60}
                              className="h-15 w-15 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-15 w-15 bg-gray-200 rounded-md flex items-center justify-center">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {order.status === "delivered" 
                          ? `Delivered on ${new Date(order.updatedAt).toLocaleDateString()}`
                          : `Updated on ${new Date(order.updatedAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        href={`/profile/orders/${order.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View Details
                      </Link>
                      {order.status === "delivered" && (
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
