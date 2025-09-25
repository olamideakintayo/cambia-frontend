import { apiClient, type ApiResponse } from "../api-client"
import { API_CONFIG } from "../api-config"
import type { Vendor, VendorDocument, VendorRegistrationRequest } from "../api-types"

export interface VendorProfileUpdateRequest {
  businessName?: string
  businessType?: string
  description?: string
  address?: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  phone?: string
  email?: string
  website?: string
  logo?: File
}

export interface VendorVerificationRequest {
  documents: {
    type: "business_registration" | "tax_certificate" | "food_license" | "identity"
    file: File
  }[]
}

export interface VendorStatsResponse {
  totalProducts: number
  activeOrders: number
  totalRevenue: number
  pendingPayments: number
  totalCustomers: number
  averageRating: number
  monthlyRevenue: number[]
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    customerName: string
    amount: number
    status: string
    date: string
  }>
}

class VendorService {
  // Register as vendor
  async registerVendor(data: VendorRegistrationRequest): Promise<ApiResponse<Vendor>> {
    return apiClient.post<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.REGISTER, data)
  }

  // Get vendor profile
  async getProfile(): Promise<ApiResponse<Vendor>> {
    return apiClient.get<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.PROFILE)
  }

  // Update vendor profile
  async updateProfile(data: VendorProfileUpdateRequest): Promise<ApiResponse<Vendor>> {
    if (data.logo) {
      // Handle file upload
      const formData = new FormData()
      formData.append("logo", data.logo)

      // Add other fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "logo" && value !== undefined) {
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, String(value))
          }
        }
      })

      return apiClient.post<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.UPDATE_PROFILE, formData)
    }

    return apiClient.put<Vendor>(API_CONFIG.ENDPOINTS.VENDORS.UPDATE_PROFILE, data)
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<VendorStatsResponse>> {
    return apiClient.get<VendorStatsResponse>(API_CONFIG.ENDPOINTS.VENDORS.DASHBOARD_STATS)
  }

  // Submit verification documents
  async submitVerificationDocuments(data: VendorVerificationRequest): Promise<ApiResponse<{ message: string }>> {
    const formData = new FormData()

    data.documents.forEach((doc, index) => {
      formData.append(`documents[${index}][type]`, doc.type)
      formData.append(`documents[${index}][file]`, doc.file)
    })

    return apiClient.post<{ message: string }>(API_CONFIG.ENDPOINTS.VENDORS.VERIFICATION, formData)
  }

  // Get verification status
  async getVerificationStatus(): Promise<
    ApiResponse<{
      status: "pending" | "approved" | "rejected"
      documents: VendorDocument[]
      message?: string
    }>
  > {
    return apiClient.get(API_CONFIG.ENDPOINTS.VENDORS.VERIFICATION)
  }

  // Upload additional documents
  async uploadDocument(type: string, file: File): Promise<ApiResponse<VendorDocument>> {
    const formData = new FormData()
    formData.append("type", type)
    formData.append("file", file)

    return apiClient.post<VendorDocument>(API_CONFIG.ENDPOINTS.VENDORS.DOCUMENTS, formData)
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(API_CONFIG.ENDPOINTS.VENDORS.DOCUMENTS, { documentId })
  }

  // Get vendor by ID (public)
  async getVendorById(vendorId: string): Promise<ApiResponse<Vendor>> {
    return apiClient.get<Vendor>(`/vendors/${vendorId}`)
  }

  // Search vendors (public)
  async searchVendors(params: {
    query?: string
    location?: string
    category?: string
    rating?: number
    verified?: boolean
    page?: number
    limit?: number
  }): Promise<
    ApiResponse<{
      vendors: Vendor[]
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
    }>
  > {
    return apiClient.get("/vendors/search", params)
  }

  // Get vendor reviews
  async getVendorReviews(
    vendorId: string,
    params?: {
      page?: number
      limit?: number
      rating?: number
    },
  ): Promise<
    ApiResponse<{
      reviews: Array<{
        id: string
        customerId: string
        customerName: string
        rating: number
        comment: string
        createdAt: string
      }>
      pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
      }
      averageRating: number
    }>
  > {
    return apiClient.get(`/vendors/${vendorId}/reviews`, params)
  }

  // Update vendor settings
  async updateSettings(settings: {
    notifications?: {
      email: boolean
      sms: boolean
      push: boolean
    }
    business?: {
      autoAcceptOrders: boolean
      processingTime: number
      minimumOrder: number
    }
    shipping?: {
      freeShippingThreshold: number
      shippingZones: string[]
    }
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put("/vendors/settings", settings)
  }

  // Get vendor settings
  async getSettings(): Promise<
    ApiResponse<{
      notifications: {
        email: boolean
        sms: boolean
        push: boolean
      }
      business: {
        autoAcceptOrders: boolean
        processingTime: number
        minimumOrder: number
      }
      shipping: {
        freeShippingThreshold: number
        shippingZones: string[]
      }
    }>
  > {
    return apiClient.get("/vendors/settings")
  }
}

// Export singleton instance
export const vendorService = new VendorService()
