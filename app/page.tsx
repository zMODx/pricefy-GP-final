"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, Heart, User, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AuthModal from "./components/auth-modal"
import FavoritesPage from "./components/favorites-page"
import AboutSection from "./components/about-section"
import ProductPage from "./components/product-page"
import SearchResultsPage from "./components/search-results-page"
import ProfileDropdown from "./components/profile-dropdown"
import ProfilePage from "./components/profile-page"
import SearchSuggestions from "./components/search-suggestions"

// Enhanced user favorites database with actual product data
const userFavoritesDB: { [userEmail: string]: any[] } = {
  "john.doe@example.com": [], // Start with empty favorites
  "jane.smith@example.com": [],
  "guest@example.com": [],
}

// Price alerts database
const userPriceAlertsDB: { [userEmail: string]: any[] } = {
  "john.doe@example.com": [],
  "jane.smith@example.com": [],
  "guest@example.com": [],
}

// Make it globally accessible
;(globalThis as any).userFavoritesDB = userFavoritesDB
;(globalThis as any).userPriceAlertsDB = userPriceAlertsDB

// Store actual product data for favorites
const favoriteProductsDB: { [productId: string]: any } = {}

export default function Home() {
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [userFavorites, setUserFavorites] = useState<string[]>([]) // Track user's favorite IDs
  const [userPriceAlerts, setUserPriceAlerts] = useState<any[]>([]) // Track user's price alerts
  const [showFavoritesPage, setShowFavoritesPage] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearching && !hasSearched) {
        setIsSearching(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSearching, hasSearched])

  // Load user favorites and price alerts when user logs in
  useEffect(() => {
    if (user) {
      const favorites = userFavoritesDB[user.email] || []
      const alerts = userPriceAlertsDB[user.email] || []

      // Extract just the IDs from the favorite products
      const favoriteIds = favorites.map((fav) => (typeof fav === "string" ? fav : fav.id))
      setUserFavorites(favoriteIds)
      setUserPriceAlerts(alerts)

      console.log("Loaded user favorites:", favoriteIds)
      console.log("Loaded user price alerts:", alerts)
    } else {
      setUserFavorites([])
      setUserPriceAlerts([])
    }
  }, [user])

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setIsLoading(true)
    setIsSearching(true)
    setCurrentSearchQuery(query)

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    setHasSearched(true)
  }

  const handleStartSearch = () => {
    setIsSearching(true)
  }

  // Handle category clicks from header
  const handleCategoryClick = (category: string) => {
    console.log(`🏷️ Category clicked: ${category}`)
    handleSearch(category)
  }

  const handleLoginSuccess = (userData: { name: string; email: string }) => {
    setUser(userData)
    setShowAuthModal(false)

    // Initialize user favorites and alerts if they don't exist
    if (!userFavoritesDB[userData.email]) {
      userFavoritesDB[userData.email] = []
    }
    if (!userPriceAlertsDB[userData.email]) {
      userPriceAlertsDB[userData.email] = []
    }

    const favorites = userFavoritesDB[userData.email] || []
    const alerts = userPriceAlertsDB[userData.email] || []
    const favoriteIds = favorites.map((fav) => (typeof fav === "string" ? fav : fav.id))

    setUserFavorites(favoriteIds)
    setUserPriceAlerts(alerts)

    console.log("User logged in from main page:", userData)
    console.log("User favorites loaded:", favoriteIds)
    console.log("User price alerts loaded:", alerts)
  }

  const handleLogout = () => {
    setUser(null)
    setUserFavorites([]) // Clear favorites on logout
    setUserPriceAlerts([]) // Clear price alerts on logout
    setShowFavoritesPage(false)
    console.log("User logged out from main page")
  }

  const handleFavoritesClick = () => {
    if (user) {
      setShowFavoritesPage(true)
    } else {
      setShowAuthModal(true)
    }
  }

  const handleSearchOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsSearching(false)
      setSearchQuery("")
    }
  }

  const handleAboutClick = () => {
    const aboutSection = document.getElementById("about-section")
    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
  }

  const handleBackToHome = () => {
    setIsSearching(false)
    setHasSearched(false)
    setSearchQuery("")
    setCurrentSearchQuery("")
    setShowFavoritesPage(false)
    setSelectedProduct(null)
    setShowProfilePage(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNewSearch = (newQuery: string) => {
    setSearchQuery(newQuery)
    setCurrentSearchQuery(newQuery)
    // Clear selected product to show search results
    setSelectedProduct(null)
    handleSearch(newQuery)
  }

  // Enhanced favorite toggle function
  const handleFavoriteToggle = (productId: string, productData?: any) => {
    if (!user) {
      console.log("No user logged in, cannot toggle favorite")
      return
    }

    console.log("Toggling favorite for product:", productId)
    console.log("Current user favorites:", userFavorites)

    const isCurrentlyFavorite = userFavorites.includes(productId)
    let newFavorites: string[]

    if (isCurrentlyFavorite) {
      // Remove from favorites
      newFavorites = userFavorites.filter((id) => id !== productId)
      // Remove from product database
      delete favoriteProductsDB[productId]
      console.log("Removed from favorites:", productId)
    } else {
      // Add to favorites
      newFavorites = [...userFavorites, productId]
      // Store the product data
      if (productData) {
        favoriteProductsDB[productId] = productData
        console.log("Added to favorites with data:", productId, productData)
      }
    }

    // Update state immediately for UI responsiveness
    setUserFavorites(newFavorites)

    // Update the database - store full product objects for easy retrieval
    const favoriteProducts = newFavorites.map((id) => {
      const storedProduct = favoriteProductsDB[id]
      return storedProduct || { id } // Fallback to just ID if no data
    })

    userFavoritesDB[user.email] = favoriteProducts

    console.log("Updated user favorites:", newFavorites)
    console.log("Updated favorites database:", userFavoritesDB[user.email])
  }

  // Price alert toggle function
  const handlePriceAlertToggle = (productId: string, productData?: any, alertData?: any) => {
    if (!user) {
      console.log("No user logged in, cannot toggle price alert")
      return
    }

    console.log("Toggling price alert for product:", productId)

    const existingAlertIndex = userPriceAlerts.findIndex((alert) => alert.productId === productId)
    let newAlerts: any[]

    if (existingAlertIndex !== -1) {
      // Remove existing alert
      newAlerts = userPriceAlerts.filter((alert) => alert.productId !== productId)
      console.log("Removed price alert for:", productId)
    } else {
      // Add new alert
      const newAlert = {
        id: `alert_${Date.now()}`,
        productId: productId,
        productName: productData?.name || "Unknown Product",
        productImage: productData?.image || "/placeholder.svg",
        currentPrice: productData?.currentPrice || 0,
        targetPrice: productData?.currentPrice || 0, // Default to current price
        alertType: "below", // Default to price drop alert
        dateCreated: new Date().toISOString(),
        isActive: true,
        ...alertData, // Override with any specific alert data
      }
      newAlerts = [...userPriceAlerts, newAlert]
      console.log("Added price alert:", newAlert)
    }

    // Update state and database
    setUserPriceAlerts(newAlerts)
    userPriceAlertsDB[user.email] = newAlerts

    console.log("Updated user price alerts:", newAlerts)
  }

  // Function to get favorite products with full data
  const getFavoriteProducts = () => {
    if (!user) return []

    const favorites = userFavoritesDB[user.email] || []
    return favorites.filter((fav) => fav && typeof fav === "object" && fav.id)
  }

  // Show favorites page
  if (showFavoritesPage) {
    return (
      <FavoritesPage
        user={user}
        userFavorites={userFavorites}
        favoriteProducts={getFavoriteProducts()} // Pass actual product data
        onClose={() => setShowFavoritesPage(false)}
        onProductSelect={handleProductSelect}
        onNewSearch={handleNewSearch}
        onFavoriteToggle={handleFavoriteToggle}
      />
    )
  }

  // Show profile page
  if (showProfilePage) {
    return (
      <ProfilePage
        user={user!}
        userFavorites={userFavorites}
        userPriceAlerts={userPriceAlerts}
        favoriteProducts={getFavoriteProducts()}
        onBack={() => setShowProfilePage(false)}
        onProductSelect={(product) => {
          setSelectedProduct(product)
          setShowProfilePage(false)
        }}
        onFavoriteToggle={handleFavoriteToggle}
        onBackToHome={handleBackToHome}
      />
    )
  }

  // Show search results page using NEW Turkish Stores API
  if (hasSearched && !isLoading && !selectedProduct) {
    return (
      <SearchResultsPage
        query={currentSearchQuery}
        user={user}
        userFavorites={userFavorites}
        onProductSelect={handleProductSelect}
        onBackToHome={handleBackToHome}
        onLoginRequired={() => setShowAuthModal(true)}
        onFavoritesClick={handleFavoritesClick}
        onLogout={handleLogout}
        onAboutClick={handleAboutClick}
        onNewSearch={handleNewSearch}
        onProfileClick={() => setShowProfilePage(true)}
        onLoginSuccess={handleLoginSuccess}
        onFavoriteToggle={handleFavoriteToggle}
      />
    )
  }

  // Show product page
  if (selectedProduct) {
    return (
      <ProductPage
        product={selectedProduct}
        user={user}
        onBack={() => setSelectedProduct(null)}
        onLoginRequired={() => setShowAuthModal(true)}
        onFavoriteToggle={handleFavoriteToggle}
        onPriceAlertToggle={handlePriceAlertToggle}
        onNewSearch={handleNewSearch}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        onFavoritesClick={handleFavoritesClick}
        onProfileClick={() => setShowProfilePage(true)}
      />
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Tech Background with Full Responsive Scaling */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/space-tech-background.jpg)",
          backgroundAttachment: "fixed", // Creates parallax effect on desktop
        }}
      />

      {/* Responsive Background Positioning for Different Screen Sizes */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute.inset-0 {
            background-attachment: scroll !important;
            background-position: center center !important;
            background-size: cover !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1440px) {
          .absolute.inset-0 {
            background-position: center center !important;
            background-size: cover !important;
          }
        }
        
        @media (min-width: 1441px) {
          .absolute.inset-0 {
            background-position: center center !important;
            background-size: cover !important;
          }
        }
        
        @media (min-width: 2560px) {
          .absolute.inset-0 {
            background-size: 100% auto !important;
            background-position: center top !important;
          }
        }

        /* Electric Search Box Styles */
        .electric-search-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 0 40px rgba(147, 51, 234, 0.3),
            0 0 80px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: electricGlow 3s ease-in-out infinite alternate;
        }

        .electric-search-input {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 2px solid transparent;
          box-shadow: 
            0 0 20px rgba(147, 51, 234, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .electric-search-input:focus {
          background: rgba(255, 255, 255, 0.98);
          border-color: rgba(147, 51, 234, 0.5);
          box-shadow: 
            0 0 30px rgba(147, 51, 234, 0.4),
            0 0 60px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        .electric-search-button {
          background: linear-gradient(135deg, #9333ea 0%, #3b82f6 100%);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 
            0 0 25px rgba(147, 51, 234, 0.5),
            0 0 50px rgba(59, 130, 246, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .electric-search-button:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 0 35px rgba(147, 51, 234, 0.7),
            0 0 70px rgba(59, 130, 246, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        @keyframes electricGlow {
          0% {
            box-shadow: 
              0 0 40px rgba(147, 51, 234, 0.3),
              0 0 80px rgba(59, 130, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow: 
              0 0 60px rgba(147, 51, 234, 0.5),
              0 0 120px rgba(59, 130, 246, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.4);
          }
        }

        /* Loading animation enhancement */
        .electric-loading {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px);
          border: 2px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 0 50px rgba(147, 51, 234, 0.4),
            0 0 100px rgba(59, 130, 246, 0.3);
        }

        /* Floating animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-right {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(10px); }
        }

        @keyframes float-left {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }

        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-right {
          animation: float-right 8s ease-in-out infinite;
        }

        .animate-float-left {
          animation: float-left 7s ease-in-out infinite;
        }

        .animate-flash {
          animation: flash 1.5s ease-in-out infinite;
        }

        .floating-rectangle-purple-dark {
          background: rgba(147, 51, 234, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(147, 51, 234, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(147, 51, 234, 0.2);
        }

        .floating-rectangle-blue-dark {
          background: rgba(59, 130, 246, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 0 20px rgba(59, 130, 246, 0.2);
        }

        /* Category hover effects */
        .category-item {
          transition: all 0.3s ease;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 8px;
          position: relative;
        }

        .category-item:hover {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
        }

        .category-item:active {
          transform: translateY(0px);
        }
      `}</style>

      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content Container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-50">
          <div className="flex items-center space-x-8">
            <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={handleBackToHome}>
              <img
                src="/pricefy-logo.png"
                alt="Pricefy"
                className="h-10 w-auto hover:scale-105 transition-transform duration-200 drop-shadow-lg"
              />
            </Button>
            <div className="hidden md:flex space-x-6 text-white/90 font-medium">
              <span
                className="category-item hover:text-white transition-colors"
                onClick={() => handleCategoryClick("electronics")}
              >
                Electronics
              </span>
              <span
                className="category-item hover:text-white transition-colors"
                onClick={() => handleCategoryClick("fashion")}
              >
                Fashion
              </span>
              <span
                className="category-item hover:text-white transition-colors"
                onClick={() => handleCategoryClick("sports")}
              >
                Sports
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoritesClick}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
              {user && userFavorites.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                  {userFavorites.length}
                </span>
              )}
            </Button>
            {user ? (
              <ProfileDropdown
                user={user}
                onProfileClick={() => setShowProfilePage(true)}
                onLogout={handleLogout}
                isDarkTheme={true}
              />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="text-white/90 hover:text-white hover:bg-white/10"
              >
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAboutClick}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              <Info className="w-4 h-4 mr-2" />
              About
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div
          className={`transition-all duration-1000 ease-in-out ${
            isSearching ? "transform -translate-y-20 scale-90 opacity-60" : ""
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 relative">
                {/* First Floating Rectangle - "We do the comparing" */}
                <div className="flex justify-end pr-8">
                  <div className="animate-float-right floating-rectangle-purple-dark rounded-3xl px-8 py-6 shadow-2xl">
                    <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                      We do the{" "}
                      <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        comparing
                      </span>
                      .
                    </h1>
                  </div>
                </div>

                {/* Second Floating Rectangle - "You do the saving" */}
                <div className="flex justify-start pl-8">
                  <div className="animate-float-left floating-rectangle-blue-dark rounded-3xl px-8 py-6 shadow-2xl">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                      You do the{" "}
                      <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        saving
                      </span>
                      .
                    </h2>
                  </div>
                </div>

                {/* Description and CTA */}
                <div className="text-center mt-12">
                  <p className="text-xl text-white/80 max-w-lg mx-auto leading-relaxed mb-8 drop-shadow-lg">
                    Easily find the best prices for your favorite products across Turkey's leading e-commerce stores.
                  </p>
                  <Button
                    onClick={handleStartSearch}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                  >
                    Start Searching
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                {/* Floating Logo Animation */}
                <div className="relative">
                  <div className="animate-float">
                    <img
                      src="/pricefy-logo.png"
                      alt="Pricefy Logo"
                      className="w-[500px] lg:w-[600px] h-auto drop-shadow-2xl"
                    />
                  </div>
                  {/* Floating particles around logo */}
                  <div className="absolute -top-4 -left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute -top-8 right-12 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-60"></div>
                  <div className="absolute -bottom-6 -right-2 w-4 h-4 bg-indigo-400 rounded-full animate-pulse opacity-70"></div>
                  <div
                    className="absolute bottom-4 -left-8 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-80"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 -right-6 w-3 h-3 bg-blue-300 rounded-full animate-ping opacity-50"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <AboutSection id="about-section" />

        {/* Enhanced Electric Search Section */}
        <div
          className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out cursor-pointer z-40 ${
            isSearching ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={handleSearchOverlayClick}
        >
          <div className="max-w-4xl w-full mx-auto px-6">
            <div className="text-center mb-8">
              {isLoading && (
                <div className="mb-8">
                  <div className="w-40 h-auto mx-auto mb-6 animate-flash">
                    <img src="/pricefy-logo.png" alt="Pricefy" className="w-full h-auto drop-shadow-2xl" />
                  </div>
                  <div className="electric-loading rounded-2xl p-6 mx-auto max-w-md">
                    <p className="text-white text-lg drop-shadow-lg font-medium">
                      Searching across all Turkish stores...
                    </p>
                    <div className="flex justify-center space-x-2 mt-4">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce shadow-lg"></div>
                      <div
                        className="w-3 h-3 bg-blue-500 rounded-full animate-bounce shadow-lg"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce shadow-lg"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Electric Glass Morphism Search Container */}
            <div className="electric-search-container p-8 rounded-3xl cursor-default relative">
              <div className="flex space-x-4 relative">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    placeholder="Search for products (e.g., iPhone 14, Nike shoes, Samsung TV...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="electric-search-input text-lg py-6 px-6 rounded-full border-0 text-gray-800 placeholder-gray-500 font-medium"
                    disabled={isLoading}
                    autoFocus={isSearching}
                  />

                  {/* Search Suggestions */}
                  <SearchSuggestions
                    searchQuery={searchQuery}
                    onSuggestionSelect={(suggestion) => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                    onSearch={(query) => {
                      handleSearch(query)
                      setShowSuggestions(false)
                    }}
                    isVisible={showSuggestions && isSearching}
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={() => handleSearch(searchQuery)}
                  disabled={isLoading}
                  size="lg"
                  className="electric-search-button text-white px-8 rounded-full border-0 font-semibold"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>

              {/* Electric particles around search box */}
              <div className="absolute -top-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute -top-3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-80"></div>
              <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-60"></div>
              <div className="absolute bottom-1/2 -left-3 w-1 h-1 bg-purple-300 rounded-full animate-bounce opacity-70"></div>
              <div className="absolute top-1/4 -right-3 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-80"></div>
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}
