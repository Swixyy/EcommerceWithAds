"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { ProductWithCategory } from "@/types"
import SearchInput from "@/components/ui/SearchInput"

export default function ProductSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductWithCategory[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.products || [])
        setIsOpen(true)
      }
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }, [query])

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(() => {
        searchProducts()
      }, 300) // Debounce for 300ms
      
      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, searchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery("")
    }
  }

  const handleProductClick = (slug: string) => {
    router.push(`/products/${slug}`)
    setIsOpen(false)
    setQuery("")
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative flex-1 max-w-lg mx-8" ref={searchRef}>
      <SearchInput
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={clearSearch}
        className="w-full"
      />

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  <div className="flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {product.category.name}
                    </p>
                    <p className="text-sm font-semibold text-blue-600">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-200 px-4 py-2">
                <button
                  onClick={() => router.push(`/products?search=${encodeURIComponent(query)}`)}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600">No products found</p>
              <button
                onClick={() => router.push(`/products?search=${encodeURIComponent(query)}`)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Search all products
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
