"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { User } from "lucide-react"
import ProductSearch from "@/components/products/ProductSearch"
import MiniCart from "@/components/cart/MiniCart"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TechShop
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-gray-900">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-gray-900">
              Categories
            </Link>
            {session && (
              <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                Orders
              </Link>
            )}
            <Link href="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <ProductSearch />

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <MiniCart />

            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile" className="p-2 text-gray-700 hover:text-gray-900">
                  <User className="h-6 w-6" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => signIn()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </button>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
