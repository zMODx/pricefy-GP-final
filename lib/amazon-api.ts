// Mock Amazon Data Service - Demo Version
// All data is simulated for demonstration purposes

interface AmazonProduct {
  asin: string
  title: string
  price: {
    current: number
    original?: number
    currency: string
  }
  images: {
    primary: string
    additional: string[]
  }
  rating: {
    value: number
    count: number
  }
  availability: string
  brand?: string
  category: string
  features: string[]
  url: string
}

interface AmazonSearchResponse {
  products: AmazonProduct[]
  totalResults: number
  searchTerm: string
}

class AmazonAPIService {
  private mockProducts: AmazonProduct[] = [
    // Electronics - Headphones & Audio
    {
      asin: "B0DZ75TN5F",
      title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
      price: { current: 299.99, original: 399.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.5, count: 12847 },
      availability: "In Stock",
      brand: "Sony",
      category: "Electronics",
      features: ["Active Noise Cancellation", "30-hour Battery", "Quick Charge", "Multipoint Connection"],
      url: "https://amazon.com/dp/B0DZ75TN5F",
    },
    {
      asin: "B08N5WRWNW",
      title: "Apple AirPods Pro (2nd Generation) with MagSafe Case",
      price: { current: 199.99, original: 249.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.7, count: 8934 },
      availability: "In Stock",
      brand: "Apple",
      category: "Electronics",
      features: ["Active Noise Cancellation", "Transparency Mode", "Spatial Audio", "MagSafe Charging"],
      url: "https://amazon.com/dp/B08N5WRWNW",
    },
    {
      asin: "B07XJ8C8F5",
      title: "Bose QuietComfort 45 Bluetooth Wireless Noise Cancelling Headphones",
      price: { current: 279.99, original: 329.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.4, count: 5672 },
      availability: "In Stock",
      brand: "Bose",
      category: "Electronics",
      features: ["World-class Noise Cancellation", "22-hour Battery", "TriPort Technology", "Adjustable EQ"],
      url: "https://amazon.com/dp/B07XJ8C8F5",
    },

    // Electronics - Smartphones & Accessories
    {
      asin: "B09JQMJSXY",
      title: "Samsung Galaxy S24 Ultra 5G Android Smartphone",
      price: { current: 1199.99, original: 1299.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.6, count: 3421 },
      availability: "In Stock",
      brand: "Samsung",
      category: "Electronics",
      features: ["200MP Camera", "S Pen Included", "5000mAh Battery", "AI-Enhanced Photography"],
      url: "https://amazon.com/dp/B09JQMJSXY",
    },
    {
      asin: "B08HJKL123",
      title: "iPhone 15 Pro Max 256GB Natural Titanium",
      price: { current: 1199.99, original: 1199.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.8, count: 2156 },
      availability: "In Stock",
      brand: "Apple",
      category: "Electronics",
      features: ["A17 Pro Chip", "Pro Camera System", "Action Button", "USB-C Connector"],
      url: "https://amazon.com/dp/B08HJKL123",
    },
    {
      asin: "B07MNBVXYZ",
      title: "Anker PowerCore 10000 Portable Charger Power Bank",
      price: { current: 24.99, original: 34.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.5, count: 15678 },
      availability: "In Stock",
      brand: "Anker",
      category: "Electronics",
      features: ["10000mAh Capacity", "Fast Charging", "Compact Design", "MultiProtect Safety"],
      url: "https://amazon.com/dp/B07MNBVXYZ",
    },

    // Electronics - Laptops & Computers
    {
      asin: "B0C7BW4MNX",
      title: "MacBook Air 15-inch M3 Chip 8GB RAM 256GB SSD",
      price: { current: 1299.99, original: 1399.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.7, count: 892 },
      availability: "In Stock",
      brand: "Apple",
      category: "Computers",
      features: ["M3 Chip", "15.3-inch Display", "18-hour Battery", "1080p FaceTime Camera"],
      url: "https://amazon.com/dp/B0C7BW4MNX",
    },
    {
      asin: "B0BDK62PDX",
      title: "ASUS ROG Strix G16 Gaming Laptop Intel Core i7-13650HX",
      price: { current: 1199.99, original: 1499.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.4, count: 1234 },
      availability: "In Stock",
      brand: "ASUS",
      category: "Computers",
      features: ["Intel i7-13650HX", "RTX 4060", "16GB DDR5", "1TB SSD"],
      url: "https://amazon.com/dp/B0BDK62PDX",
    },
    {
      asin: "B0C1JKVTNH",
      title: "Logitech MX Master 3S Wireless Mouse",
      price: { current: 79.99, original: 99.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.6, count: 8765 },
      availability: "In Stock",
      brand: "Logitech",
      category: "Computers",
      features: ["8K DPI Sensor", "Quiet Clicks", "70-day Battery", "Multi-device Connection"],
      url: "https://amazon.com/dp/B0C1JKVTNH",
    },

    // Home & Kitchen
    {
      asin: "B0B1YT5PKL",
      title: "Ninja Foodi Personal Blender with 18oz BPA-Free Cup",
      price: { current: 49.99, original: 79.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.3, count: 4567 },
      availability: "In Stock",
      brand: "Ninja",
      category: "Home & Kitchen",
      features: ["700-Watt Motor", "BPA-Free Cup", "Easy Clean", "Compact Design"],
      url: "https://amazon.com/dp/B0B1YT5PKL",
    },
    {
      asin: "B08L5M9BTR",
      title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker 6 Quart",
      price: { current: 79.99, original: 119.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.6, count: 23456 },
      availability: "In Stock",
      brand: "Instant Pot",
      category: "Home & Kitchen",
      features: ["7-in-1 Functionality", "6 Quart Capacity", "Safe Locking System", "Easy Clean"],
      url: "https://amazon.com/dp/B08L5M9BTR",
    },
    {
      asin: "B0BSFQTDCR",
      title: "Keurig K-Mini Coffee Maker Single Serve K-Cup Pod",
      price: { current: 59.99, original: 79.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.2, count: 12890 },
      availability: "In Stock",
      brand: "Keurig",
      category: "Home & Kitchen",
      features: ["Single Serve", "Compact Design", "6-12oz Brew Sizes", "Cord Storage"],
      url: "https://amazon.com/dp/B0BSFQTDCR",
    },

    // Sports & Outdoors
    {
      asin: "B0C8N4T2MX",
      title: "Fitbit Charge 6 Fitness Tracker with Heart Rate Monitor",
      price: { current: 149.99, original: 199.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.4, count: 3456 },
      availability: "In Stock",
      brand: "Fitbit",
      category: "Sports & Outdoors",
      features: ["Built-in GPS", "Heart Rate Monitor", "7-day Battery", "Water Resistant"],
      url: "https://amazon.com/dp/B0C8N4T2MX",
    },
    {
      asin: "B0B7TXJ1VQ",
      title: "YETI Rambler 20 oz Tumbler Stainless Steel Vacuum Insulated",
      price: { current: 34.99, original: 39.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.8, count: 8901 },
      availability: "In Stock",
      brand: "YETI",
      category: "Sports & Outdoors",
      features: ["Double-Wall Insulation", "Dishwasher Safe", "No Sweat Design", "MagSlider Lid"],
      url: "https://amazon.com/dp/B0B7TXJ1VQ",
    },

    // Books
    {
      asin: "B0C4F7H8K2",
      title: "Atomic Habits: An Easy & Proven Way to Build Good Habits",
      price: { current: 13.99, original: 18.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.8, count: 45678 },
      availability: "In Stock",
      brand: "Clear",
      category: "Books",
      features: ["Bestselling Self-Help", "Practical Strategies", "Science-Based", "Life-Changing"],
      url: "https://amazon.com/dp/B0C4F7H8K2",
    },

    // Clothing & Fashion
    {
      asin: "B0BQXR4T8N",
      title: "Levi's Men's 511 Slim Fit Jeans",
      price: { current: 49.99, original: 69.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.3, count: 12345 },
      availability: "In Stock",
      brand: "Levi's",
      category: "Clothing",
      features: ["Slim Fit", "Stretch Denim", "Classic 5-Pocket", "Machine Washable"],
      url: "https://amazon.com/dp/B0BQXR4T8N",
    },

    // Tools & Home Improvement
    {
      asin: "B0C2H5K9L3",
      title: "DEWALT 20V MAX Cordless Drill Driver Kit",
      price: { current: 99.99, original: 129.99, currency: "USD" },
      images: { primary: "/placeholder.svg?height=300&width=300", additional: [] },
      rating: { value: 4.7, count: 5432 },
      availability: "In Stock",
      brand: "DEWALT",
      category: "Tools & Home Improvement",
      features: ["20V MAX Battery", "High Performance Motor", "LED Light", "Belt Hook"],
      url: "https://amazon.com/dp/B0C2H5K9L3",
    },
  ]

  // Get search suggestions - Mock implementation
  async getSearchSuggestions(searchTerm: string): Promise<string[]> {
    if (!searchTerm || searchTerm.length < 2) {
      return []
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return this.getRealisticSuggestions(searchTerm)
  }

  // Get detailed product information - Mock implementation
  async getProductDetails(asin: string): Promise<AmazonProduct | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const product = this.mockProducts.find((p) => p.asin === asin)
    return product || null
  }

  // Search for products - Mock implementation with realistic matching
  async searchProducts(
    query: string,
    options: {
      page?: number
      minPrice?: number
      maxPrice?: number
      category?: string
      sortBy?: "relevance" | "price_low_to_high" | "price_high_to_low" | "newest" | "avg_customer_review"
    } = {},
  ): Promise<AmazonSearchResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return this.performRealisticSearch(query, options)
  }

  // Get price history - Mock implementation
  async getPriceHistory(asin: string, days = 30): Promise<{ date: string; price: number }[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    const product = this.mockProducts.find((p) => p.asin === asin)
    const basePrice = product?.price.current || 100
    return this.generateRealisticPriceHistory(basePrice, days)
  }

  // Realistic search suggestions based on product catalog
  private getRealisticSuggestions(searchTerm: string): string[] {
    const term = searchTerm.toLowerCase()
    const suggestions = new Set<string>()

    // Extract keywords from product titles and add matching ones
    this.mockProducts.forEach((product) => {
      const words = product.title.toLowerCase().split(/\s+/)
      const brand = product.brand?.toLowerCase()

      // Add brand if it matches
      if (brand && brand.includes(term)) {
        suggestions.add(product.brand!)
      }

      // Add relevant words from titles
      words.forEach((word) => {
        if (word.length > 2 && word.includes(term)) {
          suggestions.add(word)
        }
      })

      // Add category if it matches
      if (product.category.toLowerCase().includes(term)) {
        suggestions.add(product.category)
      }
    })

    // Add some common search terms
    const commonTerms = [
      "wireless",
      "bluetooth",
      "gaming",
      "laptop",
      "phone",
      "headphones",
      "charger",
      "case",
      "stand",
      "holder",
      "cable",
      "adapter",
      "speaker",
      "mouse",
      "keyboard",
      "monitor",
      "tablet",
      "watch",
      "fitness",
      "camera",
    ]

    commonTerms.forEach((commonTerm) => {
      if (commonTerm.includes(term) || term.includes(commonTerm)) {
        suggestions.add(commonTerm)
      }
    })

    return Array.from(suggestions).slice(0, 8)
  }

  // Realistic search implementation
  private performRealisticSearch(
    query: string,
    options: {
      page?: number
      minPrice?: number
      maxPrice?: number
      category?: string
      sortBy?: "relevance" | "price_low_to_high" | "price_high_to_low" | "newest" | "avg_customer_review"
    } = {},
  ): AmazonSearchResponse {
    const searchTerms = query.toLowerCase().split(/\s+/)

    // Filter products based on search relevance
    let filteredProducts = this.mockProducts.filter((product) => {
      const searchableText =
        `${product.title} ${product.brand} ${product.category} ${product.features.join(" ")}`.toLowerCase()

      // Check if any search term matches
      return searchTerms.some(
        (term) =>
          searchableText.includes(term) ||
          (term.length > 2 && searchableText.includes(term.substring(0, term.length - 1))),
      )
    })

    // Apply category filter
    if (options.category && options.category !== "All Categories") {
      filteredProducts = filteredProducts.filter((product) =>
        product.category.toLowerCase().includes(options.category!.toLowerCase()),
      )
    }

    // Apply price filters
    if (options.minPrice || options.maxPrice) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.price.current
        const minOk = !options.minPrice || price >= options.minPrice
        const maxOk = !options.maxPrice || price <= options.maxPrice
        return minOk && maxOk
      })
    }

    // Sort products
    if (options.sortBy) {
      filteredProducts.sort((a, b) => {
        switch (options.sortBy) {
          case "price_low_to_high":
            return a.price.current - b.price.current
          case "price_high_to_low":
            return b.price.current - a.price.current
          case "avg_customer_review":
            return b.rating.value - a.rating.value
          default:
            // For relevance, we could implement a more sophisticated scoring
            return 0
        }
      })
    }

    // Pagination
    const page = options.page || 1
    const pageSize = 12
    const startIndex = (page - 1) * pageSize
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize)

    return {
      products: paginatedProducts,
      totalResults: filteredProducts.length,
      searchTerm: query,
    }
  }

  private generateRealisticPriceHistory(basePrice: number, days: number): { date: string; price: number }[] {
    const history = []
    let currentPrice = basePrice

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Add realistic price fluctuations
      const change = (Math.random() - 0.5) * (basePrice * 0.1) // ±10% variation
      currentPrice = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, currentPrice + change))

      history.push({
        date: date.toISOString().split("T")[0],
        price: Math.round(currentPrice * 100) / 100,
      })
    }

    return history
  }
}

// Export singleton instance
export const amazonAPI = new AmazonAPIService()

// Export types
export type { AmazonProduct, AmazonSearchResponse }
