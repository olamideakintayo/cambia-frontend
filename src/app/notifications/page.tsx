"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, CreditCard, Star, Bell } from "lucide-react"

interface Notification {
  id: string
  type: "order" | "payment" | "review" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: "low" | "medium" | "high"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "order",
      title: "Order Shipped",
      message: "Your order #CM-2024-001 has been shipped and is on its way to you.",
      timestamp: "2 hours ago",
      read: false,
      priority: "high",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Secured",
      message: "Your payment for Jollof Rice Mix has been secured in smart contract escrow.",
      timestamp: "1 day ago",
      read: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "review",
      title: "Review Request",
      message: "Please review your recent purchase from Lagos Spice Co.",
      timestamp: "2 days ago",
      read: true,
      priority: "low",
    },
    {
      id: "4",
      type: "system",
      title: "New Vendor Available",
      message: "Kano Traditional Foods is now available in your area.",
      timestamp: "3 days ago",
      read: true,
      priority: "low",
    },
    {
      id: "5",
      type: "order",
      title: "Order Confirmed",
      message: "Your order #CM-2024-002 has been confirmed by the vendor.",
      timestamp: "4 days ago",
      read: true,
      priority: "medium",
    },
  ])

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="h-5 w-5" />
      case "payment":
        return <CreditCard className="h-5 w-5" />
      case "review":
        return <Star className="h-5 w-5" />
      case "system":
        return <Bell className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const orderNotifications = notifications.filter((n) => n.type === "order")
  const paymentNotifications = notifications.filter((n) => n.type === "payment")
  const systemNotifications = notifications.filter((n) => n.type === "system" || n.type === "review")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold">Notifications</h1>
            {unreadCount > 0 && <Badge variant="destructive">{unreadCount} unread</Badge>}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orderNotifications.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({paymentNotifications.length})</TabsTrigger>
            <TabsTrigger value="system">System ({systemNotifications.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-muted ${getPriorityColor(notification.priority)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                          <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                        <Badge variant="outline" className={`capitalize ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {orderNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-muted text-blue-500">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {paymentNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-muted text-green-500">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            {systemNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-primary/50 bg-primary/5" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 rounded-lg bg-muted text-purple-500">{getIcon(notification.type)}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="text-sm text-muted-foreground">{notification.timestamp}</span>
                      </div>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
