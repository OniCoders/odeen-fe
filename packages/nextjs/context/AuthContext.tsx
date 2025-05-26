"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, Profile } from "~~/types"
import { mockUser, mockProfile } from "~~/lib/mock-data"

interface AuthContextType {
  user: User | null
  profile: Profile | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<Profile>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem("user")
    const savedProfile = localStorage.getItem("profile")

    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setProfile(JSON.parse(savedProfile))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = { ...mockUser, email }
    const profileData = { ...mockProfile }

    setUser(userData)
    setProfile(profileData)

    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("profile", JSON.stringify(profileData))

    setIsLoading(false)
  }

  const register = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = { ...mockUser, email, id: `user-${Date.now()}` }
    const profileData = { ...mockProfile, user_id: userData.id, id: `profile-${Date.now()}` }

    setUser(userData)
    setProfile(profileData)

    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("profile", JSON.stringify(profileData))

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem("user")
    localStorage.removeItem("profile")
  }

  const updateProfile = (updates: Partial<Profile>) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      localStorage.setItem("profile", JSON.stringify(updatedProfile))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
