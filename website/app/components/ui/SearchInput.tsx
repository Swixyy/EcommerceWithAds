"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Input from "./Input"

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch?: (query: string) => void
  onClear?: () => void
  className?: string
  showClearButton?: boolean
  debounceMs?: number
}

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  onSearch,
  onClear,
  className,
  showClearButton = true,
  debounceMs = 300
}: SearchInputProps) {
  const [query, setQuery] = useState(value || "")
  const [isFocused, setIsFocused] = useState(false)

  // Removed the debounced onSearch effect to prevent infinite loops
  // The parent component should handle debouncing

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
        value={value !== undefined ? value : query}
        onChange={onChange || ((e) => setQuery(e.target.value))}
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
