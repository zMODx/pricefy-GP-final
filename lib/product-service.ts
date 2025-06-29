// Enhanced Product Service with Real-Time Amazon Data API
import { amazonAPI, type AmazonProduct } from "./amazon-api"

export interface Product {
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
  availability: string
  features: string[]
  asin?: string // Amazon-specific identifier
}

export interface SearchFilters {
  minPrice?: number
  maxPrice?: number
  category?: string
  sortBy?: "relevance" | "price_low_to_high" | "price_high_to_low" | "newest" | "avg_customer_review"
  page?: number
}

export interface SearchResponse {
  products: Product[]
  totalResults: number
  searchTerm: string
  hasMore: boolean
}

class ProductService {
  // Convert Amazon product to our unified Product interface
  private transformAmazonProduct(amazonProduct: AmazonProduct, userFavorites: string[] = []): Product {
    return {
      id: amazonProduct.asin,
      name: amazonProduct.title,
      image: amazonProduct.images.primary,
      currentPrice: amazonProduct.price.current,
      originalPrice: amazonProduct.price.original,
      store: "Amazon",
      rating: amazonProduct.rating.value,
      reviews: amazonProduct.rating.count,
      isFavorite: userFavorites.includes(amazonProduct.asin),
      storeUrl: amazonProduct.url,
      category: amazonProduct.category,
      tags: this.generateTags(amazonProduct.title, amazonProduct.category, amazonProduct.brand),
      brand: amazonProduct.brand || "Unknown",
      priceHistory: [], // Will be loaded separately
      availability: amazonProduct.availability,
      features: amazonProduct.features,
      asin: amazonProduct.asin,
    }
  }

  // Generate search tags from product information
  private generateTags(title: string, category: string, brand?: string): string[] {
    const tags = new Set<string>()

    // Add words from title (filter out common words)
    const commonWords = new Set([
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "a",
      "an",
    ])
    const titleWords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word))

    titleWords.slice(0, 10).forEach((word) => tags.add(word)) // Limit to first 10 meaningful words

    // Add category
    if (category) {
      tags.add(category.toLowerCase())
    }

    // Add brand
    if (brand) {
      tags.add(brand.toLowerCase())
    }

    return Array.from(tags)
  }

  // Search products using mock Amazon data
  async searchProducts(
    query: string,
    filters: SearchFilters = {},
    userFavorites: string[] = [],
  ): Promise<SearchResponse> {
    console.log("Searching products with query:", query, "filters:", filters)

    // Use mock Amazon data
    const amazonResponse = await amazonAPI.searchProducts(query, {
      page: filters.page,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      category: filters.category,
      sortBy: filters.sortBy,
    })

    console.log("Mock Amazon response:", amazonResponse)

    // Transform products to our format
    const products = amazonResponse.products.map((product) => this.transformAmazonProduct(product, userFavorites))

    // Apply client-side filtering
    let filteredProducts = products

    if (filters.minPrice || filters.maxPrice) {
      filteredProducts = products.filter((product) => {
        const price = product.currentPrice
        const minOk = !filters.minPrice || price >= filters.minPrice
        const maxOk = !filters.maxPrice || price <= filters.maxPrice
        return minOk && maxOk
      })
    }

    const totalResults = amazonResponse.totalResults
    const currentPage = filters.page || 1
    const productsPerPage = 20

    return {
      products: filteredProducts,
      totalResults,
      searchTerm: query,
      hasMore: currentPage * productsPerPage < totalResults,
    }
  }

  // Get detailed product information
  async getProductDetails(productId: string, userFavorites: string[] = []): Promise<Product | null> {
    try {
      console.log("Getting product details for:", productId)

      const amazonProduct = await amazonAPI.getProductDetails(productId)
      if (!amazonProduct) {
        console.log("No product found for ID:", productId)
        return null
      }

      const product = this.transformAmazonProduct(amazonProduct, userFavorites)

      // Load price history
      console.log("Loading price history for:", productId)
      product.priceHistory = await amazonAPI.getPriceHistory(productId)

      return product
    } catch (error) {
      console.error("Product details error:", error)
      return null
    }
  }

  // Get price history for a product
  async getPriceHistory(productId: string): Promise<{ date: string; price: number }[]> {
    try {
      return await amazonAPI.getPriceHistory(productId)
    } catch (error) {
      console.error("Price history error:", error)
      return []
    }
  }

  // Get deals and special offers
  async getDeals(category?: string): Promise<Product[]> {
    try {
      const deals = await amazonAPI.getDeals(category)
      return deals.map((deal) => this.transformAmazonProduct(deal))
    } catch (error) {
      console.error("Deals error:", error)
      return []
    }
  }

  // Get similar products for comparison
  async getSimilarProducts(productId: string, category?: string, userFavorites: string[] = []): Promise<Product[]> {
    try {
      console.log("Getting similar products for:", productId, "category:", category)

      // Generate a search query based on the current product
      const searchQuery = category || "electronics"

      // Search for products in the same category
      const searchResponse = await this.searchProducts(
        searchQuery,
        {
          category: category,
          sortBy: "avg_customer_review",
          page: 1,
        },
        userFavorites,
      )

      // Filter out the current product and return up to 6 similar products
      const similarProducts = searchResponse.products.filter((product) => product.id !== productId).slice(0, 6)

      console.log("Found similar products:", similarProducts.length)
      return similarProducts
    } catch (error) {
      console.error("Similar products error:", error)
      return []
    }
  }

  // Get product suggestions based on search query
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return []

    // Enhanced suggestions based on popular Amazon categories and products
    const suggestions = [
      // Electronics
      "laptop",
      "smartphone",
      "headphones",
      "tablet",
      "smartwatch",
      "camera",
      "speaker",
      "keyboard",
      "mouse",
      "monitor",
      // Home & Kitchen
      "coffee maker",
      "air fryer",
      "vacuum cleaner",
      "blender",
      "microwave",
      "cookware",
      "bedding",
      "furniture",
      // Fashion
      "shoes",
      "clothing",
      "jewelry",
      "handbags",
      "sunglasses",
      "watches",
      // Books & Media
      "books",
      "kindle",
      "audiobooks",
      "movies",
      "music",
      // Health & Beauty
      "skincare",
      "makeup",
      "vitamins",
      "fitness equipment",
      "yoga mat",
      // Sports & Outdoors
      "camping gear",
      "hiking boots",
      "bicycle",
      "sports equipment",
      "outdoor furniture",
      // Toys & Games
      "board games",
      "video games",
      "toys",
      "puzzles",
      "educational toys",
    ]

    const filtered = suggestions
      .filter((suggestion) => suggestion.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8)

    // If no matches, return popular searches that start with the query
    if (filtered.length === 0) {
      return suggestions.filter((suggestion) => suggestion.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
    }

    return filtered
  }

  // Validate if a product ID is a valid ASIN format
  isValidASIN(asin: string): boolean {
    // Amazon ASIN format: 10 characters, starts with B followed by 9 alphanumeric characters
    const asinRegex = /^B[0-9A-Z]{9}$/
    return asinRegex.test(asin)
  }

  // Extract ASIN from Amazon URL
  extractASINFromURL(url: string): string | null {
    const asinMatch = url.match(/\/dp\/([B0-9A-Z]{10})/)
    return asinMatch ? asinMatch[1] : null
  }
}

// Export singleton instance
export const productService = new ProductService()

// Export types
export type { SearchFilters, SearchResponse }
