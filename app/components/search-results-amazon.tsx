"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Heart,
  User,
  Info,
  ExternalLink,
  Star,
  SearchX,
  Filter,
  Loader2,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import ProfileDropdown from "./profile-dropdown"
import AuthModal from "./auth-modal"
import { productService, type Product, type SearchFilters } from "@/lib/product-service"

interface SearchResultsAmazonProps {
  query: string
  user: { name: string; email: string } | null
  userFavorites: string[]
  onProductSelect: (product: Product) => void
  onBackToHome: () => void
  onLoginRequired: () => void
  onFavoritesClick: () => void
  onLogout: () => void
  onAboutClick: () => void
  onNewSearch: (query: string) => void
  onProfileClick: () => void
  onLoginSuccess?: (userData: { name: string; email: string }) => void
  onFavoriteToggle: (productId: string) => void
}

export default function SearchResultsAmazon({
  query,
  user,
  userFavorites,
  onProductSelect,
  onBackToHome,
  onLoginRequired,
  onFavoritesClick,
  onLogout,
  onAboutClick,
  onNewSearch,
  onProfileClick,
  onLoginSuccess,
  onFavoriteToggle,
}: SearchResultsAmazonProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalResults, setTotalResults] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Filters
  const [priceRange, setPriceRange] = useState([10, 1000])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState<SearchFilters["sortBy"]>("relevance")

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  // Categories for multi-store platform
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion & Clothing",
    "Home & Kitchen",
    "Sports & Outdoors",
    "Books & Media",
    "Health & Beauty",
    "Toys & Games",
    "Automotive",
    "Tools & Home Improvement",
  ]

  // Update search query when prop changes
  useEffect(() => {
    setSearchQuery(query)
    if (query) {
      performSearch(query, 1, true)
    }
  }, [query])

  // Update current user when prop changes
  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  const performSearch = async (searchTerm: string, page = 1, resetResults = false) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      console.log("Performing search for:", searchTerm, "page:", page)

      const filters: SearchFilters = {
        page,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined,
        sortBy,
      }

      const response = await productService.searchProducts(searchTerm, filters, userFavorites)
      console.log("Search response:", response)

      if (resetResults) {
        setProducts(response.products)
        setCurrentPage(1)
      } else {
        setProducts((prev) => [...prev, ...response.products])
      }

      setTotalResults(response.totalResults)
      setHasMore(response.hasMore)
      setCurrentPage(page)
    } catch (err) {
      console.error("Search error:", err)
      setError("Unable to search products at the moment. Please try again later.")
      if (resetResults) {
        setProducts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNewSearch(searchQuery)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      performSearch(query, currentPage + 1, false)
    }
  }

  const handleFiltersChange = () => {
    if (query) {
      performSearch(query, 1, true)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    if (!original || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const toggleFavorite = (productId: string) => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }
    onFavoriteToggle(productId)
  }

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setCurrentUser(userData)
    setShowAuthModal(false)
    if (onLoginSuccess) {
      onLoginSuccess(userData)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    onLogout()
  }

  const handleFavoritesClick = () => {
    if (currentUser) {
      onFavoritesClick()
    } else {
      setShowAuthModal(true)
    }
  }

  // Get store badge color based on store name
  const getStoreBadgeColor = (store: string) => {
    switch (store.toLowerCase()) {
      case "trendyol":
        return "bg-orange-500/20 text-orange-200 border-orange-400/30"
      case "hepsiburada":
        return "bg-red-500/20 text-red-200 border-red-400/30"
      case "n11":
        return "bg-purple-500/20 text-purple-200 border-purple-400/30"
      case "amazon":
      case "amazon turkey":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
      default:
        return "bg-blue-500/20 text-blue-200 border-blue-400/30"
    }
  }

  const getNoResultsSuggestions = (failedQuery: string): string[] => {
    const popularSuggestions = [
      "headphones",
      "laptop",
      "phone",
      "Apple",
      "Samsung",
      "gaming",
      "wireless",
      "bluetooth",
      "fitness tracker",
      "coffee maker",
      "power bank",
      "mouse",
    ]

    // Filter out the failed query and return 8 suggestions
    return popularSuggestions.filter((suggestion) => suggestion.toLowerCase() !== failedQuery.toLowerCase()).slice(0, 8)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tech Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/tech-background.jpg)",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Responsive Background Positioning */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute.inset-0 {
            background-attachment: scroll !important;
            background-position: center center !important;
            background-size: cover !important;
          }
        }
        
        /* Electric styles */
        .electric-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(147, 51, 234, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .electric-card:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(147, 51, 234, 0.3),
            0 0 60px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .electric-search-bar {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 30px rgba(147, 51, 234, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

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

        .electric-sidebar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(147, 51, 234, 0.1);
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .electric-suggestion-chip {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 4px 16px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(147, 51, 234, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .electric-suggestion-chip:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(147, 51, 234, 0.4);
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(147, 51, 234, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      `}</style>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="electric-search-bar border-b border-white/10 relative z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Search Bar */}
              <div className="flex items-center space-x-4 flex-1 max-w-2xl">
                <div className="flex space-x-3 flex-1">
                  <div className="flex-1 max-w-md">
                    <Input
                      type="text"
                      placeholder="Search products across all stores..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="electric-input text-sm py-2 px-4 rounded-full border-0 text-gray-800 placeholder-gray-500 font-medium"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    size="sm"
                    className="electric-button text-white px-4 rounded-full border-0 font-semibold"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 mx-8">
                <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={onBackToHome}>
                  <img
                    src="/pricefy-logo.png"
                    alt="Pricefy"
                    className="h-10 w-auto hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                  />
                </Button>
              </div>

              {/* User Actions */}
              <div className="flex items-center space-x-4 relative z-50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoritesClick}
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Favorites</span>
                  {currentUser && userFavorites.length > 0 && (
                    <span className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-lg">
                      {userFavorites.length}
                    </span>
                  )}
                </Button>
                {currentUser ? (
                  <div className="relative z-50">
                    <ProfileDropdown
                      user={currentUser}
                      onProfileClick={onProfileClick}
                      onLogout={handleLogout}
                      isDarkTheme={true}
                    />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthModal(true)}
                    className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAboutClick}
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Info className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">About</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          {error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <Card className="electric-card max-w-md p-8">
                <CardContent className="text-center">
                  <Alert className="bg-red-500/20 border-red-400/30 text-white mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                  <Button onClick={() => performSearch(query, 1, true)} className="electric-button text-white">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : products.length === 0 && !loading ? (
            /* No Results */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="electric-card rounded-3xl p-12 max-w-2xl mx-auto">
                <SearchX className="w-24 h-24 text-white/60 mx-auto mb-6 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">No results found</h2>
                <p className="text-xl text-white/80 mb-2 drop-shadow-sm">
                  We couldn't find any products matching "{query}"
                </p>
                <p className="text-white/60 drop-shadow-sm">Try searching for something else or adjust your filters</p>
                {/* Clickable Suggestions */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4 text-center drop-shadow-sm">
                    Try searching for:
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                    {getNoResultsSuggestions(query).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => onNewSearch(suggestion)}
                        className="electric-suggestion-chip px-4 py-2 rounded-full text-sm font-medium text-white/90 hover:text-white transition-all duration-300 hover:scale-105"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Results Layout */
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <div className="electric-sidebar rounded-2xl p-6 sticky top-6">
                  <h3 className="text-lg font-semibold mb-6 text-white drop-shadow-sm flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h3>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-3 block drop-shadow-sm">Category</label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(value) => {
                          setSelectedCategory(value)
                          handleFiltersChange()
                        }}
                      >
                        <SelectTrigger className="electric-input text-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-3 block drop-shadow-sm">Price Range</label>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          onValueCommit={handleFiltersChange}
                          max={15000}
                          min={50}
                          step={50}
                          className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-white/70">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-3 block drop-shadow-sm">Sort By</label>
                      <Select
                        value={sortBy}
                        onValueChange={(value: any) => {
                          setSortBy(value)
                          handleFiltersChange()
                        }}
                      >
                        <SelectTrigger className="electric-input text-gray-800">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relevance">Relevance</SelectItem>
                          <SelectItem value="price_low_to_high">Price: Low to High</SelectItem>
                          <SelectItem value="price_high_to_low">Price: High to Low</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                          <SelectItem value="avg_customer_review">Customer Rating</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg flex items-center">
                    <ShoppingCart className="w-6 h-6 mr-2" />
                    Search results for "{query}"
                  </h2>
                  <p className="text-white/70 mt-1 drop-shadow-sm">
                    {loading ? "Searching across all stores..." : `Found ${totalResults.toLocaleString()} products`}
                    {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
                  </p>
                </div>

                {loading && products.length === 0 ? (
                  /* Loading State */
                  <div className="flex justify-center items-center py-20">
                    <div className="electric-card rounded-2xl p-8 text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-purple-400 mx-auto mb-4" />
                      <p className="text-white text-lg">Searching across all stores...</p>
                      <p className="text-white/60 text-sm mt-2">Finding the best deals for you</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      {products.map((product) => {
                        const discount = product.originalPrice
                          ? calculateDiscount(product.originalPrice, product.currentPrice)
                          : 0

                        return (
                          <div
                            key={product.id}
                            className="electric-card rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                            onClick={() => onProductSelect(product)}
                          >
                            {/* Discount Badge */}
                            {discount > 0 && (
                              <div className="absolute top-4 right-4 z-10">
                                <Badge className="discount-badge text-white font-bold px-2 py-1">-{discount}%</Badge>
                              </div>
                            )}

                            <div className="flex space-x-4">
                              <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 overflow-hidden">
                                  <img
                                    src={product.image || "/placeholder.svg?height=96&width=96"}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = "/placeholder.svg?height=96&width=96"
                                    }}
                                  />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 drop-shadow-sm">
                                  {product.name}
                                </h3>

                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="flex items-center">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                                    <span className="text-sm text-white/80 ml-1 drop-shadow-sm">
                                      {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
                                    </span>
                                  </div>
                                  <Badge
                                    variant="secondary"
                                    className={`backdrop-blur-sm ${getStoreBadgeColor(product.store)}`}
                                  >
                                    {product.store}
                                  </Badge>
                                  {product.brand && (
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-500/20 text-blue-200 border-blue-400/30 backdrop-blur-sm text-xs"
                                    >
                                      {product.brand}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-2xl font-bold text-green-300 drop-shadow-lg">
                                      {formatPrice(product.currentPrice)}
                                    </div>
                                    {product.originalPrice && product.originalPrice > product.currentPrice && (
                                      <div className="text-sm text-white/60 line-through drop-shadow-sm">
                                        {formatPrice(product.originalPrice)}
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFavorite(product.id)
                                      }}
                                      className={`${
                                        product.isFavorite ? "text-red-400" : "text-white/60"
                                      } hover:text-red-300 hover:bg-white/10 transition-all duration-300`}
                                    >
                                      <Heart
                                        className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""} drop-shadow-sm`}
                                      />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        window.open(product.storeUrl, "_blank")
                                      }}
                                      className="text-white/60 hover:text-green-300 hover:bg-white/10 transition-all duration-300"
                                    >
                                      <ExternalLink className="w-4 h-4 drop-shadow-sm" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Availability */}
                                <div className="mt-2 flex items-center justify-between">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      product.availability === "In Stock"
                                        ? "bg-green-500/20 text-green-300"
                                        : product.availability === "Limited Stock"
                                          ? "bg-yellow-500/20 text-yellow-300"
                                          : "bg-red-500/20 text-red-300"
                                    }`}
                                  >
                                    {product.availability}
                                  </span>

                                  {discount > 0 && (
                                    <div className="flex items-center text-xs text-green-300">
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      Great Deal!
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Load More Button */}
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <Button
                          onClick={handleLoadMore}
                          disabled={loading}
                          className="electric-button text-white px-8 py-3"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Loading...
                            </>
                          ) : (
                            "Load More Products"
                          )}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
