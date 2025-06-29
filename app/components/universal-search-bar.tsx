"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SearchSuggestions from "./search-suggestions"

interface UniversalSearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showSuggestions?: boolean
  initialQuery?: string
}

export default function UniversalSearchBar({
  onSearch,
  placeholder = "Search products across all stores...",
  className = "",
  size = "md",
  showSuggestions = true,
  initialQuery = "",
}: UniversalSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestionsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      setShowSuggestionsDropdown(false)
      try {
        await onSearch(searchQuery.trim())
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleInputFocus = () => {
    if (showSuggestions) {
      setShowSuggestionsDropdown(true)
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setShowSuggestionsDropdown(false)
    // Auto-search when suggestion is selected
    onSearch(suggestion)
  }

  const sizeClasses = {
    sm: "text-sm py-2 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-5",
  }

  const buttonSizeClasses = {
    sm: "px-3 py-2",
    md: "px-4 py-2",
    lg: "px-5 py-3",
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            className={`electric-input rounded-full border-0 text-gray-800 placeholder-gray-500 font-medium ${sizeClasses[size]}`}
            disabled={isLoading}
          />

          {/* Search Suggestions */}
          {showSuggestions && (
            <SearchSuggestions
              searchQuery={searchQuery}
              onSuggestionSelect={handleSuggestionSelect}
              onSearch={onSearch}
              isVisible={showSuggestionsDropdown}
              className="mt-1 relative z-[400]"
            />
          )}
        </div>

        <Button
          onClick={handleSearch}
          size={size === "sm" ? "sm" : "default"}
          className={`electric-button text-white rounded-full border-0 font-semibold ${buttonSizeClasses[size]}`}
          disabled={isLoading || !searchQuery.trim()}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      <style jsx>{`
        .electric-input {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .electric-button {
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 0 20px rgba(147, 51, 234, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .electric-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 
            0 0 25px rgba(147, 51, 234, 0.5),
            0 6px 20px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  )
}
