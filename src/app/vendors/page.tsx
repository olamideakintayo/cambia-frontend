import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Package, TrendingUp, Users, DollarSign, Bell, Eye } from "lucide-react"
import Link from "next/link"
import { VendorProductForm } from "@/components/vendor-product-form"
import { VendorDashboard } from "@/components/vendor-dashboard"

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your products and connect with diaspora customers worldwide
              </p>
            </div>
            <Button asChild>
              <Link href="/vendors/add-product">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+4 from yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">+12 from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue (Escrow)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦450,000</div>
                <p className="text-xs text-muted-foreground">Pending delivery confirmation</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <VendorDashboard />
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Your Products</h2>
                <Button asChild>
                  <Link href="/vendors/add-product">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              </div>
              <VendorProductForm />
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((order) => (
                  <Card key={order}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Order #{order}234</CardTitle>
                        <Badge className="bg-warning text-warning-foreground">Payment Escrowed</Badge>
                      </div>
                      <CardDescription>Jollof Rice with Chicken - Lagos State</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Customer: John Doe (UK)</p>
                          <p className="text-sm text-muted-foreground">Amount: ₦15,000</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
              <div className="grid gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <CardTitle className="text-lg">New Order Received</CardTitle>
                      <Badge variant="secondary">2 min ago</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      You have received a new order for Egusi Soup from a customer in Canada. Payment of ₦12,000 has
                      been secured in smart contract escrow.
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm">Accept Order</Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-success" />
                      <CardTitle className="text-lg">Payment Released</CardTitle>
                      <Badge variant="secondary">1 hour ago</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Customer confirmed delivery of Order #1233. Payment of ₦18,500 has been released from escrow to
                      your account.
                    </p>
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
