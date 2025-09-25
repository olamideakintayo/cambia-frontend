import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, ShoppingCart, CreditCard, Package, CheckCircle, Star } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Discover",
      description: "Explore authentic Nigerian products from verified vendors across all 36 states and FCT.",
      details: [
        "Search by product, vendor, or state",
        "Filter by categories and price",
        "Read reviews from other diaspora customers",
      ],
    },
    {
      icon: ShoppingCart,
      title: "Add to Cart",
      description: "Select your favorite products and add them to your cart for easy checkout.",
      details: [
        "Compare products from different vendors",
        "Check shipping costs to your location",
        "Save items for later purchase",
      ],
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Your payment is secured in a smart contract escrow until delivery is confirmed.",
      details: [
        "Multiple payment options available",
        "Funds held securely in blockchain escrow",
        "No payment released until you confirm delivery",
      ],
    },
    {
      icon: Package,
      title: "Vendor Preparation",
      description: "Vendors prepare your order with care and coordinate with shipping partners.",
      details: [
        "Vendors package items according to international shipping standards",
        "Quality checks performed before handover",
        "Real-time updates on preparation status",
      ],
    },
    {
      icon: CheckCircle,
      title: "Shipping Verification",
      description: "Our trusted shipping partners verify product quality before international delivery.",
      details: [
        "Products inspected against order specifications",
        "Quality and authenticity verified",
        "Secure packaging for international transit",
      ],
    },
    {
      icon: Star,
      title: "Delivery & Review",
      description: "Receive your order and confirm delivery to release payment to the vendor.",
      details: [
        "Track your package throughout delivery",
        "Confirm receipt to release escrow payment",
        "Rate and review your experience",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">How Cambia Works</h1>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            Simple & Secure Process
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">From Nigerian Vendors to Your Doorstep</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the taste of home with complete peace of mind. Our blockchain-secured platform ensures safe
            transactions and authentic products every time.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <CardHeader className="lg:p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">Step {index + 1}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-4">{step.title}</CardTitle>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardHeader>
                <CardContent className="lg:p-8 bg-muted/30 flex items-center justify-center">
                  <div className="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
                    <step.icon className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 mt-16 py-16 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-bold">Ready to Start Shopping?</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join thousands of diaspora customers who trust Cambia for authentic Nigerian products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
