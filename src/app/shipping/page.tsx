import { Navigation } from "@/components/navigation"
import { ShippingDashboard } from "@/components/shipping-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Truck, CheckCircle, Clock, AlertTriangle, Globe } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shipping Partner Dashboard</h1>
              <p className="text-muted-foreground">
                Verify products and manage international deliveries for DiasporaFood
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Partner Settings</Button>
              <Button>New Pickup Request</Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Awaiting product verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Countries Served</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">Active destinations</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="verification" className="space-y-4">
            <TabsList>
              <TabsTrigger value="verification">
                Product Verification
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">8</Badge>
              </TabsTrigger>
              <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
              <TabsTrigger value="delivered">Delivered Orders</TabsTrigger>
              <TabsTrigger value="issues">
                Issues
                <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  2
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verification" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Pending Product Verification</h2>
                <p className="text-sm text-muted-foreground">
                  Verify products match order specifications before shipping
                </p>
              </div>
              <ShippingDashboard />
            </TabsContent>

            <TabsContent value="shipments" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Active Shipments</h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((shipment) => (
                  <Card key={shipment}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Shipment #SH{shipment}234</CardTitle>
                        <Badge className="bg-primary text-primary-foreground">In Transit</Badge>
                      </div>
                      <CardDescription>Jollof Rice & Chicken → London, UK</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tracking Number:</span>
                          <span className="font-mono">DHL123456789{shipment}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Expected Delivery:</span>
                          <span>Dec {25 + shipment}, 2024</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Customer:</span>
                          <span>Sarah Johnson</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                          <Button variant="outline" size="sm">
                            Contact Customer
                          </Button>
                          <Button size="sm">Update Status</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Recently Delivered</h2>
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((delivery) => (
                  <Card key={delivery}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #ORD{delivery}234</CardTitle>
                        <Badge className="bg-success text-success-foreground">Delivered</Badge>
                      </div>
                      <CardDescription>Egusi Soup → Toronto, Canada</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="space-y-1">
                          <p>
                            <span className="text-muted-foreground">Delivered:</span> Dec {20 + delivery}, 2024
                          </p>
                          <p>
                            <span className="text-muted-foreground">Customer:</span> Michael Chen
                          </p>
                          <p>
                            <span className="text-muted-foreground">Payment Status:</span>{" "}
                            <span className="text-success">Released to Vendor</span>
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Issues & Disputes</h2>
              <div className="grid gap-4">
                <Card className="border-destructive/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Product Mismatch - Order #ORD1234
                      </CardTitle>
                      <Badge variant="destructive">High Priority</Badge>
                    </div>
                    <CardDescription>Customer reports product doesn't match order description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">
                        Customer ordered Jollof Rice with Chicken but received Fried Rice. Vendor claims correct product
                        was prepared. Requires investigation.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm">Contact Vendor</Button>
                        <Button variant="outline" size="sm">
                          Contact Customer
                        </Button>
                        <Button variant="outline" size="sm">
                          View Evidence
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-warning/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-warning" />
                        Delayed Shipment - #SH5678
                      </CardTitle>
                      <Badge className="bg-warning text-warning-foreground">Medium Priority</Badge>
                    </div>
                    <CardDescription>Package delayed due to customs inspection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm">
                        Shipment to Australia held at customs for additional inspection. Customer has been notified.
                        Expected delay: 2-3 business days.
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm">Update Customer</Button>
                        <Button variant="outline" size="sm">
                          Contact Customs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
