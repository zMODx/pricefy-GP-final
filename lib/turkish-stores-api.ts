// Mock APIs for Turkish E-commerce Stores

export interface TurkishProduct {
  id: string
  name: string
  image: string
  currentPrice: number
  originalPrice?: number
  store: string
  rating: number
  reviews: number
  storeUrl: string
  category: string
  brand: string
  description: string
  availability: string
  features: string[]
}

// Trendyol Mock API
class TrendyolAPI {
  private generateTrendyolProducts(query: string, limit = 20): TurkishProduct[] {
    const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Books", "Automotive"]
    const brands = ["Samsung", "Apple", "Nike", "Adidas", "Zara", "H&M", "Philips", "Bosch", "LG"]

    const products: TurkishProduct[] = []

    for (let i = 1; i <= limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const brand = brands[Math.floor(Math.random() * brands.length)]
      const basePrice = Math.floor(Math.random() * 5000) + 100
      const discount = Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 10 : 0
      const currentPrice = Math.floor(basePrice * (1 - discount / 100))

      products.push({
        id: `trendyol-${i}-${query}`,
        name: `${brand} ${query} ${category} Product ${i}`,
        image: `https://picsum.photos/300/300?random=${i + 100}`,
        currentPrice: currentPrice,
        originalPrice: discount > 0 ? basePrice : undefined,
        store: "Trendyol",
        rating: Math.round((4 + Math.random()) * 10) / 10,
        reviews: Math.floor(Math.random() * 1500) + 50,
        storeUrl: `https://www.trendyol.com/product-${i}`,
        category,
        brand,
        description: `High quality ${query} from ${brand}. Perfect for daily use with excellent features.`,
        availability: "In Stock",
        features: [`${brand} Quality`, "Fast Shipping", "2 Year Warranty", "Free Returns"],
      })
    }

    return products
  }

  async searchProducts(
    query: string,
    options: any = {},
  ): Promise<{ products: TurkishProduct[]; totalResults: number }> {
    console.log("🟠 Trendyol API: Searching for", query)
    const products = this.generateTrendyolProducts(query, options.limit || 20)
    return {
      products,
      totalResults: products.length * 3, // Simulate more results
    }
  }
}

// Hepsiburada Mock API
class HepsiburadaAPI {
  private generateHepsiburadaProducts(query: string, limit = 20): TurkishProduct[] {
    const categories = ["Technology", "Home & Garden", "Fashion", "Sports", "Baby & Kids", "Automotive", "Books"]
    const brands = ["Xiaomi", "Huawei", "Sony", "Canon", "Asus", "HP", "Dell", "Lenovo", "JBL"]

    const products: TurkishProduct[] = []

    for (let i = 1; i <= limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const brand = brands[Math.floor(Math.random() * brands.length)]
      const basePrice = Math.floor(Math.random() * 4500) + 150
      const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 40) + 5 : 0
      const currentPrice = Math.floor(basePrice * (1 - discount / 100))

      products.push({
        id: `hepsiburada-${i}-${query}`,
        name: `${brand} ${query} ${category} Model ${i}`,
        image: `https://picsum.photos/300/300?random=${i + 200}`,
        currentPrice: currentPrice,
        originalPrice: discount > 0 ? basePrice : undefined,
        store: "Hepsiburada",
        rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
        reviews: Math.floor(Math.random() * 2000) + 100,
        storeUrl: `https://www.hepsiburada.com/product-${i}`,
        category,
        brand,
        description: `Premium ${query} by ${brand}. Excellent performance and reliability guaranteed.`,
        availability: "In Stock",
        features: [`${brand} Original`, "Same Day Delivery", "1 Year Warranty", "Easy Return"],
      })
    }

    return products
  }

  async searchProducts(
    query: string,
    options: any = {},
  ): Promise<{ products: TurkishProduct[]; totalResults: number }> {
    console.log("🔵 Hepsiburada API: Searching for", query)
    const products = this.generateHepsiburadaProducts(query, options.limit || 20)
    return {
      products,
      totalResults: products.length * 2.5, // Simulate more results
    }
  }
}

// N11 Mock API
class N11API {
  private generateN11Products(query: string, limit = 20): TurkishProduct[] {
    const categories = ["Electronics", "Clothing", "Home Decor", "Sports", "Health", "Automotive", "Books & Media"]
    const brands = ["Vestel", "Arçelik", "Beko", "Tefal", "Karaca", "English Home", "Koton", "LC Waikiki"]

    const products: TurkishProduct[] = []

    for (let i = 1; i <= limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const brand = brands[Math.floor(Math.random() * brands.length)]
      const basePrice = Math.floor(Math.random() * 3500) + 80
      const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 35) + 5 : 0
      const currentPrice = Math.floor(basePrice * (1 - discount / 100))

      products.push({
        id: `n11-${i}-${query}`,
        name: `${brand} ${query} ${category} Edition ${i}`,
        image: `https://picsum.photos/300/300?random=${i + 300}`,
        currentPrice: currentPrice,
        originalPrice: discount > 0 ? basePrice : undefined,
        store: "N11",
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviews: Math.floor(Math.random() * 1200) + 25,
        storeUrl: `https://www.n11.com/product-${i}`,
        category,
        brand,
        description: `Quality ${query} from ${brand}. Great value for money with reliable performance.`,
        availability: "In Stock",
        features: [`${brand} Quality`, "Fast Delivery", "6 Month Warranty", "Customer Support"],
      })
    }

    return products
  }

  async searchProducts(
    query: string,
    options: any = {},
  ): Promise<{ products: TurkishProduct[]; totalResults: number }> {
    console.log("🟢 N11 API: Searching for", query)
    const products = this.generateN11Products(query, options.limit || 20)
    return {
      products,
      totalResults: products.length * 2, // Simulate more results
    }
  }
}

// Amazon Turkey Mock API (updated)
class AmazonTurkeyAPI {
  private generateAmazonProducts(query: string, limit = 20): TurkishProduct[] {
    const categories = ["Electronics", "Books", "Home & Kitchen", "Fashion", "Sports", "Health", "Automotive"]
    const brands = ["Amazon Basics", "Apple", "Samsung", "Sony", "Microsoft", "Google", "Anker", "Logitech"]

    const products: TurkishProduct[] = []

    for (let i = 1; i <= limit; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)]
      const brand = brands[Math.floor(Math.random() * brands.length)]
      const basePrice = Math.floor(Math.random() * 6000) + 200
      const discount = Math.random() > 0.4 ? Math.floor(Math.random() * 60) + 10 : 0
      const currentPrice = Math.floor(basePrice * (1 - discount / 100))

      products.push({
        id: `amazon-${i}-${query}`,
        name: `${brand} ${query} ${category} Pro ${i}`,
        image: `https://picsum.photos/300/300?random=${i + 400}`,
        currentPrice: currentPrice,
        originalPrice: discount > 0 ? basePrice : undefined,
        store: "Amazon Turkey",
        rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10,
        reviews: Math.floor(Math.random() * 3000) + 200,
        storeUrl: `https://www.amazon.com.tr/product-${i}`,
        category,
        brand,
        description: `Premium ${query} by ${brand}. Amazon's choice with excellent customer reviews.`,
        availability: "In Stock",
        features: [`${brand} Certified`, "Prime Delivery", "2 Year Warranty", "Amazon Returns"],
      })
    }

    return products
  }

  async searchProducts(
    query: string,
    options: any = {},
  ): Promise<{ products: TurkishProduct[]; totalResults: number }> {
    console.log("🟡 Amazon Turkey API: Searching for", query)
    const products = this.generateAmazonProducts(query, options.limit || 20)
    return {
      products,
      totalResults: products.length * 4, // Simulate more results
    }
  }
}

// Combined Turkish Stores Service
class TurkishStoresService {
  private trendyol = new TrendyolAPI()
  private hepsiburada = new HepsiburadaAPI()
  private n11 = new N11API()
  private amazon = new AmazonTurkeyAPI()

  async searchAllStores(
    query: string,
    options: any = {},
  ): Promise<{
    products: TurkishProduct[]
    totalResults: number
    storeResults: Record<string, number>
  }> {
    console.log("🔍 Searching all Turkish stores for:", query)

    try {
      // Search all stores in parallel
      const [trendyolResults, hepsiburadaResults, n11Results, amazonResults] = await Promise.all([
        this.trendyol.searchProducts(query, { ...options, limit: 15 }),
        this.hepsiburada.searchProducts(query, { ...options, limit: 15 }),
        this.n11.searchProducts(query, { ...options, limit: 15 }),
        this.amazon.searchProducts(query, { ...options, limit: 15 }),
      ])

      // Combine all products
      const allProducts = [
        ...trendyolResults.products,
        ...hepsiburadaResults.products,
        ...n11Results.products,
        ...amazonResults.products,
      ]

      // Shuffle products for better distribution
      const shuffledProducts = allProducts.sort(() => Math.random() - 0.5)

      const storeResults = {
        Trendyol: trendyolResults.products.length,
        Hepsiburada: hepsiburadaResults.products.length,
        N11: n11Results.products.length,
        "Amazon Turkey": amazonResults.products.length,
      }

      console.log("📊 Store results:", storeResults)
      console.log("📦 Total products found:", shuffledProducts.length)

      return {
        products: shuffledProducts,
        totalResults:
          trendyolResults.totalResults +
          hepsiburadaResults.totalResults +
          n11Results.totalResults +
          amazonResults.totalResults,
        storeResults,
      }
    } catch (error) {
      console.error("Error searching Turkish stores:", error)
      return {
        products: [],
        totalResults: 0,
        storeResults: {},
      }
    }
  }

  async searchSpecificStore(
    storeName: string,
    query: string,
    options: any = {},
  ): Promise<{
    products: TurkishProduct[]
    totalResults: number
  }> {
    console.log(`🏪 Searching ${storeName} for:`, query)

    switch (storeName.toLowerCase()) {
      case "trendyol":
        return await this.trendyol.searchProducts(query, options)
      case "hepsiburada":
        return await this.hepsiburada.searchProducts(query, options)
      case "n11":
        return await this.n11.searchProducts(query, options)
      case "amazon turkey":
      case "amazon":
        return await this.amazon.searchProducts(query, options)
      default:
        return { products: [], totalResults: 0 }
    }
  }
}

// Export singleton instance
export const turkishStoresService = new TurkishStoresService()

// Export individual APIs if needed
export const trendyolAPI = new TrendyolAPI()
export const hepsiburadaAPI = new HepsiburadaAPI()
export const n11API = new N11API()
export const amazonTurkeyAPI = new AmazonTurkeyAPI()

// Export types
export type { TurkishProduct }
