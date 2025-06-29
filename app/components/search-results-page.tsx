"use client"

import { useState, useEffect } from "react"
import { Search, Heart, User, Info, ExternalLink, Star, SearchX, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProfileDropdown from "./profile-dropdown"
import AuthModal from "./auth-modal"
import { turkishStoresService, type TurkishProduct } from "@/lib/turkish-stores-api"
import { testTurkishStores } from "@/lib/test-turkish-stores"

interface Product {
  id: string
  name: string
  image: string
  currentPrice: number
  originalPrice?: number
  store: string
  rating: number
  reviews: number
  isFavorite: boolean
  storeUrl: string
  category: string
  tags: string[]
  brand: string
  priceHistory: { date: string; price: number }[]
  description?: string
}

interface SearchResultsPageProps {
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
  onFavoriteToggle: (productId: string, productData?: any) => void
}

// Convert TurkishProduct to our Product interface
const convertToProduct = (turkishProduct: TurkishProduct, userFavorites: string[] = []): Product => {
  return {
    id: turkishProduct.id,
    name: turkishProduct.name,
    image: turkishProduct.image,
    currentPrice: turkishProduct.currentPrice,
    originalPrice: turkishProduct.originalPrice,
    store: turkishProduct.store,
    rating: turkishProduct.rating,
    reviews: turkishProduct.reviews,
    isFavorite: userFavorites.includes(turkishProduct.id),
    storeUrl: turkishProduct.storeUrl,
    category: turkishProduct.category,
    tags: [
      ...turkishProduct.name.toLowerCase().split(" "),
      turkishProduct.category.toLowerCase(),
      turkishProduct.brand.toLowerCase(),
      ...turkishProduct.description.toLowerCase().split(" ").slice(0, 5),
    ].filter((tag) => tag.length > 2),
    brand: turkishProduct.brand,
    priceHistory: [
      { date: "2023-08-01", price: turkishProduct.currentPrice + 500 },
      { date: "2023-10-01", price: turkishProduct.currentPrice + 300 },
      { date: "2024-01-01", price: turkishProduct.currentPrice },
    ],
    description: turkishProduct.description,
  }
}

export default function SearchResultsPage({
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
}: SearchResultsPageProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [priceRange, setPriceRange] = useState([50, 6000])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStores, setSelectedStores] = useState({
    trendyol: true,
    hepsiburada: true,
    n11: true,
    amazonturkey: true,
  })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<string[]>(["All Categories"])
  const [storeResults, setStoreResults] = useState<Record<string, number>>({})

  // Update search query when prop changes
  useEffect(() => {
    setSearchQuery(query)
  }, [query])

  // Update current user when prop changes
  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  // Add this useEffect to run the test when the component mounts
  useEffect(() => {
    console.log("🧪 Running Turkish Stores API test...")
    testTurkishStores()
  }, [])

  // Fetch products from Turkish stores
  useEffect(() => {
    const fetchProducts = async () => {
      if (!query.trim()) return

      console.log("🚀 STARTING FETCH WITH NEW TURKISH STORES API")
      console.log("🔍 Query:", query)

      setLoading(true)
      try {
        console.log("🔍 Starting search for:", query)

        // Search all Turkish stores
        const searchResults = await turkishStoresService.searchAllStores(query, {
          limit: 15, // 15 products per store
        })

        console.log("📊 Search results:", searchResults)
        console.log("🏪 Raw products from API:", searchResults.products.slice(0, 3))

        // Convert to our Product format
        const convertedProducts = searchResults.products.map((product) => convertToProduct(product, userFavorites))

        console.log("✅ Converted products:", convertedProducts.slice(0, 3))
        console.log(
          "🏪 Store distribution in converted products:",
          convertedProducts.reduce(
            (acc, p) => {
              acc[p.store] = (acc[p.store] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
        )

        setProducts(convertedProducts)
        setStoreResults(searchResults.storeResults)

        // Extract unique categories
        const categorySet = new Set<string>()
        convertedProducts.forEach((product) => {
          categorySet.add(product.category)
        })
        setCategories(["All Categories", ...Array.from(categorySet).sort()])

        console.log("✅ Products loaded:", convertedProducts.length)
        console.log("🏪 Store distribution:", searchResults.storeResults)
      } catch (error) {
        console.error("❌ Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [query, userFavorites])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const toggleFavorite = (productId: string) => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    // Find the product data to pass along
    const productData = products.find((p) => p.id === productId)
    console.log("Toggling favorite in search results:", productId, productData)

    // Call the parent's favorite toggle function
    onFavoriteToggle(productId, productData)

    // Note: We don't update local state here anymore since the parent will handle it
    // and the products will be re-rendered with updated favorite status from props
  }

  // Enhanced search function
  const searchProducts = (searchTerm: string, products: Product[]) => {
    if (!searchTerm.trim()) return products

    const normalizedQuery = searchTerm.toLowerCase().trim()
    const queryWords = normalizedQuery.split(/\s+/)

    return products.filter((product) => {
      const searchableText = [product.name, product.category, product.brand, product.description || "", ...product.tags]
        .join(" ")
        .toLowerCase()

      // Check if any query word matches
      return queryWords.some((word) => {
        if (word.length < 2) return false
        return searchableText.includes(word)
      })
    })
  }

  // Enhanced filtering with search
  const filteredProducts = (() => {
    const baseProducts = products

    // Apply filters
    return baseProducts
      .filter((product) => {
        // Category filter
        const categoryMatch = selectedCategory === "All Categories" || product.category === selectedCategory

        // Price range filter
        const priceMatch = product.currentPrice >= priceRange[0] && product.currentPrice <= priceRange[1]

        // Store filter
        const storeMatch = (() => {
          const storeName = product.store.toLowerCase()

          if (storeName.includes("trendyol")) return selectedStores.trendyol
          if (storeName.includes("hepsiburada")) return selectedStores.hepsiburada
          if (storeName.includes("n11")) return selectedStores.n11
          if (storeName.includes("amazon")) return selectedStores.amazonturkey

          return true // Default to show if no match
        })()

        return categoryMatch && priceMatch && storeMatch
      })
      .map((product) => ({
        ...product,
        // Update favorite status based on current userFavorites prop
        isFavorite: userFavorites.includes(product.id),
      }))
  })()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onNewSearch(searchQuery)
    }
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

  const popularSuggestions = [
    "phone",
    "laptop",
    "watch",
    "shoes",
    "perfume",
    "sunglasses",
    "bag",
    "shirt",
    "furniture",
    "skincare",
  ]

  // Get category distribution for current results
  const categoryDistribution = filteredProducts.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Group products by name for price comparison
  const groupedProducts = filteredProducts.reduce(
    (groups, product) => {
      const baseName = product.name

      if (!groups[baseName]) {
        groups[baseName] = []
      }
      groups[baseName].push(product)
      return groups
    },
    {} as Record<string, Product[]>,
  )

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/tech-background.jpg)",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Searching Turkish Stores...</h2>
            <p className="text-white/70">Fetching deals from Trendyol, Hepsiburada, N11, and Amazon Turkey</p>
            <div className="mt-4 flex justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">Trendyol</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">Hepsiburada</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">N11</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-white/60 text-sm">Amazon Turkey</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tech Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/space-tech-background.jpg)",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute.inset-0 {
            background-attachment: scroll !important;
            background-position: center center !important;
            background-size: cover !important;
          }
        }

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

        .electric-input:focus {
          background: rgba(255, 255, 255, 0.95);
          border-color: rgba(147, 51, 234, 0.5);
          box-shadow: 
            0 0 20px rgba(147, 51, 234, 0.3),
            0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .electric-button {
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 0 20px rgba(147, 51, 234, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .electric-button:hover {
          box-shadow: 
            0 0 30px rgba(147, 51, 234, 0.6),
            0 6px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        .electric-sidebar {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(147, 51, 234, 0.1);
        }

        .electric-product-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            0 0 15px rgba(147, 51, 234, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .electric-product-card:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 16px 48px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(147, 51, 234, 0.3),
            0 0 60px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .electric-no-results {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(30px);
          border: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 16px 64px rgba(0, 0, 0, 0.3),
            0 0 40px rgba(147, 51, 234, 0.2),
            0 0 80px rgba(59, 130, 246, 0.1);
        }

        .price-comparison-group {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(147, 51, 234, 0.3);
          box-shadow: 
            0 12px 48px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(147, 51, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .best-price {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
          border: 2px solid rgba(16, 185, 129, 0.4);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
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
              {/* Left Side - Search Bar */}
              <div className="flex items-center space-x-4 flex-1 max-w-2xl">
                <div className="flex space-x-3 flex-1">
                  <div className="flex-1 max-w-md">
                    <Input
                      type="text"
                      placeholder="Search products..."
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
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Center - Logo */}
              <div className="flex-shrink-0 mx-8">
                <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={onBackToHome}>
                  <img
                    src="/pricefy-logo.png"
                    alt="Pricefy"
                    className="h-10 w-auto hover:scale-105 transition-transform duration-200 drop-shadow-lg"
                  />
                </Button>
              </div>

              {/* Right Side - User Actions */}
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
          {filteredProducts.length === 0 ? (
            /* No Results */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="electric-no-results rounded-3xl p-12 max-w-2xl mx-auto relative">
                <div className="mb-8">
                  <SearchX className="w-24 h-24 text-white/60 mx-auto mb-6 drop-shadow-lg" />
                  <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">No results found</h2>
                  <p className="text-xl text-white/80 mb-2 drop-shadow-sm">
                    We couldn't find any products matching "{query}"
                  </p>
                  <p className="text-white/60 drop-shadow-sm">
                    Try searching for something else or check out our popular searches
                  </p>
                </div>

                <div className="w-full mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 drop-shadow-sm">Popular searches:</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {popularSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => onNewSearch(suggestion)}
                        className="electric-card border-white/20 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <Button
                    onClick={onBackToHome}
                    variant="outline"
                    size="lg"
                    className="electric-card border-white/30 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => onNewSearch("")}
                    size="lg"
                    className="electric-button text-white font-semibold"
                  >
                    Try New Search
                  </Button>
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

                  {/* Store Results Summary */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-white/90 mb-3 drop-shadow-sm">Store Results</h4>
                    <div className="space-y-2">
                      {Object.entries(storeResults).map(([store, count]) => (
                        <div key={store} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                store === "Trendyol"
                                  ? "bg-orange-500"
                                  : store === "Hepsiburada"
                                    ? "bg-blue-500"
                                    : store === "N11"
                                      ? "bg-green-500"
                                      : "bg-yellow-500"
                              }`}
                            />
                            <span className="text-white/80">{store}</span>
                          </div>
                          <span className="text-white/60">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-3 block drop-shadow-sm">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="electric-input text-gray-800">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                              {categoryDistribution[category] && category !== "All Categories" && (
                                <span className="ml-2 text-gray-500">({categoryDistribution[category]})</span>
                              )}
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
                          max={6000}
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

                    {/* Stores */}
                    <div>
                      <label className="text-sm font-medium text-white/90 mb-3 block drop-shadow-sm">Stores</label>
                      <div className="space-y-3">
                        {[
                          { key: "trendyol", label: "Trendyol", color: "bg-orange-500" },
                          { key: "hepsiburada", label: "Hepsiburada", color: "bg-blue-500" },
                          { key: "n11", label: "N11", color: "bg-green-500" },
                          { key: "amazonturkey", label: "Amazon Turkey", color: "bg-yellow-500" },
                        ].map((store) => (
                          <div key={store.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={store.key}
                              checked={selectedStores[store.key as keyof typeof selectedStores]}
                              onCheckedChange={(checked) =>
                                setSelectedStores((prev) => ({ ...prev, [store.key]: checked }))
                              }
                            />
                            <div className={`w-2 h-2 rounded-full ${store.color}`} />
                            <label
                              htmlFor={store.key}
                              className="text-sm text-white/80 cursor-pointer hover:text-white transition-colors"
                            >
                              {store.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white drop-shadow-lg">Search results for "{query}"</h2>
                  <p className="text-white/70 mt-1 drop-shadow-sm">
                    Found {filteredProducts.length} products from {Object.keys(storeResults).length} Turkish stores
                    {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
                  </p>
                  <p className="text-white/60 text-sm mt-1 drop-shadow-sm">
                    Compare prices across Trendyol, Hepsiburada, N11, and Amazon Turkey
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span>Grid View</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/40 rounded-sm"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-sm"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="electric-product-card rounded-2xl p-6 cursor-pointer relative overflow-hidden"
                      onClick={() => onProductSelect(product)}
                    >
                      {/* Product Image */}
                      <div className="mb-4">
                        <div className="w-full h-48 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white line-clamp-2 drop-shadow-sm min-h-[3.5rem]">
                          {product.name}
                        </h3>

                        {/* Store and Rating */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-white/90 border-white/30 backdrop-blur-sm text-xs ${
                              product.store === "Trendyol"
                                ? "bg-orange-500/20"
                                : product.store === "Hepsiburada"
                                  ? "bg-blue-500/20"
                                  : product.store === "N11"
                                    ? "bg-green-500/20"
                                    : "bg-yellow-500/20"
                            }`}
                          >
                            {product.store}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                            <span className="text-sm text-white/80 ml-1 drop-shadow-sm">{product.rating}</span>
                          </div>
                        </div>

                        {/* Brand */}
                        <Badge
                          variant="outline"
                          className="bg-purple-500/20 text-purple-200 border-purple-400/30 backdrop-blur-sm text-xs w-fit"
                        >
                          {product.brand}
                        </Badge>

                        {/* Price */}
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-purple-300 drop-shadow-lg">
                            {formatPrice(product.currentPrice)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-sm text-white/60 line-through drop-shadow-sm">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(product.id)
                            }}
                            className={`${product.isFavorite ? "text-red-400" : "text-white/60"} hover:text-red-300 hover:bg-white/10 transition-all duration-300`}
                          >
                            <Heart className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""} drop-shadow-sm`} />
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
                    </div>
                  ))}
                </div>
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
