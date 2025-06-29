"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, ChevronDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileDropdownProps {
  user: { name: string; email: string; profilePic?: string }
  onProfileClick: () => void
  onLogout: () => void
  isDarkTheme?: boolean
}

export default function ProfileDropdown({ user, onProfileClick, onLogout, isDarkTheme = false }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="relative z-[300]" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 hover:bg-white/10 ${
          isDarkTheme ? "text-white/90 hover:text-white" : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {user.profilePic ? (
            <img
              src={user.profilePic || "/placeholder.svg"}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            getInitials(user.name)
          )}
        </div>
        <span className="hidden md:block font-medium">{user.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <Card
          className={`absolute right-0 top-full mt-2 w-48 shadow-xl z-[300] border-2 ${
            isDarkTheme
              ? "bg-gray-900/95 backdrop-blur-xl border-gray-600"
              : "bg-white/95 backdrop-blur-xl border-gray-200"
          }`}
        >
          <CardContent className="p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onProfileClick()
                  setIsOpen(false)
                }}
                className={`w-full justify-start ${
                  isDarkTheme
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onLogout()
                  setIsOpen(false)
                }}
                className={`w-full justify-start ${
                  isDarkTheme
                    ? "text-gray-300 hover:text-white hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
