"use client"

import { useState } from "react"
import { Heart, TrendingUp, Star, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import PriceHistoryChart from "./price-history-chart"

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
  priceHistory: { date: string; price: number }[]
}

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 14 Pro 128GB Space Black",
    image: "/placeholder.svg?height=200&width=200",
    currentPrice: 45999,
    originalPrice: 49999,
    store: "Trendyol",
    rating: 4.8,
    reviews: 1250,
    isFavorite: false,
    storeUrl: "https://www.trendyol.com/iphone-14-pro",
    priceHistory: [
      { date: "2023-08-01", price: 52999 },
      { date: "2023-09-01", price: 51999 },
      { date: "2023-10-01", price: 49999 },
      { date: "2023-11-01", price: 48999 },
      { date: "2023-12-01", price: 47999 },
      { date: "2024-01-01", price: 45999 },
    ],
  },
  {
    id: "2",
    name: "iPhone 14 Pro 128GB Deep Purple",
    image: "/placeholder.svg?height=200&width=200",
    currentPrice: 46999,
    store: "Hepsiburada",
    rating: 4.7,
    reviews: 890,
    isFavorite: true,
    storeUrl: "https://www.hepsiburada.com/iphone-14-pro",
    priceHistory: [
      { date: "2023-08-01", price: 53999 },
      { date: "2023-09-01", price: 52999 },
      { date: "2023-10-01", price: 50999 },
      { date: "2023-11-01", price: 49999 },
      { date: "2023-12-01", price: 48999 },
      { date: "2024-01-01", price: 46999 },
    ],
  },
  {
    id: "3",
    name: "iPhone 14 Pro 256GB Space Black",
    image: "/placeholder.svg?height=200&width=200",
    currentPrice: 52999,
    originalPrice: 55999,
    store: "N11",
    rating: 4.6,
    reviews: 567,
    isFavorite: false,
    storeUrl: "https://www.n11.com/iphone-14-pro",
    priceHistory: [
      { date: "2023-08-01", price: 59999 },
      { date: "2023-09-01", price: 58999 },
      { date: "2023-10-01", price: 55999 },
      { date: "2023-11-01", price: 54999 },
      { date: "2023-12-01", price: 53999 },
      { date: "2024-01-01", price: 52999 },
    ],
  },
  {
    id: "4",
    name: "iPhone 14 128GB Blue",
    image: "/placeholder.svg?height=200&width=200",
    currentPrice: 38999,
    store: "Amazon Turkey",
    rating: 4.5,
    reviews: 2100,
    isFavorite: false,
    storeUrl: "https://www.amazon.com.tr/iphone-14",
    priceHistory: [
      { date: "2023-08-01", price: 44999 },
      { date: "2023-09-01", price: 43999 },
      { date: "2023-10-01", price: 42999 },
      { date: "2023-11-01", price: 41999 },
      { date: "2023-12-01", price: 40999 },
      { date: "2024-01-01", price: 38999 },
    ],
  },
]

export default function SearchResults({
  query,
  user,
  onProductSelect,
}: {
  query: string
  user: { name: string; email: string } | null
  onProductSelect: (product: Product) => void
}) {
  const [products, setProducts] = useState(mockProducts)
  const [priceRange, setPriceRange] = useState([30000, 60000])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const toggleFavorite = (productId: string) => {
    if (!user) {
      alert("Please log in to add favorites")
      return
    }

    setProducts(
      products.map((product) => (product.id === productId ? { ...product, isFavorite: !product.isFavorite } : product)),
    )
  }

  const filteredProducts = products.filter(
    (product) => product.currentPrice >= priceRange[0] && product.currentPrice <= priceRange[1],
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <Card className="p-6 sticky top-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Price Range</label>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={10000}
                  step={1000}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Stores</label>
              <div className="space-y-2">
                {["Trendyol", "Hepsiburada", "N11", "Amazon Turkey"].map((store) => (
                  <label key={store} className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">{store}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results Grid */}
      <div className="lg:col-span-3">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Search results for "{query}"</h2>
          <p className="text-gray-600 mt-1">Found {filteredProducts.length} products</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => onProductSelect(product)}
            >
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      <Badge variant="secondary">{product.store}</Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{formatPrice(product.currentPrice)}</div>
                        {product.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</div>
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
                          className={product.isFavorite ? "text-red-500" : "text-gray-400"}
                        >
                          <Heart className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProduct(product)
                          }}
                        >
                          <TrendingUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(product.storeUrl, "_blank")
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Price History Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                  ×
                </Button>
              </div>
              <PriceHistoryChart data={selectedProduct.priceHistory} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
