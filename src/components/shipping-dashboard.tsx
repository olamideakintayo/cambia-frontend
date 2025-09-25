"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Package, Camera, CheckCircle, X, AlertTriangle, Clock, MapPin } from "lucide-react"

const pendingVerifications = [
  {
    id: "ORD-001",
    product: "Authentic Jollof Rice with Chicken",
    vendor: "Mama Kemi's Kitchen",
    vendorLocation: "Lagos State",
    customer: "Sarah Johnson",
    customerLocation: "London, UK",
    orderValue: 15000,
    escrowStatus: "locked",
    orderDate: "Dec 20, 2024",
    expectedPickup: "Dec 22, 2024",
    specialInstructions: "Keep refrigerated. Customer is allergic to shellfish - ensure no cross-contamination.",
    productImage: "/jollof-rice-with-chicken.jpg",
    orderDetails: {
      quantity: 1,
      serves: "4-6 people",
      packaging: "Vacuum-sealed container with ice packs",
      weight: "2.5kg estimated",
    },
    verificationChecklist: [
      "Product matches order description",
      "Proper packaging for international shipping",
      "Temperature requirements met",
      "No allergen contamination",
      "Correct quantity/portion size",
      "Vendor contact information included",
    ],
  },
  {
    id: "ORD-002",
    product: "Homemade Egusi Soup with Assorted Meat",
    vendor: "Aunty Bisi Foods",
    vendorLocation: "Ogun State",
    customer: "Michael Chen",
    customerLocation: "Toronto, Canada",
    orderValue: 12000,
    escrowStatus: "locked",
    orderDate: "Dec 21, 2024",
    expectedPickup: "Dec 23, 2024",
    specialInstructions: "Customer prefers mild spice level. Include heating instructions.",
    productImage: "/egusi-soup-nigerian.jpg",
    orderDetails: {
      quantity: 1,
      serves: "3-4 people",
      packaging: "Leak-proof containers with dry ice",
      weight: "2.0kg estimated",
    },
    verificationChecklist: [
      "Product matches order description",
      "Proper packaging for international shipping",
      "Temperature requirements met",
      "Spice level as requested",
      "Correct quantity/portion size",
      "Heating instructions included",
    ],
  },
]

export function ShippingDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})

  const handleVerificationComplete = (orderId: string, approved: boolean) => {
    // In real app, this would update the order status and notify relevant parties
    console.log(`Order ${orderId} ${approved ? "approved" : "rejected"} for shipping`)
  }

  const toggleChecklistItem = (orderId: string, item: string) => {
    const key = `${orderId}-${item}`
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {pendingVerifications.map((order) => (
          <Card key={order.id} className="border-l-4 border-l-warning">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <Badge className="bg-warning text-warning-foreground">Pending Verification</Badge>
                    <Badge variant="outline">₦{order.orderValue.toLocaleString()} Escrowed</Badge>
                  </div>
                  <CardDescription className="text-base font-medium">{order.product}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {order.vendor} • {order.vendorLocation}
                      </span>
                    </div>
                    <span>→</span>
                    <span>
                      {order.customer} • {order.customerLocation}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <p>Ordered: {order.orderDate}</p>
                  <p>Pickup: {order.expectedPickup}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Order Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span>{order.orderDetails.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Serves:</span>
                      <span>{order.orderDetails.serves}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Weight:</span>
                      <span>{order.orderDetails.weight}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Packaging:</span>
                      <span className="text-right">{order.orderDetails.packaging}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Special Instructions</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{order.specialInstructions}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Verification Checklist</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {order.verificationChecklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${order.id}-${item}`}
                        checked={checkedItems[`${order.id}-${item}`] || false}
                        onCheckedChange={() => toggleChecklistItem(order.id, item)}
                      />
                      <Label htmlFor={`${order.id}-${item}`} className="text-sm cursor-pointer">
                        {item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-1" />
                        View Product Photos
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Product Verification Photos</DialogTitle>
                        <DialogDescription>Compare the actual product with the order specifications</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-2">Order Reference</h4>
                          <img
                            src={order.productImage || "/placeholder.svg"}
                            alt="Order reference"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Actual Product (Upload Required)</h4>
                          <div className="w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <Camera className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">Upload verification photo</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm">
                    Contact Vendor
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Customer
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Order for Shipping</DialogTitle>
                        <DialogDescription>
                          Please provide a reason for rejecting this order. The vendor and customer will be notified.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="rejection-reason">Reason for Rejection</Label>
                          <Textarea
                            id="rejection-reason"
                            placeholder="Explain why this order cannot be shipped (e.g., product doesn't match description, improper packaging, etc.)"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" onClick={() => handleVerificationComplete(order.id, false)}>
                            Confirm Rejection
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve & Ship
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Order for Shipping</DialogTitle>
                        <DialogDescription>
                          Confirm that the product matches the order and is ready for international shipping.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-semibold mb-2">Verification Summary</h4>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">Order:</span> {order.id}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Product:</span> {order.product}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Destination:</span> {order.customerLocation}
                            </p>
                            <p>
                              <span className="text-muted-foreground">Escrow Value:</span> ₦
                              {order.orderValue.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="shipping-notes">Shipping Notes (Optional)</Label>
                          <Textarea
                            id="shipping-notes"
                            placeholder="Add any special handling instructions or notes for the shipping process..."
                            rows={3}
                            value={verificationNotes}
                            onChange={(e) => setVerificationNotes(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline">Cancel</Button>
                          <Button
                            className="bg-success text-success-foreground hover:bg-success/90"
                            onClick={() => handleVerificationComplete(order.id, true)}
                          >
                            Confirm & Start Shipping
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common shipping partner tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="justify-start bg-transparent">
              <Package className="h-4 w-4 mr-2" />
              Bulk Verification
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Pickups
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            <Button variant="outline" className="justify-start bg-transparent">
              <CheckCircle className="h-4 w-4 mr-2" />
              Update Delivery Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
