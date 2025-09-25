"use client"

import { useState, useEffect, useCallback } from "react"
import { orderService, type OrderListParams, type OrderListResponse } from "@/lib/services/order-service"
import type { Order } from "@/lib/api-types"
import { useToast } from "./use-toast"

interface UseOrdersReturn {
  orders: Order[]
  pagination: OrderListResponse["pagination"] | null
  summary: OrderListResponse["summary"] | null
  isLoading: boolean
  error: string | null
  loadOrders: (params: OrderListParams) => Promise<void>
  loadMore: () => Promise<void>
  refreshOrders: () => Promise<void>
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>
  cancelOrder: (orderId: string, reason?: string) => Promise<boolean>
}

export function useOrders(
  initialParams: OrderListParams = {},
  userType: "customer" | "vendor" = "customer",
): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<OrderListResponse["pagination"] | null>(null)
  const [summary, setSummary] = useState<OrderListResponse["summary"] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentParams, setCurrentParams] = useState<OrderListParams>(initialParams)
  const { toast } = useToast()

  const loadOrders = useCallback(
    async (params: OrderListParams) => {
      setIsLoading(true)
      setError(null)

      try {
        let response
        if (userType === "vendor") {
          response = await orderService.getVendorOrders(params)
        } else {
          response = await orderService.getCustomerOrders(params)
        }

        if (response.success && response.data) {
          setOrders(response.data.orders)
          setPagination(response.data.pagination)
          setSummary(response.data.summary)
          setCurrentParams(params)
        } else {
          setError(response.message || "Failed to load orders")
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading orders")
      } finally {
        setIsLoading(false)
      }
    },
    [userType],
  )

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page >= pagination.totalPages || isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const nextPage = pagination.page + 1
      let response
      if (userType === "vendor") {
        response = await orderService.getVendorOrders({
          ...currentParams,
          page: nextPage,
        })
      } else {
        response = await orderService.getCustomerOrders({
          ...currentParams,
          page: nextPage,
        })
      }

        if (response.success && response.data) {
            setOrders((prev) => [...prev, ...(response.data?.orders ?? [])])
            setPagination(response.data?.pagination ?? null)
        }
    } catch (err: any) {
      toast({
        title: "Failed to load more orders",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [pagination, currentParams, isLoading, userType, toast])

  const refreshOrders = useCallback(async () => {
    await loadOrders(currentParams)
  }, [loadOrders, currentParams])

  const updateOrderStatus = useCallback(
    async (orderId: string, status: string): Promise<boolean> => {
      try {
        const response = await orderService.updateOrderStatus(orderId, { status: status as any })

        if (response.success && response.data) {
          // Update the order in the local state
          setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: status as any } : order)))

          toast({
            title: "Order updated",
            description: `Order status has been updated to ${status}.`,
          })
          return true
        } else {
          toast({
            title: "Update failed",
            description: response.message || "Failed to update order status",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message || "An error occurred while updating order",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string): Promise<boolean> => {
      try {
        const response = await orderService.cancelOrder(orderId, reason)

        if (response.success) {
          // Update the order in the local state
          setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)))

          toast({
            title: "Order cancelled",
            description: "The order has been successfully cancelled.",
          })
          return true
        } else {
          toast({
            title: "Cancellation failed",
            description: response.message || "Failed to cancel order",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Cancellation failed",
          description: err.message || "An error occurred while cancelling order",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  // Load initial orders
  useEffect(() => {
    loadOrders(initialParams)
  }, []) // Only run on mount

  return {
    orders,
    pagination,
    summary,
    isLoading,
    error,
    loadOrders,
    loadMore,
    refreshOrders,
    updateOrderStatus,
    cancelOrder,
  }
}

// Hook for managing a single order
interface UseOrderReturn {
  order: Order | null
  isLoading: boolean
  error: string | null
  updateStatus: (status: string) => Promise<boolean>
  cancelOrder: (reason?: string) => Promise<boolean>
  markAsShipped: (trackingNumber: string, carrier?: string) => Promise<boolean>
  markAsDelivered: () => Promise<boolean>
  refreshOrder: () => Promise<void>
}

export function useOrder(orderId: string): UseOrderReturn {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const refreshOrder = useCallback(async () => {
    if (!orderId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await orderService.getOrder(orderId)

      if (response.success && response.data) {
        setOrder(response.data)
      } else {
        setError(response.message || "Failed to load order")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading order")
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  const updateStatus = useCallback(
    async (status: string): Promise<boolean> => {
      if (!orderId) return false

      try {
        const response = await orderService.updateOrderStatus(orderId, { status: status as any })

        if (response.success && response.data) {
          setOrder(response.data)
          toast({
            title: "Order updated",
            description: `Order status has been updated to ${status}.`,
          })
          return true
        } else {
          toast({
            title: "Update failed",
            description: response.message || "Failed to update order status",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message || "An error occurred while updating order",
          variant: "destructive",
        })
        return false
      }
    },
    [orderId, toast],
  )

  const cancelOrder = useCallback(
    async (reason?: string): Promise<boolean> => {
      if (!orderId) return false

      try {
        const response = await orderService.cancelOrder(orderId, reason)

        if (response.success) {
          await refreshOrder() // Refresh to get updated order
          toast({
            title: "Order cancelled",
            description: "The order has been successfully cancelled.",
          })
          return true
        } else {
          toast({
            title: "Cancellation failed",
            description: response.message || "Failed to cancel order",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Cancellation failed",
          description: err.message || "An error occurred while cancelling order",
          variant: "destructive",
        })
        return false
      }
    },
    [orderId, toast, refreshOrder],
  )

  const markAsShipped = useCallback(
    async (trackingNumber: string, carrier?: string): Promise<boolean> => {
      if (!orderId) return false

      try {
        const response = await orderService.markOrderShipped(orderId, trackingNumber, carrier)

        if (response.success && response.data) {
          setOrder(response.data)
          toast({
            title: "Order shipped",
            description: "The order has been marked as shipped.",
          })
          return true
        } else {
          toast({
            title: "Update failed",
            description: response.message || "Failed to mark order as shipped",
            variant: "destructive",
          })
          return false
        }
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message || "An error occurred while updating order",
          variant: "destructive",
        })
        return false
      }
    },
    [orderId, toast],
  )

  const markAsDelivered = useCallback(async (): Promise<boolean> => {
    if (!orderId) return false

    try {
      const response = await orderService.markOrderDelivered(orderId)

      if (response.success && response.data) {
        setOrder(response.data)
        toast({
          title: "Order delivered",
          description: "The order has been marked as delivered.",
        })
        return true
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to mark order as delivered",
          variant: "destructive",
        })
        return false
      }
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "An error occurred while updating order",
        variant: "destructive",
      })
      return false
    }
  }, [orderId, toast])

  // Load order on mount
  useEffect(() => {
    if (orderId) {
      refreshOrder()
    }
  }, [orderId, refreshOrder])

  return {
    order,
    isLoading,
    error,
    updateStatus,
    cancelOrder,
    markAsShipped,
    markAsDelivered,
    refreshOrder,
  }
}
