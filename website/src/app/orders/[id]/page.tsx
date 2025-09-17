"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Package, Truck, Home, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import LoadingSkeleton from "@/components/ui/LoadingSkeleton"

interface OrderItem {
  id: string
  product: {
    id: string
    name: string
    image: string | null
    price: number
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  createdAt: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  items: OrderItem[]
  paymentMethod: string
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const orderData = await response.json()
        setOrder(orderData)
      } else {
        console.error("Failed to fetch order")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "secondary"
      case "shipped":
        return "default"
      case "delivered":
        return "success"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-6">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link href="/orders">
                <Button>View All Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
              <p className="mt-2 text-gray-600">
                Thank you for your order! We've received your order and will process it shortly.
              </p>
            </div>
            <Badge variant={getStatusColor(order.status)} className="flex items-center">
              {getStatusIcon(order.status)}
              <span className="ml-1 capitalize">{order.status}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.product.image || "/placeholder-product.jpg"}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p>Phone: {order.shippingAddress.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Order Number</span>
                    <span className="font-mono">#{order.id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Order Date</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment Method</span>
                    <span className="capitalize">{order.paymentMethod.replace("_", " ")}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link href="/products" className="block">
                    <Button className="w-full">Continue Shopping</Button>
                  </Link>
                  <Link href="/orders" className="block">
                    <Button variant="outline" className="w-full">View All Orders</Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-800">
                      Order confirmed! You'll receive an email confirmation shortly.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
