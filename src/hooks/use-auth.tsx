"use client"

import type React from "react"

import { useState, useEffect, useCallback, createContext, useContext } from "react"
import { authService } from "@/lib/services/auth-service"
import type { User, LoginRequest, RegisterRequest } from "@/lib/api-types"
import { useToast } from "./use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  register: (userData: RegisterRequest) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (data: any) => Promise<boolean>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const isAuthenticated = !!user && authService.isAuthenticated()

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const response = await authService.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            // Token might be invalid, remove it
            authService.removeAuthToken()
          }
        } catch (error) {
          console.error("Failed to load user:", error)
          authService.removeAuthToken()
        }
      }
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await authService.login(credentials)

        if (response.success && response.data) {
          setUser(response.data.user)
          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in.",
          })
          return true
        } else {
          toast({
            title: "Login failed",
            description: response.message || "Invalid credentials",
            variant: "destructive",
          })
          return false
        }
      } catch (error: any) {
        toast({
          title: "Login failed",
          description: error.message || "An error occurred during login",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await authService.register(userData)

        if (response.success && response.data) {
          setUser(response.data.user)
          toast({
            title: "Account created!",
            description: "Welcome to Cambia! Please verify your email address.",
          })
          return true
        } else {
          toast({
            title: "Registration failed",
            description: response.message || "Failed to create account",
            variant: "destructive",
          })
          return false
        }
      } catch (error: any) {
        toast({
          title: "Registration failed",
          description: error.message || "An error occurred during registration",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
  }, [toast])

  const updateProfile = useCallback(
    async (data: any): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await authService.updateProfile(data)

        if (response.success && response.data) {
          setUser(response.data)
          toast({
            title: "Profile updated",
            description: "Your profile has been successfully updated.",
          })
          return true
        } else {
          toast({
            title: "Update failed",
            description: response.message || "Failed to update profile",
            variant: "destructive",
          })
          return false
        }
      } catch (error: any) {
        toast({
          title: "Update failed",
          description: error.message || "An error occurred while updating profile",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const refreshUser = useCallback(async (): Promise<void> => {
    if (authService.isAuthenticated()) {
      try {
        const response = await authService.getProfile()
        if (response.success && response.data) {
          setUser(response.data)
        }
      } catch (error) {
        console.error("Failed to refresh user:", error)
      }
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
