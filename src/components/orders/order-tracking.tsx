"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, MapPin, Loader2 } from "lucide-react"
import { orderService, type OrderTrackingResponse } from "@/lib/services/order-service"
import { format } from "date-fns"

interface OrderTrackingProps {
  orderId: string
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const [tracking, setTracking] = useState<OrderTrackingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTracking = async () => {
      try {
        setIsLoading(true)
        const response = await orderService.getOrderTracking(orderId)

        if (response.success && response.data) {
          setTracking(response.data)
        } else {
          setError(response.message || "Failed to load tracking information")
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading tracking information")
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      loadTracking()
    }
  }, [orderId])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
      case "confirmed":
        return <Clock className="h-5 w-5" />
      case "processing":
      case "picked_up":
        return <Package className="h-5 w-5" />
      case "shipped":
      case "in_transit":
      case "out_for_delivery":
        return <Truck className="h-5 w-5" />
      case "delivered":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return "text-primary"
    }

    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600"
      case "failed":
      case "cancelled":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (error || !tracking) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">{error || "No tracking information available"}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Order #{tracking.order.orderNumber}</span>
            <Badge variant="default" className="capitalize">
              {tracking.currentStatus.replace("_", " ")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{format(new Date(tracking.order.createdAt), "MMM dd, yyyy")}</p>
            </div>
            {tracking.order.trackingNumber && (
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-medium">{tracking.order.trackingNumber}</p>
              </div>
            )}
            {tracking.estimatedDelivery && (
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">{format(new Date(tracking.estimatedDelivery), "MMM dd, yyyy")}</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground mb-2">Shipping Address</p>
            <div className="text-sm">
              <p className="font-medium">
                {tracking.order.shippingAddress.firstName} {tracking.order.shippingAddress.lastName}
              </p>
              <p>{tracking.order.shippingAddress.street}</p>
              {tracking.order.shippingAddress.street2 && <p>{tracking.order.shippingAddress.street2}</p>}
              <p>
                {tracking.order.shippingAddress.city}, {tracking.order.shippingAddress.state}{" "}
                {tracking.order.shippingAddress.postalCode}
              </p>
              <p>{tracking.order.shippingAddress.country}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tracking.trackingEvents.map((event, index) => {
              const isLatest = index === 0
              const isCompleted = event.status.toLowerCase() === "delivered"

              return (
                <div key={event.id} className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 p-2 rounded-full border-2 ${
                      isLatest
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCompleted
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-muted bg-muted"
                    }`}
                  >
                    {getStatusIcon(event.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-medium ${getStatusColor(event.status, isLatest)}`}>
                        {event.status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h4>
                      <time className="text-sm text-muted-foreground">
                        {format(new Date(event.timestamp), "MMM dd, HH:mm")}
                      </time>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>

                    {event.location && (
                      <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tracking.order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.product?.name || "Product"}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₦{item.total.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">₦{item.price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₦{tracking.order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping:</span>
              <span>₦{tracking.order.shippingCost.toLocaleString()}</span>
            </div>
            {tracking.order.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span>Tax:</span>
                <span>₦{tracking.order.tax.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₦{tracking.order.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
