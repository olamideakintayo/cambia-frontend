import { apiClient, type ApiResponse } from "../api-client"
import { API_CONFIG } from "../api-config"
import type { Address, ShippingRateRequest, ShippingRate } from "../api-types"

export interface ShippingZone {
  id: string
  name: string
  countries: string[]
  states?: string[]
  cities?: string[]
  isActive: boolean
  baseCost: number
  perKgCost: number
  freeShippingThreshold?: number
  estimatedDays: {
    min: number
    max: number
  }
}

export interface DeliveryOption {
  id: string
  name: string
  description: string
  type: "standard" | "express" | "overnight" | "pickup"
  baseCost: number
  perKgCost: number
  estimatedDays: {
    min: number
    max: number
  }
  isAvailable: boolean
  restrictions?: {
    maxWeight?: number
    maxDimensions?: {
      length: number
      width: number
      height: number
    }
    excludedItems?: string[]
  }
}

export interface ShipmentCreateRequest {
  orderId: string
  carrier: string
  service: string
  fromAddress: Address
  toAddress: Address
  packages: Array<{
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    value: number
    description: string
  }>
  insurance?: {
    amount: number
    provider: string
  }
  signature?: boolean
  saturdayDelivery?: boolean
}

export interface ShipmentResponse {
  id: string
  trackingNumber: string
  carrier: string
  service: string
  cost: number
  estimatedDelivery: string
  labelUrl: string
  status: "created" | "picked_up" | "in_transit" | "delivered" | "failed"
}

export interface TrackingUpdate {
  id: string
  status: string
  description: string
  location?: string
  timestamp: string
  nextUpdate?: string
}

class ShippingService {
  // Calculate shipping rates
  async calculateRates(request: ShippingRateRequest): Promise<ApiResponse<ShippingRate[]>> {
    return apiClient.post<ShippingRate[]>(API_CONFIG.ENDPOINTS.SHIPPING.CALCULATE_RATES, request)
  }

  // Get delivery options for a location
  async getDeliveryOptions(
    destination: {
      country: string
      state: string
      city: string
      postalCode: string
    },
    items?: Array<{
      weight: number
      dimensions?: {
        length: number
        width: number
        height: number
      }
    }>,
  ): Promise<ApiResponse<DeliveryOption[]>> {
    return apiClient.post<DeliveryOption[]>(API_CONFIG.ENDPOINTS.SHIPPING.DELIVERY_OPTIONS, {
      destination,
      items,
    })
  }

  // Get shipping zones
  async getShippingZones(): Promise<ApiResponse<ShippingZone[]>> {
    return apiClient.get<ShippingZone[]>(API_CONFIG.ENDPOINTS.SHIPPING.SHIPPING_ZONES)
  }

  // Create shipment
  async createShipment(request: ShipmentCreateRequest): Promise<ApiResponse<ShipmentResponse>> {
    return apiClient.post<ShipmentResponse>(API_CONFIG.ENDPOINTS.SHIPPING.CREATE_SHIPMENT, request)
  }

  // Track shipment
  async trackShipment(trackingNumber: string): Promise<
    ApiResponse<{
      trackingNumber: string
      carrier: string
      status: string
      estimatedDelivery?: string
      actualDelivery?: string
      updates: TrackingUpdate[]
      currentLocation?: string
    }>
  > {
    return apiClient.get(API_CONFIG.ENDPOINTS.SHIPPING.TRACK_SHIPMENT, { trackingNumber })
  }

  // Update shipping address
  async updateShippingAddress(addressId: string, address: Address): Promise<ApiResponse<Address>> {
    return apiClient.put<Address>(API_CONFIG.ENDPOINTS.SHIPPING.UPDATE_ADDRESS, address, {
      params: { addressId },
    })
  }

  // Validate address
  async validateAddress(address: Address): Promise<
    ApiResponse<{
      isValid: boolean
      suggestions?: Address[]
      errors?: string[]
      standardized?: Address
    }>
  > {
    return apiClient.post("/shipping/validate-address", { address })
  }

  // Get shipping labels
  async getShippingLabel(shipmentId: string, format: "pdf" | "png" = "pdf"): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/shipping/shipments/${shipmentId}/label?format=${format}`, {
      headers: {
        Authorization: `Bearer ${apiClient.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to download shipping label")
    }

    return response.blob()
  }

  // Cancel shipment
  async cancelShipment(
    shipmentId: string,
    reason?: string,
  ): Promise<ApiResponse<{ message: string; refund?: number }>> {
    return apiClient.post<{ message: string; refund?: number }>(`/shipping/shipments/${shipmentId}/cancel`, {
      reason,
    })
  }

  // Schedule pickup
  async schedulePickup(
    shipmentIds: string[],
    pickupDate: string,
    timeWindow: {
      start: string
      end: string
    },
    instructions?: string,
  ): Promise<
    ApiResponse<{
      pickupId: string
      confirmationNumber: string
      scheduledDate: string
      timeWindow: {
        start: string
        end: string
      }
    }>
  > {
    return apiClient.post("/shipping/schedule-pickup", {
      shipmentIds,
      pickupDate,
      timeWindow,
      instructions,
    })
  }

  // Get shipping analytics
  async getShippingAnalytics(
    params: {
      period?: "7d" | "30d" | "90d" | "1y"
      vendorId?: string
    } = {},
  ): Promise<
    ApiResponse<{
      totalShipments: number
      totalCost: number
      averageCost: number
      onTimeDeliveryRate: number
      carrierBreakdown: Array<{
        carrier: string
        shipments: number
        cost: number
        onTimeRate: number
      }>
      costChart: {
        labels: string[]
        data: number[]
      }
      deliveryPerformance: {
        labels: string[]
        onTime: number[]
        delayed: number[]
      }
    }>
  > {
    return apiClient.get("/shipping/analytics", params)
  }

  // Get carrier services
  async getCarrierServices(carrier: string): Promise<
    ApiResponse<
      Array<{
        id: string
        name: string
        description: string
        type: "ground" | "air" | "express" | "overnight"
        estimatedDays: {
          min: number
          max: number
        }
        features: string[]
        restrictions?: {
          maxWeight?: number
          maxDimensions?: {
            length: number
            width: number
            height: number
          }
        }
      }>
    >
  > {
    return apiClient.get(`/shipping/carriers/${carrier}/services`)
  }

  // Calculate dimensional weight
  calculateDimensionalWeight(
    dimensions: {
      length: number
      width: number
      height: number
    },
    divisor = 5000, // Standard dimensional weight divisor
  ): number {
    return (dimensions.length * dimensions.width * dimensions.height) / divisor
  }

  // Estimate shipping cost
  async estimateShippingCost(
    items: Array<{
      weight: number
      dimensions?: {
        length: number
        width: number
        height: number
      }
      value: number
    }>,
    origin: {
      country: string
      state: string
      city: string
      postalCode: string
    },
    destination: {
      country: string
      state: string
      city: string
      postalCode: string
    },
    service?: string,
  ): Promise<
    ApiResponse<{
      baseCost: number
      weightCost: number
      dimensionalWeightCost: number
      fuelSurcharge: number
      taxes: number
      total: number
      estimatedDays: {
        min: number
        max: number
      }
    }>
  > {
    return apiClient.post("/shipping/estimate-cost", {
      items,
      origin,
      destination,
      service,
    })
  }

  // Get shipping restrictions
  async getShippingRestrictions(
    destination: {
      country: string
      state?: string
    },
    items?: Array<{
      category: string
      weight: number
      value: number
    }>,
  ): Promise<
    ApiResponse<{
      isAllowed: boolean
      restrictions: Array<{
        type: "prohibited" | "restricted" | "documentation_required"
        description: string
        items?: string[]
        requirements?: string[]
      }>
      documentation?: Array<{
        name: string
        description: string
        required: boolean
      }>
    }>
  > {
    return apiClient.post("/shipping/restrictions", {
      destination,
      items,
    })
  }

  // Bulk create shipments
  async bulkCreateShipments(shipments: ShipmentCreateRequest[]): Promise<
    ApiResponse<{
      successful: ShipmentResponse[]
      failed: Array<{
        request: ShipmentCreateRequest
        error: string
      }>
      summary: {
        total: number
        successful: number
        failed: number
        totalCost: number
      }
    }>
  > {
    return apiClient.post("/shipping/bulk-create", { shipments })
  }
}

// Export singleton instance
export const shippingService = new ShippingService()
