import { apiClient, type ApiResponse } from "../api-client"
import { API_CONFIG } from "../api-config"
import type { Order, OrderCreateRequest, Address } from "../api-types"

export interface OrderUpdateRequest {
  status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  trackingNumber?: string
  estimatedDelivery?: string
  notes?: string
}

export interface OrderListParams {
  status?: string
  startDate?: string
  endDate?: string
  customerId?: string
  vendorId?: string
  page?: number
  limit?: number
  sortBy?: "date" | "amount" | "status"
  sortOrder?: "asc" | "desc"
}

export interface OrderListResponse {
  orders: Order[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  summary: {
    totalOrders: number
    totalAmount: number
    statusCounts: Record<string, number>
  }
}

export interface OrderTrackingResponse {
  order: Order
  trackingEvents: Array<{
    id: string
    status: string
    description: string
    location?: string
    timestamp: string
  }>
  estimatedDelivery?: string
  currentStatus: string
}

class OrderService {
  // Create new order
  async createOrder(data: OrderCreateRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(API_CONFIG.ENDPOINTS.ORDERS.CREATE, data)
  }

  // Get order by ID
    async getOrder(orderId: string): Promise<ApiResponse<Order>> {
        return apiClient.get<Order>(`${API_CONFIG.ENDPOINTS.ORDERS.GET}/${orderId}`)
    }


  // Update order status
  async updateOrderStatus(orderId: string, data: OrderUpdateRequest): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(API_CONFIG.ENDPOINTS.ORDERS.UPDATE_STATUS, data, { params: { id: orderId } })
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(
      API_CONFIG.ENDPOINTS.ORDERS.CANCEL,
      { reason },
      { params: { id: orderId } },
    )
  }

  // Get orders list
  async getOrders(params: OrderListParams = {}): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.get<OrderListResponse>(API_CONFIG.ENDPOINTS.ORDERS.LIST, params)
  }

  // Get vendor orders
  async getVendorOrders(params: OrderListParams = {}): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.get<OrderListResponse>(API_CONFIG.ENDPOINTS.ORDERS.VENDOR_ORDERS, params)
  }

  // Get customer orders
  async getCustomerOrders(params: OrderListParams = {}): Promise<ApiResponse<OrderListResponse>> {
    return apiClient.get<OrderListResponse>(API_CONFIG.ENDPOINTS.ORDERS.CUSTOMER_ORDERS, params)
  }

  // Get order tracking information
  async getOrderTracking(orderId: string): Promise<ApiResponse<OrderTrackingResponse>> {
    return apiClient.get<OrderTrackingResponse>(`${API_CONFIG.ENDPOINTS.ORDERS.TRACKING}/${orderId}`)
  }

  // Confirm order (vendor action)
  async confirmOrder(orderId: string, estimatedProcessingTime?: number): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/confirm`, { estimatedProcessingTime })
  }

  // Mark order as processing
  async markOrderProcessing(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/processing`)
  }

  // Mark order as shipped
  async markOrderShipped(orderId: string, trackingNumber: string, carrier?: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/shipped`, { trackingNumber, carrier })
  }

  // Mark order as delivered
  async markOrderDelivered(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/delivered`)
  }

  // Request order refund
  async requestRefund(orderId: string, reason: string, amount?: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`/orders/${orderId}/refund`, { reason, amount })
  }

  // Get order invoice
  async getOrderInvoice(orderId: string): Promise<ApiResponse<{ invoiceUrl: string }>> {
    return apiClient.get<{ invoiceUrl: string }>(`/orders/${orderId}/invoice`)
  }

  // Download order invoice PDF
  async downloadOrderInvoice(orderId: string): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/${orderId}/invoice/download`, {
      headers: {
        Authorization: `Bearer ${apiClient.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to download invoice")
    }

    return response.blob()
  }

  // Get order analytics
  async getOrderAnalytics(
    params: {
      period?: "7d" | "30d" | "90d" | "1y"
      vendorId?: string
      customerId?: string
    } = {},
  ): Promise<
    ApiResponse<{
      totalOrders: number
      totalRevenue: number
      averageOrderValue: number
      ordersByStatus: Record<string, number>
      revenueChart: {
        labels: string[]
        data: number[]
      }
      topProducts: Array<{
        productId: string
        productName: string
        orders: number
        revenue: number
      }>
    }>
  > {
    return apiClient.get("/orders/analytics", params)
  }

  // Bulk update orders
  async bulkUpdateOrders(
    orderIds: string[],
    updates: {
      status?: string
      trackingNumber?: string
      notes?: string
    },
  ): Promise<ApiResponse<{ updated: number; message: string }>> {
    return apiClient.patch<{ updated: number; message: string }>("/orders/bulk-update", {
      orderIds,
      updates,
    })
  }

  // Export orders to CSV
  async exportOrders(params: OrderListParams = {}): Promise<Blob> {
    const response = await fetch(`${API_CONFIG.BASE_URL}/orders/export?${new URLSearchParams(params as any)}`, {
      headers: {
        Authorization: `Bearer ${apiClient.getAuthToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to export orders")
    }

    return response.blob()
  }

  // Get order disputes
  async getOrderDisputes(orderId: string): Promise<
    ApiResponse<
      Array<{
        id: string
        type: "quality" | "delivery" | "payment" | "other"
        description: string
        status: "open" | "investigating" | "resolved" | "closed"
        createdAt: string
        resolution?: string
      }>
    >
  > {
    return apiClient.get(`/orders/${orderId}/disputes`)
  }

  // Create order dispute
  async createOrderDispute(
    orderId: string,
    data: {
      type: "quality" | "delivery" | "payment" | "other"
      description: string
      evidence?: File[]
    },
  ): Promise<ApiResponse<{ message: string; disputeId: string }>> {
    if (data.evidence && data.evidence.length > 0) {
      const formData = new FormData()
      formData.append("type", data.type)
      formData.append("description", data.description)

      data.evidence.forEach((file, index) => {
        formData.append(`evidence[${index}]`, file)
      })

      return apiClient.post<{ message: string; disputeId: string }>(`/orders/${orderId}/disputes`, formData)
    }

    return apiClient.post<{ message: string; disputeId: string }>(`/orders/${orderId}/disputes`, {
      type: data.type,
      description: data.description,
    })
  }

  // Update shipping address
  async updateShippingAddress(orderId: string, address: Address): Promise<ApiResponse<Order>> {
    return apiClient.patch<Order>(`/orders/${orderId}/shipping-address`, { address })
  }

  // Calculate order total with shipping
  async calculateOrderTotal(
    items: Array<{ productId: string; quantity: number }>,
    shippingAddress: Address,
  ): Promise<
    ApiResponse<{
      subtotal: number
      shippingCost: number
      tax: number
      total: number
      breakdown: {
        items: Array<{
          productId: string
          name: string
          price: number
          quantity: number
          total: number
        }>
        shipping: {
          method: string
          cost: number
          estimatedDays: number
        }
        taxes: Array<{
          name: string
          rate: number
          amount: number
        }>
      }
    }>
  > {
    return apiClient.post("/orders/calculate-total", { items, shippingAddress })
  }
}

// Export singleton instance
export const orderService = new OrderService()
