"use client"

import { useState } from "react"
import { Star, ShoppingCart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/product-service"

interface ProductComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  currentProduct: Product
  similarProducts: Product[]
  onProductSelect: (product: Product) => void
}

export default function ProductComparisonModal({
  isOpen,
  onClose,
  currentProduct,
  similarProducts,
  onProductSelect,
}: ProductComparisonModalProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([currentProduct])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const handleProductToggle = (product: Product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      // Remove product if already selected (but keep at least current product)
      if (selectedProducts.length > 1 && product.id !== currentProduct.id) {
        setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
      }
    } else {
      // Add product if not selected (max 3 products)
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, product])
      }
    }
  }

  const getBestValue = (products: Product[], key: keyof Product) => {
    if (key === "currentPrice") {
      return Math.min(...products.map((p) => p.currentPrice))
    }
    if (key === "rating") {
      return Math.max(...products.map((p) => p.rating))
    }
    if (key === "reviews") {
      return Math.max(...products.map((p) => p.reviews))
    }
    return null
  }

  const isHighlighted = (product: Product, key: keyof Product, bestValue: any) => {
    if (bestValue === null) return false
    return product[key] === bestValue
  }

  const bestPrice = getBestValue(selectedProducts, "currentPrice")
  const bestRating = getBestValue(selectedProducts, "rating")
  const bestReviews = getBestValue(selectedProducts, "reviews")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="electric-modal-content">
          <style jsx>{`
            .electric-modal-content {
              background: rgba(0, 0, 0, 0.95);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              border-radius: 16px;
            }
            
            .electric-card {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.2);
              box-shadow: 
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(147, 51, 234, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
            }

            .highlight-best {
              background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.2) 100%);
              border: 1px solid rgba(16, 185, 129, 0.4);
              box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
            }

            .product-selector {
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(255, 255, 255, 0.1);
              transition: all 0.3s ease;
            }

            .product-selector:hover {
              background: rgba(255, 255, 255, 0.1);
              border-color: rgba(147, 51, 234, 0.5);
            }

            .product-selector.selected {
              background: rgba(147, 51, 234, 0.2);
              border-color: rgba(147, 51, 234, 0.6);
            }
          `}</style>

          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold text-white drop-shadow-lg">Compare Products</DialogTitle>
            <p className="text-white/70">
              Select up to 3 products to compare side by side. Current product is automatically included.
            </p>
          </DialogHeader>

          {/* Product Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Available Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[currentProduct, ...similarProducts].map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductToggle(product)}
                  className={`product-selector p-3 rounded-lg cursor-pointer ${
                    selectedProducts.find((p) => p.id === product.id) ? "selected" : ""
                  } ${product.id === currentProduct.id ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  <div className="aspect-square bg-white/10 rounded mb-2 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg?height=100&width=100"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=100&width=100"
                      }}
                    />
                  </div>
                  <p className="text-xs text-white/90 font-medium line-clamp-2 mb-1">{product.name}</p>
                  <p className="text-sm font-bold text-green-300">{formatPrice(product.currentPrice)}</p>
                  {product.id === currentProduct.id && (
                    <Badge className="mt-1 text-xs bg-blue-500/20 text-blue-300">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-white/20 mb-6" />

          {/* Comparison Table */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Product Comparison</h3>

            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedProducts.length}, 1fr)` }}>
              {selectedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`electric-card ${
                    isHighlighted(product, "currentPrice", bestPrice) ||
                    isHighlighted(product, "rating", bestRating) ||
                    isHighlighted(product, "reviews", bestReviews)
                      ? "highlight-best"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    {/* Product Image */}
                    <div className="aspect-square bg-white/10 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={product.image || "/placeholder.svg?height=200&width=200"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white text-sm line-clamp-2">{product.name}</h4>

                      {/* Price */}
                      <div
                        className={`p-2 rounded ${
                          isHighlighted(product, "currentPrice", bestPrice)
                            ? "bg-green-500/20 border border-green-400/30"
                            : "bg-white/5"
                        }`}
                      >
                        <p className="text-lg font-bold text-green-300">
                          {formatPrice(product.currentPrice)}
                          {isHighlighted(product, "currentPrice", bestPrice) && (
                            <Badge className="ml-2 text-xs bg-green-500 text-white">Best Price</Badge>
                          )}
                        </p>
                        {product.originalPrice && product.originalPrice > product.currentPrice && (
                          <p className="text-sm text-white/60 line-through">{formatPrice(product.originalPrice)}</p>
                        )}
                      </div>

                      {/* Rating */}
                      <div
                        className={`p-2 rounded ${
                          isHighlighted(product, "rating", bestRating)
                            ? "bg-yellow-500/20 border border-yellow-400/30"
                            : "bg-white/5"
                        }`}
                      >
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-white/90">
                            {product.rating.toFixed(1)}
                            {isHighlighted(product, "rating", bestRating) && (
                              <Badge className="ml-2 text-xs bg-yellow-500 text-white">Highest Rated</Badge>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Reviews */}
                      <div
                        className={`p-2 rounded ${
                          isHighlighted(product, "reviews", bestReviews)
                            ? "bg-blue-500/20 border border-blue-400/30"
                            : "bg-white/5"
                        }`}
                      >
                        <p className="text-sm text-white/90">
                          {product.reviews.toLocaleString()} reviews
                          {isHighlighted(product, "reviews", bestReviews) && (
                            <Badge className="ml-2 text-xs bg-blue-500 text-white">Most Reviews</Badge>
                          )}
                        </p>
                      </div>

                      {/* Store & Brand */}
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-orange-500/20 text-orange-200 border-orange-400/30">
                          {product.store}
                        </Badge>
                        {product.brand && (
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-200 border-blue-400/30 ml-2">
                            {product.brand}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-2">
                        <Button
                          onClick={() => {
                            onProductSelect(product)
                            onClose()
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          onClick={() => window.open(product.storeUrl, "_blank")}
                          size="sm"
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border-white/20 text-white/90 hover:bg-white/20"
            >
              Close Comparison
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
