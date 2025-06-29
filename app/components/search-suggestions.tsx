"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, TrendingUp } from "lucide-react"
// import { amazonAPI } from "@/lib/amazon-api"

interface SearchSuggestionsProps {
  /** Raw text from the search field – can be omitted */
  searchQuery?: string
  onSuggestionSelect: (suggestion: string) => void
  onSearch: (query: string) => void
  /** Whether the pop-up is open – can be omitted (defaults to false) */
  isVisible?: boolean
  className?: string
}

export default function SearchSuggestions({
  /** default to empty string so ".trim()" is always safe */
  searchQuery = "",
  onSuggestionSelect,
  onSearch,
  /** default to false so component is hidden unless explicitly shown */
  isVisible = false,
  className = "",
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Popular searches for when there's no query
  const popularSearches = [
    "airpods",
    "iphone 15",
    "laptop",
    "wireless headphones",
    "smartwatch",
    "gaming mouse",
    "coffee maker",
    "fitness tracker",
  ]

  // Recent searches (mock data - in real app this would come from localStorage or user data)
  const recentSearches = ["bluetooth speaker", "running shoes", "tablet"]

  useEffect(() => {
    if (!isVisible) {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (!searchQuery.trim()) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    if (searchQuery.length < 2) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Debounce the mock suggestion generation
    debounceRef.current = setTimeout(async () => {
      try {
        console.log("Generating mock suggestions for:", searchQuery)
        // const mockSuggestions = await amazonAPI.getSearchSuggestions(searchQuery)
        const mockSuggestions = [searchQuery + " 1", searchQuery + " 2", searchQuery + " 3"]
        console.log("Generated mock suggestions:", mockSuggestions)
        setSuggestions(mockSuggestions)
      } catch (error) {
        console.error("Error generating suggestions:", error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery, isVisible])

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionSelect(suggestion)
    onSearch(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isVisible || suggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setSelectedIndex(-1)
        break
    }
  }

  if (!isVisible) return null

  /* work with a single trimmed value to avoid repeating trim operations */
  const trimmedQuery = searchQuery.trim()

  const showPopularSearches = trimmedQuery.length === 0
  const showSuggestions = trimmedQuery.length > 0 && suggestions.length > 0

  return (
    <div
      ref={suggestionsRef}
      className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="p-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Getting suggestions...</span>
          </div>
        </div>
      )}

      {/* Popular Searches */}
      {showPopularSearches && !isLoading && (
        <div className="p-4">
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Recent Searches</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Search className="w-3 h-3 text-gray-400" />
                    <span>{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Popular Searches</span>
            </div>
            <div className="space-y-1">
              {popularSearches.map((search, index) => (
                <button
                  key={`popular-${index}`}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Search className="w-3 h-3 text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* API Suggestions */}
      {showSuggestions && !isLoading && (
        <div className="p-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={`suggestion-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                selectedIndex === index
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Search className="w-3 h-3 text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* No Suggestions */}
      {trimmedQuery.length > 0 && !isLoading && suggestions.length === 0 && (
        <div className="p-4 text-center text-gray-500 text-sm">
          {'No suggestions found for "'}
          {trimmedQuery}
          {'"'}
        </div>
      )}
    </div>
  )
}
