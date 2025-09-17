"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Input from "./Input"

interface SearchInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
  showClearButton?: boolean
  debounceMs?: number
}

export default function SearchInput({
  placeholder = "Search...",
  onSearch,
  onClear,
  className,
  showClearButton = true,
  debounceMs = 300
}: SearchInputProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(query)
      }
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery("")
    if (onClear) {
      onClear()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "pl-10 pr-10",
          isFocused && "ring-2 ring-blue-500 border-blue-500"
        )}
      />
      
      {showClearButton && query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
