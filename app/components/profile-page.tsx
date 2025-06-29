"use client"

import { useState } from "react"
import { ArrowLeft, Heart, Mail, Calendar, TrendingUp, Trash2, Bell, Camera, Lock, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/lib/product-service"

interface UserType {
  name: string
  email: string
  profilePic?: string
  joinDate?: string
  totalSavings?: number
  favoriteCount?: number
}

interface ProfilePageProps {
  user: UserType
  userFavorites: string[]
  userPriceAlerts: any[]
  favoriteProducts: Product[]
  onBack: () => void
  onProductSelect: (product: Product) => void
  onFavoriteToggle: (productId: string) => void
  onBackToHome?: () => void
}

// Mock user data with more details
const mockUserData: UserType = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "2024-01-15",
  totalSavings: 2450,
  favoriteCount: 12,
}

export default function ProfilePage({
  user,
  userFavorites,
  userPriceAlerts,
  favoriteProducts,
  onBack,
  onProductSelect,
  onFavoriteToggle,
  onBackToHome,
}: ProfilePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [priceAlerts, setPriceAlerts] = useState<any[]>(userPriceAlerts)

  // Edit Profile Modal States
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [editedName, setEditedName] = useState(user.name)
  const [editedBio, setEditedBio] = useState("")

  // Change Avatar Modal State
  const [changeAvatarOpen, setChangeAvatarOpen] = useState(false)
  const [newAvatarUrl, setNewAvatarUrl] = useState("")

  // Change Email Modal State
  const [changeEmailOpen, setChangeEmailOpen] = useState(false)
  const [newEmail, setNewEmail] = useState(user.email)
  const [currentPassword, setCurrentPassword] = useState("")

  // Change Password Modal State
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Email Preferences Modal State
  const [emailPrefsOpen, setEmailPrefsOpen] = useState(false)
  const [emailPreferences, setEmailPreferences] = useState({
    priceAlerts: true,
    weeklyDeals: true,
    newProducts: false,
    marketingEmails: false,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const removeFavorite = (productId: string) => {
    onFavoriteToggle(productId)
  }

  const filteredProducts = favoriteProducts.filter((product) => {
    if (selectedCategory === "all") return true
    return product.category.toLowerCase() === selectedCategory.toLowerCase()
  })

  const categories =
    favoriteProducts.length > 0 ? ["all", ...Array.from(new Set(favoriteProducts.map((p) => p.category)))] : ["all"]

  const totalSavings = favoriteProducts
    .filter((p) => p.originalPrice && p.originalPrice > p.currentPrice)
    .reduce((sum, p) => sum + (p.originalPrice! - p.currentPrice), 0)

  const handleSaveProfile = () => {
    console.log("Saving profile:", { name: editedName, bio: editedBio })
    alert(`Profile updated!\nName: ${editedName}\nBio: ${editedBio}`)
    setEditProfileOpen(false)
  }

  const handleChangeAvatar = () => {
    if (!newAvatarUrl.trim()) {
      alert("Please enter a valid image URL")
      return
    }
    console.log("Changing avatar to:", newAvatarUrl)
    alert(`Avatar updated!\nNew avatar URL: ${newAvatarUrl}`)
    setChangeAvatarOpen(false)
    setNewAvatarUrl("")
  }

  const handleChangeEmail = () => {
    if (!newEmail.trim() || !currentPassword.trim()) {
      alert("Please fill in all fields")
      return
    }
    if (!newEmail.includes("@")) {
      alert("Please enter a valid email address")
      return
    }
    console.log("Changing email:", { oldEmail: user.email, newEmail, currentPassword })
    alert(`Email updated!\nNew email: ${newEmail}`)
    setChangeEmailOpen(false)
    setNewEmail("")
    setCurrentPassword("")
  }

  const handleChangePassword = () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      alert("Please fill in all fields")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match")
      return
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long")
      return
    }
    console.log("Changing password")
    alert("Password updated successfully!")
    setChangePasswordOpen(false)
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleSaveEmailPreferences = () => {
    console.log("Saving email preferences:", emailPreferences)
    alert(`Email preferences saved!\n${JSON.stringify(emailPreferences, null, 2)}`)
    setEmailPrefsOpen(false)
  }

  const handleLogoClick = () => {
    if (onBackToHome) {
      onBackToHome()
    } else {
      onBack()
    }
  }

  const getStoreBadgeColor = (store: string) => {
    switch (store.toLowerCase()) {
      case "trendyol":
        return "bg-orange-500/20 text-orange-200 border-orange-400/30"
      case "hepsiburada":
        return "bg-red-500/20 text-red-200 border-red-400/30"
      case "n11":
        return "bg-purple-500/20 text-purple-200 border-purple-400/30"
      case "amazon turkey":
        return "bg-yellow-500/20 text-yellow-200 border-yellow-400/30"
      default:
        return "bg-blue-500/20 text-blue-200 border-blue-400/30"
    }
  }

  const handleRemovePriceAlert = (alertId: string) => {
    const updatedAlerts = priceAlerts.filter((alert) => alert.id !== alertId)
    setPriceAlerts(updatedAlerts)

    const userPriceAlertsDB = (globalThis as any).userPriceAlertsDB || {}
    userPriceAlertsDB[user.email] = updatedAlerts

    const userAlertsKey = `priceAlerts_${user.email}`
    localStorage.setItem(userAlertsKey, JSON.stringify(updatedAlerts))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </Button>
              <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={handleLogoClick}>
                <img
                  src="/pricefy-logo.png"
                  alt="Pricefy"
                  className="h-6 w-auto hover:scale-105 transition-transform duration-200 cursor-pointer"
                />
              </Button>
            </div>
            <h1 className="text-xl font-semibold text-white">My Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header Section */}
        <div className="mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-4 border-purple-500/30">
                    <AvatarImage src={user.profilePic || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-3xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Change Avatar Dialog */}
                  <Dialog open={changeAvatarOpen} onOpenChange={setChangeAvatarOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-white border-gray-600 hover:bg-gray-700">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Avatar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-600">
                      <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatar-url" className="text-gray-400">
                            Avatar Image URL
                          </Label>
                          <Input
                            id="avatar-url"
                            placeholder="https://example.com/avatar.jpg"
                            value={newAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                            className="bg-gray-800 border-gray-500 text-white"
                          />
                        </div>
                        {newAvatarUrl && (
                          <div className="flex justify-center">
                            <img
                              src={newAvatarUrl || "/placeholder.svg"}
                              alt="Preview"
                              className="w-20 h-20 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setChangeAvatarOpen(false)}
                          className="text-white border-gray-500 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleChangeAvatar} className="bg-purple-600 hover:bg-purple-700 text-white">
                          Update Avatar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* User Info Section */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Member since</p>
                      <p className="font-medium text-white">{formatDate(mockUserData.joinDate!)}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Favorites</p>
                      <p className="font-medium text-white">{favoriteProducts.length}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <Bell className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Price Alerts</p>
                      <p className="font-medium text-white">{priceAlerts.length}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-700/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <p className="text-sm text-gray-400">Total Savings</p>
                      <p className="font-medium text-green-400">{formatPrice(totalSavings)}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {/* Edit Profile Dialog */}
                    <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-600">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-400">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio" className="text-gray-400">
                              Bio
                            </Label>
                            <Textarea
                              id="bio"
                              placeholder="Tell us about yourself..."
                              value={editedBio}
                              onChange={(e) => setEditedBio(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                              rows={3}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEditProfileOpen(false)}
                            className="text-white border-gray-500 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Change Email Dialog */}
                    <Dialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                          <Mail className="w-4 h-4 mr-2" />
                          Change Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-600">
                        <DialogHeader>
                          <DialogTitle>Change Email Address</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-email" className="text-gray-400">
                              Current Email
                            </Label>
                            <Input
                              id="current-email"
                              value={user.email}
                              disabled
                              className="bg-gray-800 border-gray-500 text-gray-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-email" className="text-gray-400">
                              New Email
                            </Label>
                            <Input
                              id="new-email"
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="current-password-email" className="text-gray-400">
                              Current Password
                            </Label>
                            <Input
                              id="current-password-email"
                              type="password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setChangeEmailOpen(false)}
                            className="text-white border-gray-500 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleChangeEmail} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Update Email
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Change Password Dialog */}
                    <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                          <Lock className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-600">
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="old-password" className="text-gray-400">
                              Current Password
                            </Label>
                            <Input
                              id="old-password"
                              type="password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-gray-400">
                              New Password
                            </Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-gray-400">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="bg-gray-800 border-gray-500 text-white"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setChangePasswordOpen(false)}
                            className="text-white border-gray-500 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleChangePassword}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Update Password
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Email Preferences Dialog */}
                    <Dialog open={emailPrefsOpen} onOpenChange={setEmailPrefsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-700">
                          <Bell className="w-4 h-4 mr-2" />
                          Email Settings
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border border-gray-600">
                        <DialogHeader>
                          <DialogTitle>Email Preferences</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Price Alerts</Label>
                              <p className="text-sm text-gray-500">Get notified when prices drop on your favorites</p>
                            </div>
                            <Switch
                              checked={emailPreferences.priceAlerts}
                              onCheckedChange={(checked) =>
                                setEmailPreferences((prev) => ({ ...prev, priceAlerts: checked }))
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Weekly Deals</Label>
                              <p className="text-sm text-gray-500">Receive weekly deals and discounts</p>
                            </div>
                            <Switch
                              checked={emailPreferences.weeklyDeals}
                              onCheckedChange={(checked) =>
                                setEmailPreferences((prev) => ({ ...prev, weeklyDeals: checked }))
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">New Products</Label>
                              <p className="text-sm text-gray-500">Get notified about new products</p>
                            </div>
                            <Switch
                              checked={emailPreferences.newProducts}
                              onCheckedChange={(checked) =>
                                setEmailPreferences((prev) => ({ ...prev, newProducts: checked }))
                              }
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-base">Marketing Emails</Label>
                              <p className="text-sm text-gray-500">Receive promotional content and updates</p>
                            </div>
                            <Switch
                              checked={emailPreferences.marketingEmails}
                              onCheckedChange={(checked) =>
                                setEmailPreferences((prev) => ({ ...prev, marketingEmails: checked }))
                              }
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setEmailPrefsOpen(false)}
                            className="text-white border-gray-500 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveEmailPreferences}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Save Preferences
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Favorites Section */}
          <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">My Favorites</CardTitle>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                  {favoriteProducts.length} items
                </Badge>
              </div>

              {/* Category Filter */}
              {favoriteProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`${
                        selectedCategory === category
                          ? "bg-purple-600 hover:bg-purple-700 text-white"
                          : "text-white border-gray-600 hover:bg-gray-700"
                      }`}
                    >
                      {category === "all" ? "All" : category}
                      {category !== "all" && (
                        <Badge variant="secondary" className="ml-2 bg-gray-600">
                          {favoriteProducts.filter((p) => p.category.toLowerCase() === category.toLowerCase()).length}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </CardHeader>

            <CardContent>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {favoriteProducts.length === 0 ? "No favorites yet" : "No favorites in this category"}
                  </h3>
                  <p className="text-gray-400">
                    {favoriteProducts.length === 0
                      ? "Start adding products to your favorites!"
                      : "Try a different category to see your favorites."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredProducts.slice(0, 5).map((product) => {
                    const discount =
                      product.originalPrice && product.originalPrice > product.currentPrice
                        ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
                        : 0

                    return (
                      <Card
                        key={product.id}
                        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gray-700/50 text-white border-gray-600/50"
                        onClick={() => onProductSelect(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex space-x-4">
                            <img
                              src={product.image || "/placeholder.svg?height=200&width=200"}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=200&width=200"
                              }}
                            />

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white line-clamp-1 group-hover:text-purple-400 transition-colors text-sm">
                                {product.name}
                              </h3>

                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`text-xs ${getStoreBadgeColor(product.store)}`}>
                                  {product.store}
                                </Badge>
                                {discount > 0 && <Badge className="bg-red-500 text-white text-xs">-{discount}%</Badge>}
                              </div>

                              <div className="flex items-center justify-between mt-2">
                                <div className="text-sm font-bold text-purple-400">
                                  {formatPrice(product.currentPrice)}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeFavorite(product.id)
                                  }}
                                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                  {favoriteProducts.length > 5 && (
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-400">Showing 5 of {favoriteProducts.length} favorites</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Alerts Section */}
          <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-yellow-500" />
                  Price Alerts
                </CardTitle>
                <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-200">
                  {priceAlerts.length} active
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {priceAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No price alerts set</h3>
                  <p className="text-gray-400">Set price alerts on products to get notified when prices drop!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {priceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={alert.productImage || "/placeholder.svg"}
                          alt={alert.productName}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-white line-clamp-1 text-sm">{alert.productName}</h4>
                          <p className="text-xs text-gray-400">
                            Alert when below {formatPrice(alert.targetPrice)} • Current:{" "}
                            {formatPrice(alert.currentPrice)}
                          </p>
                          <p className="text-xs text-gray-500">Set on {formatDate(alert.dateCreated)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={alert.isActive ? "default" : "secondary"}
                          className={alert.isActive ? "bg-green-600/20 text-green-200" : ""}
                        >
                          {alert.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemovePriceAlert(alert.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
