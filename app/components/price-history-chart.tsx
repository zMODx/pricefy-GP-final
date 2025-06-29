"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PriceHistoryChartProps {
  data: { date: string; price: number }[]
  duration?: "1m" | "3m" | "6m" | "all"
}

export default function PriceHistoryChart({ data, duration = "6m" }: PriceHistoryChartProps) {
  // Filter data based on selected duration
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []

    const now = new Date()
    let cutoffDate: Date

    switch (duration) {
      case "1m":
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        break
      case "3m":
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
        break
      case "6m":
        cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) // 180 days ago
        break
      case "all":
      default:
        return data // Return all data
    }

    return data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })
  }, [data, duration])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    })
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white/90 text-sm font-medium">{formatDate(label)}</p>
          <p className="text-purple-300 text-lg font-bold">{formatPrice(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-white/60 mb-2">📊</div>
          <p className="text-white/60 text-sm">No price history available</p>
        </div>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          stroke="rgba(255, 255, 255, 0.6)"
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value) => formatPrice(value)}
          stroke="rgba(255, 255, 255, 0.6)"
          fontSize={12}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="price"
          stroke="url(#priceGradient)"
          strokeWidth={3}
          dot={{ fill: "#9333ea", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#3b82f6", strokeWidth: 2 }}
        />
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </LineChart>
    </ResponsiveContainer>
  )
}
