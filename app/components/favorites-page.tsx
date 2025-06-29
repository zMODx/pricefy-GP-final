"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Heart,
  Star,
  ExternalLink,
  Trash2,
  Bell,
  BellRing,
  Grid3X3,
  List,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import UniversalSearchBar from "./universal-search-bar"

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

interface FavoritesPageProps {
  user: { name: string; email: string; profilePic?: string } | null
  userFavorites: string[]
  favoriteProducts?: Product[]
  onClose: () => void
  onProductSelect: (product: Product) => void
  onNewSearch: (query: string) => void
  onBackToSearch?: () => void
  onFavoriteToggle?: (productId: string, productData?: any) => void
  onProfileClick?: () => void
}

type ViewMode = "grid" | "list"
type SortBy = "name" | "price" | "rating" | "store"
type SortOrder = "asc" | "desc"

export default function FavoritesPage({
  user,
  userFavorites,
  favoriteProducts = [],
  onClose,
  onProductSelect,
  onNewSearch,
  onBackToSearch,
  onFavoriteToggle,
  onProfileClick,
}: FavoritesPageProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceAlerts, setPriceAlerts] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

  // Load user's price alerts
  useEffect(() => {
    if (user) {
      const userPriceAlertsDB = (globalThis as any).userPriceAlertsDB || {}
      const userAlerts = userPriceAlertsDB[user.email] || []
      setPriceAlerts(userAlerts)
    }
  }, [user])

  // Use the provided favorite products directly
  useEffect(() => {
    console.log("FavoritesPage received favoriteProducts:", favoriteProducts)
    console.log("FavoritesPage received userFavorites:", userFavorites)

    if (!user) {
      setDisplayProducts([])
      setLoading(false)
      return
    }

    if (favoriteProducts && favoriteProducts.length > 0) {
      // Use the provided product data
      setDisplayProducts(favoriteProducts)
      setLoading(false)
    } else if (userFavorites.length === 0) {
      // No favorites
      setDisplayProducts([])
      setLoading(false)
    } else {
      // Fallback: we have favorite IDs but no product data
      setError("Unable to load favorite product details. Please try refreshing.")
      setLoading(false)
    }
  }, [user, userFavorites, favoriteProducts])

  // Sort products based on current sort settings
  const sortedProducts = [...displayProducts].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "price":
        comparison = a.currentPrice - b.currentPrice
        break
      case "rating":
        comparison = a.rating - b.rating
        break
      case "store":
        comparison = a.store.localeCompare(b.store)
        break
      default:
        comparison = 0
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

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

  const handleRemoveFavorite = (productId: string) => {
    console.log("Removing favorite:", productId)

    if (onFavoriteToggle) {
      onFavoriteToggle(productId)
    }

    // Remove from local state immediately for better UX
    setDisplayProducts((prev) => prev.filter((product) => product.id !== productId))
  }

  const calculateTotalSavings = () => {
    return sortedProducts.reduce((total, product) => {
      if (product.originalPrice && product.originalPrice > product.currentPrice) {
        return total + (product.originalPrice - product.currentPrice)
      }
      return total
    }, 0)
  }

  const totalSavings = calculateTotalSavings()

  const handleNewSearch = (query: string) => {
    onClose() // Close favorites page first
    onNewSearch(query) // Then trigger search
  }

  // Check if a product has an active price alert
  const hasActiveAlert = (productId: string) => {
    return priceAlerts.some((alert) => alert.productId === productId && alert.isActive)
  }

  // Handle price alert toggle
  const handlePriceAlertToggle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent product selection

    if (!user) {
      console.log("No user logged in, cannot toggle price alert")
      return
    }

    const userPriceAlertsDB = (globalThis as any).userPriceAlertsDB || {}
    const currentAlerts = userPriceAlertsDB[user.email] || []
    const existingAlertIndex = currentAlerts.findIndex((alert: any) => alert.productId === product.id)

    let newAlerts: any[]

    if (existingAlertIndex !== -1) {
      // Remove existing alert
      newAlerts = currentAlerts.filter((alert: any) => alert.productId !== product.id)
      console.log("Removed price alert for:", product.id)
    } else {
      // Add new alert
      const newAlert = {
        id: `alert_${Date.now()}`,
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        currentPrice: product.currentPrice,
        targetPrice: product.currentPrice * 0.9, // Default to 10% below current price
        alertType: "below",
        dateCreated: new Date().toISOString(),
        isActive: true,
      }
      newAlerts = [...currentAlerts, newAlert]
      console.log("Added price alert:", newAlert)
    }

    // Update global database
    userPriceAlertsDB[user.email] = newAlerts

    // Update local state
    setPriceAlerts(newAlerts)

    console.log("Updated price alerts:", newAlerts)
  }

  const handleSortChange = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if same sort field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // New sort field, default to ascending
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  const getSortIcon = () => {
    if (sortOrder === "asc") {
      return <ArrowUp className="w-4 h-4" />
    } else {
      return <ArrowDown className="w-4 h-4" />
    }
  }

  const getSortLabel = () => {
    const labels = {
      name: "Name",
      price: "Price",
      rating: "Rating",
      store: "Store",
    }
    return `${labels[sortBy]} (${sortOrder === "asc" ? "A-Z" : "Z-A"})`
  }

  // Grid View Component
  const GridView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedProducts.map((product) => {
        const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.currentPrice) : 0
        const hasAlert = hasActiveAlert(product.id)

        return (
          <Card
            key={product.id}
            className="electric-card cursor-pointer relative overflow-hidden"
            onClick={() => onProductSelect(product)}
          >
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-red-500 text-white font-bold px-2 py-1">-{discount}%</Badge>
              </div>
            )}

            {/* Price Alert Badge */}
            {hasAlert && (
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                  <BellRing className="w-3 h-3 mr-1" />
                  Alert Active
                </Badge>
              </div>
            )}

            <CardContent className="p-6">
              {/* Product Image */}
              <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 overflow-hidden mb-4">
                <img
                  src={product.image || "/placeholder.svg?height=200&width=200"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white line-clamp-2 drop-shadow-sm">{product.name}</h3>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-white/80 ml-1">
                      {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                    {product.store}
                  </Badge>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl font-bold text-green-300 drop-shadow-lg">
                      {formatPrice(product.currentPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.currentPrice && (
                      <span className="text-sm text-white/60 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="text-xs text-green-300">
                      You save {formatPrice(product.originalPrice! - product.currentPrice)}
                    </div>
                  )}
                </div>

                {/* Brand */}
                <Badge
                  variant="outline"
                  className="bg-purple-500/20 text-purple-200 border-purple-400/30 backdrop-blur-sm text-xs w-fit"
                >
                  {product.brand}
                </Badge>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFavorite(product.id)
                    }}
                    className="flex-1 bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handlePriceAlertToggle(product, e)}
                    className={`${
                      hasAlert
                        ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30"
                        : "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                    }`}
                    title={hasAlert ? "Remove price alert" : "Set price alert"}
                  >
                    {hasAlert ? <BellRing className="w-3 h-3 mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
                    {hasAlert ? "Alert On" : "Alert"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(product.storeUrl, "_blank")
                    }}
                    className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Buy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  // List View Component
  const ListView = () => (
    <div className="space-y-4">
      {sortedProducts.map((product) => {
        const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.currentPrice) : 0
        const hasAlert = hasActiveAlert(product.id)

        return (
          <Card
            key={product.id}
            className="electric-card cursor-pointer relative overflow-hidden"
            onClick={() => onProductSelect(product)}
          >
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg?height=128&width=128"}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=128&width=128"
                      }}
                    />
                  </div>

                  {/* Badges */}
                  {discount > 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-red-500 text-white font-bold px-2 py-1 text-xs">-{discount}%</Badge>
                    </div>
                  )}

                  {hasAlert && (
                    <div className="absolute -bottom-2 -left-2">
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30 text-xs">
                        <BellRing className="w-3 h-3 mr-1" />
                        Alert
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white drop-shadow-sm mb-2">{product.name}</h3>

                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white/80 ml-1">
                            {product.rating.toFixed(1)} ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                          {product.store}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-purple-500/20 text-purple-200 border-purple-400/30 backdrop-blur-sm text-xs"
                        >
                          {product.brand}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="space-y-1">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-bold text-green-300 drop-shadow-lg">
                            {formatPrice(product.currentPrice)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.currentPrice && (
                            <span className="text-sm text-white/60 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {discount > 0 && (
                          <div className="text-sm text-green-300">
                            You save {formatPrice(product.originalPrice! - product.currentPrice)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFavorite(product.id)
                        }}
                        className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handlePriceAlertToggle(product, e)}
                        className={`${
                          hasAlert
                            ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30"
                            : "bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                        }`}
                        title={hasAlert ? "Remove price alert" : "Set price alert"}
                      >
                        {hasAlert ? <BellRing className="w-3 h-3 mr-1" /> : <Bell className="w-3 h-3 mr-1" />}
                        {hasAlert ? "Alert On" : "Alert"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(product.storeUrl, "_blank")
                        }}
                        className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

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

        .electric-header {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 30px rgba(147, 51, 234, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1);
        }

        .electric-stats-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(147, 51, 234, 0.1);
        }
      `}</style>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="electric-header">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-8">
                <UniversalSearchBar
                  onSearch={handleNewSearch}
                  placeholder="Search for new products..."
                  size="sm"
                  showSuggestions={true}
                />
              </div>

              {/* Profile Avatar */}
              {user && onProfileClick && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium">{user.name}</span>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Title and Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center">
                  <Heart className="w-8 h-8 mr-3 text-red-400 fill-current" />
                  Your Favorites
                </h1>
                <p className="text-white/70 mt-2 drop-shadow-sm">
                  {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"} saved
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            {sortedProducts.length > 0 && (
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="electric-stats-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white drop-shadow-lg">{sortedProducts.length}</div>
                    <div className="text-sm text-white/70">Saved Products</div>
                  </CardContent>
                </Card>

                <Card className="electric-stats-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-300 drop-shadow-lg">{formatPrice(totalSavings)}</div>
                    <div className="text-sm text-white/70">Total Savings</div>
                  </CardContent>
                </Card>

                <Card className="electric-stats-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-300 drop-shadow-lg">
                      {sortedProducts.length > 0
                        ? Math.round(
                            (sortedProducts.reduce((sum, p) => sum + p.rating, 0) / sortedProducts.length) * 10,
                          ) / 10
                        : 0}
                    </div>
                    <div className="text-sm text-white/70">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* View Controls */}
            {sortedProducts.length > 0 && (
              <div className="flex items-center justify-between mb-6">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">View:</span>
                  <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`${
                        viewMode === "grid"
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Grid
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`${
                        viewMode === "list"
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <List className="w-4 h-4 mr-1" />
                      List
                    </Button>
                  </div>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <span className="text-white/70 text-sm">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                      >
                        {getSortLabel()}
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/80 backdrop-blur-sm border-white/20">
                      <DropdownMenuItem
                        onClick={() => handleSortChange("name")}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("price")}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Price
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("rating")}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Rating
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("store")}
                        className="text-white hover:bg-white/10 cursor-pointer"
                      >
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        Store
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Sort Order Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                    title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
                  >
                    {getSortIcon()}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          {loading ? (
            /* Loading State */
            <div className="flex justify-center items-center py-20">
              <Card className="electric-card p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading your favorites...</p>
              </Card>
            </div>
          ) : error ? (
            /* Error State */
            <div className="flex justify-center items-center py-20">
              <Card className="electric-card max-w-md p-8">
                <Alert className="bg-red-500/20 border-red-400/30 text-white">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </Card>
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <Card className="electric-card max-w-2xl p-12 text-center">
                <Heart className="w-24 h-24 text-white/40 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">No favorites yet</h2>
                <p className="text-white/70 mb-6 drop-shadow-sm">
                  Start exploring products and add them to your favorites to see them here.
                </p>

                {/* Search Interface */}
                <div className="w-full max-w-md mx-auto">
                  <UniversalSearchBar
                    onSearch={handleNewSearch}
                    placeholder="Search for products to add to favorites..."
                    size="default"
                    showSuggestions={true}
                  />
                  <p className="text-white/60 text-sm mt-3">
                    Search for any product and start building your favorites collection!
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            /* Products Display */
            <>{viewMode === "grid" ? <GridView /> : <ListView />}</>
          )}
        </div>
      </div>
    </div>
  )
}
