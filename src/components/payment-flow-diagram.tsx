"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, User, Store, Truck, CheckCircle, Lock, Unlock } from "lucide-react"

export function PaymentFlowDiagram() {
  const steps = [
    {
      id: 1,
      title: "Customer Places Order",
      description: "Diaspora customer selects products and initiates payment",
      icon: User,
      status: "completed",
      details: "Payment deposited into smart contract escrow",
    },
    {
      id: 2,
      title: "Payment Locked in Escrow",
      description: "Smart contract secures funds until delivery confirmation",
      icon: Lock,
      status: "completed",
      details: "Vendor receives order notification with payment guarantee",
    },
    {
      id: 3,
      title: "Vendor Prepares Order",
      description: "Vendor receives notification and prepares the food product",
      icon: Store,
      status: "completed",
      details: "Product prepared according to order specifications",
    },
    {
      id: 4,
      title: "Shipping Verification",
      description: "Shipping partner verifies product matches order",
      icon: Truck,
      status: "in-progress",
      details: "Quality check ensures customer receives correct product",
    },
    {
      id: 5,
      title: "International Shipping",
      description: "Product shipped to diaspora customer worldwide",
      icon: Truck,
      status: "pending",
      details: "Tracked shipping with temperature control for food safety",
    },
    {
      id: 6,
      title: "Customer Confirms Delivery",
      description: "Customer receives product and confirms satisfaction",
      icon: CheckCircle,
      status: "pending",
      details: "Customer has 48 hours to report any issues",
    },
    {
      id: 7,
      title: "Payment Released to Vendor",
      description: "Smart contract automatically releases escrowed funds",
      icon: Unlock,
      status: "pending",
      details: "Vendor receives payment after successful delivery",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground"
      case "in-progress":
        return "bg-primary text-primary-foreground"
      case "pending":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Contract Payment Flow</CardTitle>
        <CardDescription>
          How DiasporaFood's blockchain escrow system protects both customers and vendors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`p-3 rounded-full ${getStatusColor(step.status)}`}>
                  <step.icon className="h-5 w-5" />
                </div>
                {index < steps.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <Badge variant="outline" className={getStatusColor(step.status)}>
                    {step.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <p className="text-xs text-muted-foreground italic">{step.details}</p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-3 hidden md:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2">Key Benefits</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Customer funds are protected until delivery is confirmed</li>
            <li>• Vendors are guaranteed payment for successfully delivered orders</li>
            <li>• Shipping partners ensure quality control before international delivery</li>
            <li>• Transparent blockchain transactions provide full audit trail</li>
            <li>• Automated smart contract execution eliminates payment disputes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
