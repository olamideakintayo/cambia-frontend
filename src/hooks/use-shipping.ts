"use client"

import { useState, useCallback } from "react"
import { shippingService, type DeliveryOption, type ShippingZone } from "@/lib/services/shipping-service"
import type { Address, ShippingRate } from "@/lib/api-types"
import { useToast } from "./use-toast"

interface UseShippingReturn {
  deliveryOptions: DeliveryOption[]
  shippingZones: ShippingZone[]
  shippingRates: ShippingRate[]
  isLoading: boolean
  error: string | null
  calculateRates: (request: any) => Promise<ShippingRate[]>
  getDeliveryOptions: (destination: any, items?: any[]) => Promise<DeliveryOption[]>
  validateAddress: (address: Address) => Promise<{ isValid: boolean; suggestions?: Address[]; standardized?: Address }>
  estimateShippingCost: (items: any[], origin: any, destination: any, service?: string) => Promise<any>
  trackShipment: (trackingNumber: string) => Promise<any>
}

export function useShipping(): UseShippingReturn {
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([])
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const calculateRates = useCallback(async (request: any): Promise<ShippingRate[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await shippingService.calculateRates(request)

      if (response.success && response.data) {
        setShippingRates(response.data)
        return response.data
      } else {
        setError(response.message || "Failed to calculate shipping rates")
        return []
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while calculating shipping rates")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getDeliveryOptions = useCallback(async (destination: any, items?: any[]): Promise<DeliveryOption[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await shippingService.getDeliveryOptions(destination, items)

      if (response.success && response.data) {
        setDeliveryOptions(response.data)
        return response.data
      } else {
        setError(response.message || "Failed to get delivery options")
        return []
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while getting delivery options")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const validateAddress = useCallback(
    async (address: Address) => {
      try {
        const response = await shippingService.validateAddress(address)

        if (response.success && response.data) {
          if (!response.data.isValid && response.data.suggestions) {
            toast({
              title: "Address validation",
              description: "We found some suggestions to improve your address.",
            })
          }
          return response.data
        } else {
          toast({
            title: "Address validation failed",
            description: response.message || "Failed to validate address",
            variant: "destructive",
          })
          return { isValid: false }
        }
      } catch (err: any) {
        toast({
          title: "Address validation failed",
          description: err.message || "An error occurred while validating address",
          variant: "destructive",
        })
        return { isValid: false }
      }
    },
    [toast],
  )

  const estimateShippingCost = useCallback(async (items: any[], origin: any, destination: any, service?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await shippingService.estimateShippingCost(items, origin, destination, service)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.message || "Failed to estimate shipping cost")
        return null
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while estimating shipping cost")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const trackShipment = useCallback(async (trackingNumber: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await shippingService.trackShipment(trackingNumber)

      if (response.success && response.data) {
        return response.data
      } else {
        setError(response.message || "Failed to track shipment")
        return null
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while tracking shipment")
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    deliveryOptions,
    shippingZones,
    shippingRates,
    isLoading,
    error,
    calculateRates,
    getDeliveryOptions,
    validateAddress,
    estimateShippingCost,
    trackShipment,
  }
}
