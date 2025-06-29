// Test file to verify Turkish stores API is working
import { turkishStoresService } from "./turkish-stores-api"

export async function testTurkishStores() {
  console.log("🧪 Testing Turkish Stores API...")

  try {
    const results = await turkishStoresService.searchAllStores("phone", { limit: 5 })

    console.log("✅ Test Results:")
    console.log("📊 Total products:", results.products.length)
    console.log("🏪 Store results:", results.storeResults)
    console.log("📦 Sample products:")

    results.products.slice(0, 8).forEach((product, index) => {
      console.log(`${index + 1}. ${product.store}: ${product.name} - ${product.currentPrice} TRY`)
    })

    return results
  } catch (error) {
    console.error("❌ Test failed:", error)
    return null
  }
}

// Auto-run test when imported
if (typeof window !== "undefined") {
  testTurkishStores()
}
