"use client"

import { useState, useEffect, useCallback } from "react"
import { vendorService, type VendorStatsResponse } from "@/lib/services/vendor-service"
import type { Vendor } from "@/lib/api-types"
import { useToast } from "./use-toast"

interface UseVendorReturn {
  vendor: Vendor | null
  stats: VendorStatsResponse | null
  isLoading: boolean
  isVendor: boolean
  isVerified: boolean
  refreshVendor: () => Promise<void>
  refreshStats: () => Promise<void>
  updateProfile: (data: any) => Promise<boolean>
  submitVerification: (documents: any) => Promise<boolean>
}

export function useVendor(): UseVendorReturn {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [stats, setStats] = useState<VendorStatsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const isVendor = !!vendor
  const isVerified = vendor?.verified || false

  // Load vendor profile
  const refreshVendor = useCallback(async () => {
    try {
      const response = await vendorService.getProfile()
      if (response.success && response.data) {
        setVendor(response.data)
      } else {
        setVendor(null)
      }
    } catch (error) {
      console.error("Failed to load vendor profile:", error)
      setVendor(null)
    }
  }, [])

  // Load dashboard stats
  const refreshStats = useCallback(async () => {
    if (!vendor) return

    try {
      const response = await vendorService.getDashboardStats()
      if (response.success && response.data) {
        setStats(response.data)
      }
    } catch (error) {
      console.error("Failed to load vendor stats:", error)
    }
  }, [vendor])

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await refreshVendor()
      setIsLoading(false)
    }

    loadData()
  }, [refreshVendor])

  // Load stats when vendor is available
  useEffect(() => {
    if (vendor) {
      refreshStats()
    }
  }, [vendor, refreshStats])

  const updateProfile = useCallback(
    async (data: any): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await vendorService.updateProfile(data)

        if (response.success && response.data) {
          setVendor(response.data)
          toast({
            title: "Profile updated",
            description: "Your vendor profile has been successfully updated.",
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

  const submitVerification = useCallback(
    async (documents: any): Promise<boolean> => {
      try {
        setIsLoading(true)
        const response = await vendorService.submitVerificationDocuments(documents)

        if (response.success) {
          toast({
            title: "Documents submitted",
            description: "Your verification documents have been submitted for review.",
          })
          await refreshVendor() // Refresh to get updated verification status
          return true
        } else {
          toast({
            title: "Submission failed",
            description: response.message || "Failed to submit documents",
            variant: "destructive",
          })
          return false
        }
      } catch (error: any) {
        toast({
          title: "Submission failed",
          description: error.message || "An error occurred while submitting documents",
          variant: "destructive",
        })
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [toast, refreshVendor],
  )

  return {
    vendor,
    stats,
    isLoading,
    isVendor,
    isVerified,
    refreshVendor,
    refreshStats,
    updateProfile,
    submitVerification,
  }
}
