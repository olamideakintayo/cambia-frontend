"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Eye, Edit, Trash2, TrendingUp, Clock, CheckCircle } from "lucide-react"

const mockProducts = [
  {
    id: 1,
    name: "Authentic Jollof Rice with Chicken",
    category: "Rice Dishes",
    state: "Lagos",
    price: 15000,
    status: "active",
    orders: 23,
    rating: 4.8,
    image: "/jollof-rice-with-chicken.jpg",
  },
  {
    id: 2,
    name: "Homemade Egusi Soup",
    category: "Soups & Stews",
    state: "Lagos",
    price: 12000,
    status: "active",
    orders: 18,
    rating: 4.9,
    image: "/egusi-soup-nigerian.jpg",
  },
  {
    id: 3,
    name: "Fresh Suya Spice Mix",
    category: "Spices & Seasonings",
    state: "Lagos",
    price: 3500,
    status: "draft",
    orders: 0,
    rating: 0,
    image: "/suya-spice-mix.jpg",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    product: "Jollof Rice with Chicken",
    customer: "Sarah Johnson",
    location: "London, UK",
    amount: 15000,
    status: "confirmed",
    date: "2 hours ago",
  },
  {
    id: "ORD-002",
    product: "Egusi Soup",
    customer: "Michael Chen",
    location: "Toronto, Canada",
    amount: 12000,
    status: "preparing",
    date: "5 hours ago",
  },
  {
    id: "ORD-003",
    product: "Jollof Rice with Chicken",
    customer: "Emma Williams",
    location: "Sydney, Australia",
    amount: 15000,
    status: "shipped",
    date: "1 day ago",
  },
]

export function VendorDashboard() {
  return (
    <div className="space-y-6">
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest orders and product performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.id}</span>
                    <Badge
                      variant={
                        order.status === "confirmed"
                          ? "default"
                          : order.status === "preparing"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {order.status === "confirmed" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {order.status === "preparing" && <Clock className="w-3 h-3 mr-1" />}
                      {order.status === "shipped" && <TrendingUp className="w-3 h-3 mr-1" />}
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.product}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer} • {order.location} • {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₦{order.amount.toLocaleString()}</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    View Order
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Product Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage and track your product listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>{product.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product.category} • {product.state} State
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-semibold">₦{product.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">{product.orders} orders</span>
                    {product.rating > 0 && <span className="text-muted-foreground">⭐ {product.rating}</span>}
                  </div>
                  {product.status === "active" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Monthly Goal</span>
                        <span>{product.orders}/30</span>
                      </div>
                      <Progress value={(product.orders / 30) * 100} className="h-2" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
