"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Heart, Star, TrendingUp, TrendingDown, Share2, ShoppingCart, Bell, BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import UniversalSearchBar from "./universal-search-bar"
import PriceHistoryChart from "./price-history-chart"
import { productService, type Product } from "@/lib/product-service"
import ProductComparisonModal from "./product-comparison-modal"
import AuthModal from "./auth-modal"
import ProfileDropdown from "./profile-dropdown"

interface ProductPageProps {
  product: Product
  user: { name: string; email: string } | null
  onBack: () => void
  onLoginRequired: () => void
  onFavoriteToggle: (productId: string, productData?: any) => void
  onPriceAlertToggle: (productId: string, productData?: any, alertData?: any) => void
  onNewSearch: (query: string) => void
  onLoginSuccess?: (userData: { name: string; email: string }) => void
  onLogout?: () => void
  onFavoritesClick?: () => void
  onProfileClick?: () => void
}

export default function ProductPage({
  product,
  user,
  onBack,
  onLoginRequired,
  onFavoriteToggle,
  onPriceAlertToggle,
  onNewSearch,
  onLoginSuccess,
  onLogout,
  onFavoritesClick,
  onProfileClick,
}: ProductPageProps) {
  const [currentProduct, setCurrentProduct] = useState<Product>(product)
  const [loading, setLoading] = useState(false)
  const [priceHistory, setPriceHistory] = useState<{ date: string; price: number }[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"1w" | "1m">("1m")
  const [showComparison, setShowComparison] = useState(false)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [favoritesCount, setFavoritesCount] = useState(3) // Mock count
  const [hasActiveAlert, setHasActiveAlert] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(user)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Update current user when prop changes
  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  // Load detailed product data and price history
  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true)
      try {
        // Get detailed product information
        const detailedProduct = await productService.getProductDetails(product.id)
        if (detailedProduct) {
          setCurrentProduct(detailedProduct)
        }

        // Get price history
        const history = await productService.getPriceHistory(product.id)
        setPriceHistory(history)
      } catch (error) {
        console.error("Error loading product details:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProductDetails()
  }, [product.id])

  // Load similar products for comparison
  useEffect(() => {
    const loadSimilarProducts = async () => {
      try {
        const similar = await productService.getSimilarProducts(currentProduct.id, currentProduct.category)
        setSimilarProducts(similar)
      } catch (error) {
        console.error("Error loading similar products:", error)
      }
    }

    loadSimilarProducts()
  }, [currentProduct.id, currentProduct.category])

  // Check if user has active price alert for this product
  useEffect(() => {
    if (currentUser) {
      const userPriceAlertsDB = (globalThis as any).userPriceAlertsDB || {}
      const userAlerts = userPriceAlertsDB[currentUser.email] || []
      const hasAlert = userAlerts.some((alert: any) => alert.productId === currentProduct.id && alert.isActive)
      setHasActiveAlert(hasAlert)
    }
  }, [currentUser, currentProduct.id])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const calculateDiscount = (original: number, current: number) => {
    if (!original || original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const calculatePriceChange = () => {
    if (priceHistory.length < 2) return { change: 0, percentage: 0, isIncrease: false }

    const current = priceHistory[priceHistory.length - 1].price
    const previous = priceHistory[priceHistory.length - 2].price
    const change = current - previous
    const percentage = Math.abs((change / previous) * 100)

    return {
      change: Math.abs(change),
      percentage,
      isIncrease: change > 0,
    }
  }

  const priceChange = calculatePriceChange()
  const discount = currentProduct.originalPrice
    ? calculateDiscount(currentProduct.originalPrice, currentProduct.currentPrice)
    : 0

  const handleFavoriteToggle = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    // Update the product favorite status
    const wasFavorite = currentProduct.isFavorite
    setCurrentProduct((prev) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
    }))

    // Update favorites count
    setFavoritesCount((prev) => (wasFavorite ? prev - 1 : prev + 1))

    // Call parent's favorite toggle with product data
    onFavoriteToggle(currentProduct.id, currentProduct)

    // Show feedback
    console.log(wasFavorite ? "Removed from favorites" : "Added to favorites")
  }

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setCurrentUser(userData)
    setShowAuthModal(false)

    // Call parent's onLoginSuccess if provided
    if (onLoginSuccess) {
      onLoginSuccess(userData)
    }

    console.log("User logged in successfully:", userData)
  }

  const handleBackClick = () => {
    console.log("Back button clicked")
    onBack()
  }

  const handleSearchSubmit = (query: string) => {
    console.log("Search submitted:", query)
    // Clear current product to go back to search results
    setSelectedProduct(null)
    onNewSearch(query)
  }

  const handleFavoritesClick = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    // Call parent's favorites handler if provided
    if (onFavoritesClick) {
      onFavoritesClick()
    } else {
      console.log("Navigate to favorites page")
    }
  }

  const handleProfileClick = () => {
    // Call parent's profile handler if provided
    if (onProfileClick) {
      onProfileClick()
    } else {
      console.log("Profile clicked")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    console.log("Logout clicked")

    // Call parent's onLogout if provided
    if (onLogout) {
      onLogout()
    }
  }

  const handlePriceAlert = () => {
    if (!currentUser) {
      setShowAuthModal(true)
      return
    }

    // Toggle price alert and call parent function
    const newAlertState = !hasActiveAlert
    setHasActiveAlert(newAlertState)

    // Call parent's price alert toggle with product data
    onPriceAlertToggle(currentProduct.id, currentProduct, {
      alertType: "below", // Default to price drop alert
      targetPrice: currentProduct.currentPrice * 0.9, // Default to 10% below current price
    })

    console.log(newAlertState ? "Price drop alert set" : "Price drop alert removed")
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
        }

        .electric-header {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 30px rgba(147, 51, 234, 0.2),
            0 0 60px rgba(59, 130, 246, 0.1);
        }

        .electric-button {
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 0 20px rgba(147, 51, 234, 0.4),
            0 4px 16px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .price-trend-up {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .price-trend-down {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
      `}</style>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Header */}
        <header className="electric-header relative z-[200]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <Button
                variant="ghost"
                onClick={handleBackClick}
                className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>

              {/* Search Bar */}
              <div className="flex-1 max-w-md mx-8 relative z-[250]">
                <UniversalSearchBar
                  onSearch={handleSearchSubmit}
                  placeholder="Search for more products..."
                  size="sm"
                  showSuggestions={true}
                />
              </div>

              {/* Right Side - User Actions */}
              <div className="flex items-center space-x-3">
                {currentUser ? (
                  <>
                    {/* Price Alert Button */}
                    <Button
                      onClick={handlePriceAlert}
                      variant="ghost"
                      className={`transition-all duration-300 ${
                        hasActiveAlert
                          ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                      title={hasActiveAlert ? "Remove price drop alert" : "Set price drop alert"}
                    >
                      {hasActiveAlert ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                    </Button>

                    {/* Favorites Button */}
                    <Button
                      variant="ghost"
                      onClick={handleFavoritesClick}
                      className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300 relative"
                    >
                      <Heart
                        className={`w-5 h-5 mr-2 ${currentProduct.isFavorite ? "fill-current text-red-400" : ""}`}
                      />
                      <span className="hidden sm:inline">Favorites</span>
                      {/* Favorites count badge */}
                      {favoritesCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {favoritesCount}
                        </div>
                      )}
                    </Button>

                    {/* Profile Dropdown */}
                    <ProfileDropdown
                      user={currentUser}
                      onProfileClick={handleProfileClick}
                      onLogout={handleLogout}
                      isDarkTheme={true}
                    />
                  </>
                ) : (
                  <>
                    {/* Price Alert Button - Not Logged In */}
                    <Button
                      variant="ghost"
                      onClick={() => setShowAuthModal(true)}
                      className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                      title="Login to set price alerts"
                    >
                      <Bell className="w-5 h-5" />
                    </Button>

                    {/* Favorites Button - Not Logged In */}
                    <Button
                      variant="ghost"
                      onClick={() => setShowAuthModal(true)}
                      className="text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Favorites</span>
                    </Button>

                    {/* Login Button */}
                    <Button
                      variant="outline"
                      onClick={() => setShowAuthModal(true)}
                      className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20 hover:text-white"
                    >
                      Login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <Card className="electric-card">
                <CardContent className="p-6">
                  <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 overflow-hidden">
                    <img
                      src={currentProduct.image || "/placeholder.svg?height=400&width=400"}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=400&width=400"
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Basic Info */}
              <Card className="electric-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{currentProduct.name}</h1>
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-white/80 ml-1">
                              {currentProduct.rating.toFixed(1)} ({currentProduct.reviews.toLocaleString()} reviews)
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                            {currentProduct.store}
                          </Badge>
                          {currentProduct.brand && (
                            <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                              {currentProduct.brand}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {discount > 0 && (
                        <Badge className="bg-red-500 text-white font-bold px-3 py-1">-{discount}% OFF</Badge>
                      )}
                    </div>

                    {/* Price Section */}
                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-3">
                        <span className="text-3xl font-bold text-green-300 drop-shadow-lg">
                          {formatPrice(currentProduct.currentPrice)}
                        </span>
                        {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.currentPrice && (
                          <span className="text-lg text-white/60 line-through">
                            {formatPrice(currentProduct.originalPrice)}
                          </span>
                        )}
                      </div>

                      {priceChange.change > 0 && (
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={`${priceChange.isIncrease ? "price-trend-up" : "price-trend-down"} text-white`}
                          >
                            {priceChange.isIncrease ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {priceChange.isIncrease ? "+" : "-"}
                            {formatPrice(priceChange.change)} ({priceChange.percentage.toFixed(1)}%)
                          </Badge>
                          <span className="text-xs text-white/60">vs last update</span>
                        </div>
                      )}

                      {/* Compare Button next to price */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          onClick={() => setShowComparison(true)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-300 hover:text-blue-200 hover:bg-blue-500/10 transition-all duration-300 p-2"
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Compare Similar
                        </Button>
                      </div>

                      {/* Price Alert Status */}
                      {hasActiveAlert && (
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                            <BellRing className="w-3 h-3 mr-1" />
                            Price Drop Alert Active
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          currentProduct.availability === "In Stock"
                            ? "bg-green-500/20 text-green-300"
                            : currentProduct.availability === "Limited Stock"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {currentProduct.availability}
                      </span>
                    </div>

                    <Separator className="bg-white/20" />

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleFavoriteToggle}
                        variant="outline"
                        size="icon"
                        className={`${
                          currentProduct.isFavorite
                            ? "bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                            : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                        }`}
                        title={currentProduct.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-4 h-4 ${currentProduct.isFavorite ? "fill-current" : ""}`} />
                      </Button>

                      <Button
                        onClick={handlePriceAlert}
                        variant="outline"
                        size="icon"
                        className={`${
                          hasActiveAlert
                            ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/30"
                            : "bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                        }`}
                        title={hasActiveAlert ? "Remove price drop alert" : "Set price drop alert"}
                      >
                        {hasActiveAlert ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </Button>

                      <Button
                        onClick={() => window.open(currentProduct.storeUrl, "_blank")}
                        className="electric-button text-white flex-1"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy on {currentProduct.store}
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Price History - moved inside right column */}
              <Card className="electric-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white drop-shadow-sm text-lg">Price History</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="electric-tabs bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                        {[
                          { key: "1w", label: "1W" },
                          { key: "1m", label: "1M" },
                        ].map((period) => (
                          <button
                            key={period.key}
                            onClick={() => setSelectedPeriod(period.key as "1w" | "1m")}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                              selectedPeriod === period.key
                                ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                                : "text-white/70 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {period.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-48">
                    <PriceHistoryChart data={priceHistory} duration={selectedPeriod} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Product Comparison Modal */}
        <ProductComparisonModal
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
          currentProduct={currentProduct}
          similarProducts={similarProducts}
          onProductSelect={(product) => {
            setCurrentProduct(product)
            // Reload product details for the new product
            const loadNewProduct = async () => {
              setLoading(true)
              try {
                const detailedProduct = await productService.getProductDetails(product.id)
                if (detailedProduct) {
                  setCurrentProduct(detailedProduct)
                }
                const history = await productService.getPriceHistory(product.id)
                setPriceHistory(history)
              } catch (error) {
                console.error("Error loading product details:", error)
              } finally {
                setLoading(false)
              }
            }
            loadNewProduct()
          }}
        />

        {/* Auth Modal */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
