import { Navigation } from "@/components/navigation"
import { SmartContractStatus } from "@/components/smart-contract-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Clock, CheckCircle, AlertTriangle } from "lucide-react"

const mockOrders = [
  {
    id: "ORD-001",
    product: "Authentic Jollof Rice with Chicken",
    vendor: "Mama Kemi's Kitchen",
    amount: 15000,
    status: "delivered" as const,
    orderDate: "Dec 20, 2024",
    estimatedRelease: "Dec 28, 2024",
    image: "/jollof-rice-with-chicken.jpg",
  },
  {
    id: "ORD-002",
    product: "Homemade Egusi Soup",
    vendor: "Aunty Bisi Foods",
    amount: 12000,
    status: "shipping" as const,
    orderDate: "Dec 21, 2024",
    estimatedRelease: "Dec 30, 2024",
    image: "/egusi-soup-nigerian.jpg",
  },
  {
    id: "ORD-003",
    product: "Premium Suya Spice Mix",
    vendor: "Northern Spices Co.",
    amount: 3500,
    status: "escrowed" as const,
    orderDate: "Dec 22, 2024",
    estimatedRelease: "Dec 29, 2024",
    image: "/suya-spice-mix.jpg",
  },
    {
        id: "ORD-003",
        product: "Premium Suya Spice Mix",
        vendor: "Northern Spices Co.",
        amount: 3500,
        status: "released" as const,
        orderDate: "Dec 22, 2024",
        estimatedRelease: "Dec 29, 2024",
        image: "/suya-spice-mix.jpg",
    },
]

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track your orders and smart contract payment status</p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Escrowed Funds</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦30,500</div>
                <p className="text-xs text-muted-foreground">Locked in smart contracts</p>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              {mockOrders
                .filter((order) => order.status !== "released")
                .map((order) => (
                  <div key={order.id} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt={order.product}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{order.product}</CardTitle>
                              <CardDescription>{order.vendor}</CardDescription>
                              <p className="text-sm text-muted-foreground mt-1">Ordered: {order.orderDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">₦{order.amount.toLocaleString()}</p>
                            <Badge
                              variant={
                                order.status === "delivered"
                                  ? "default"
                                  : order.status === "shipping"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    <SmartContractStatus
                      orderId={order.id}
                      paymentAmount={order.amount}
                      status={order.status}
                      createdAt={order.orderDate}
                      estimatedRelease={order.estimatedRelease}
                    />
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Completed Orders Yet</h3>
                <p className="text-muted-foreground">
                  Your completed orders will appear here once you confirm delivery and payments are released.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="all" className="space-y-6">
              {mockOrders.map((order) => (
                <div key={order.id} className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <img
                            src={order.image || "/placeholder.svg"}
                            alt={order.product}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <CardTitle className="text-lg">{order.product}</CardTitle>
                            <CardDescription>{order.vendor}</CardDescription>
                            <p className="text-sm text-muted-foreground mt-1">Ordered: {order.orderDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₦{order.amount.toLocaleString()}</p>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "shipping"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <SmartContractStatus
                    orderId={order.id}
                    paymentAmount={order.amount}
                    status={order.status}
                    createdAt={order.orderDate}
                    estimatedRelease={order.estimatedRelease}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
