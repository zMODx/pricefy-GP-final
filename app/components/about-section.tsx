"use client"

import { Search, Heart, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutSection() {
  return (
    <section id="about-section" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Pricefy</span>{" "}
            Works
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the smartest way to shop online in Turkey. Compare prices across major platforms effortlessly.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Step 1: Search */}
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-300">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">1</Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Search & Compare</h3>
              <p className="text-gray-300 leading-relaxed">
                Search across Trendyol, Hepsiburada, N11, and Amazon Turkey instantly to find the best deals.
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Track */}
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-300">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">2</Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Save & Track</h3>
              <p className="text-gray-300 leading-relaxed">
                Add products to favorites and get notified when prices drop. Never miss a great deal again.
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Save */}
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-300">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white">3</Badge>
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Save Money</h3>
              <p className="text-gray-300 leading-relaxed">
                Make informed decisions with price history and comparisons. Save an average of 25% on purchases.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Simple Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-6">Trusted by Smart Shoppers</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-purple-100">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-purple-100">Products Tracked</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">₺25M+</div>
              <div className="text-purple-100">Total Savings</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
