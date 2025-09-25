"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Package, Truck, CheckCircle, XCircle, Clock, MoreVertical, Eye, Download } from "lucide-react"
import type { Order } from "@/lib/api-types"
import { format } from "date-fns"
import Link from "next/link"

interface OrderCardProps {
  order: Order
  userType: "customer" | "vendor"
  onStatusUpdate?: (orderId: string, status: string) => void
  onCancel?: (orderId: string) => void
  onViewDetails?: (orderId: string) => void
}

export function OrderCard({ order, userType, onStatusUpdate, onCancel, onViewDetails }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
      case "refunded":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "confirmed":
      case "processing":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "cancelled":
      case "refunded":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case "locked":
        return "secondary"
      case "released":
        return "default"
      case "disputed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (onStatusUpdate) {
      setIsUpdating(true)
      await onStatusUpdate(order.id, newStatus)
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel(order.id)
    }
  }

  const canCancel = ["pending", "confirmed"].includes(order.status)
  const canUpdateStatus = userType === "vendor" && ["pending", "confirmed", "processing"].includes(order.status)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <div>
                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(order.status) as any} className="capitalize">
              {order.status.replace("_", " ")}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails?.(order.id)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </DropdownMenuItem>
                {canCancel && (
                  <DropdownMenuItem onClick={handleCancel} className="text-destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Customer/Vendor Info */}
        <div className="flex items-center justify-between text-sm">
          {userType === "vendor" ? (
            <div>
              <span className="text-muted-foreground">Customer: </span>
              <span className="font-medium">
                {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A"}
              </span>
            </div>
          ) : (
            <div>
              <span className="text-muted-foreground">Vendor: </span>
              <span className="font-medium">{order.vendor?.businessName || "N/A"}</span>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Items: </span>
            <span className="font-medium">{order.items.length}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.product?.name || "Product"}</span>
                <span className="text-muted-foreground">x{item.quantity}</span>
              </div>
              <span className="font-medium">₦{item.total.toLocaleString()}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-sm text-muted-foreground">
              +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₦{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping:</span>
            <span>₦{order.shippingCost.toLocaleString()}</span>
          </div>
          {order.tax > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax:</span>
              <span>₦{order.tax.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-semibold">
            <span>Total:</span>
            <span>₦{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment & Escrow Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Payment:</span>
            <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"} className="text-xs">
              {order.paymentStatus}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Escrow:</span>
            <Badge variant={getEscrowStatusColor(order.escrowStatus) as any} className="text-xs">
              {order.escrowStatus}
            </Badge>
          </div>
        </div>

        {/* Tracking Info */}
        {order.trackingNumber && (
          <div className="text-sm">
            <span className="text-muted-foreground">Tracking: </span>
            <Link href={`/orders/${order.id}/tracking`} className="font-medium text-primary hover:underline">
              {order.trackingNumber}
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        {canUpdateStatus && (
          <div className="flex gap-2 pt-2">
            {order.status === "pending" && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={isUpdating}
                className="flex-1"
              >
                Confirm Order
              </Button>
            )}
            {order.status === "confirmed" && (
              <Button
                size="sm"
                onClick={() => handleStatusUpdate("processing")}
                disabled={isUpdating}
                className="flex-1"
              >
                Start Processing
              </Button>
            )}
            {order.status === "processing" && (
              <Button size="sm" onClick={() => handleStatusUpdate("shipped")} disabled={isUpdating} className="flex-1">
                Mark as Shipped
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
