import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, ShieldCheck, Star } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    badge: "Secure",
    title: "Trusted Transactions",
    description:
      "We prioritize your security with robust encryption and fraud prevention measures, ensuring every transaction is safe and reliable.",
  },
  {
    icon: Star,
    badge: "Authentic",
    title: "Genuine Products",
    description:
      "Discover a curated selection of authentic Nigerian goods sourced directly from trusted vendors, guaranteeing quality and tradition.",
  },
  {
    icon: Truck,
    badge: "Fast",
    title: "Reliable Delivery",
    description:
      "Get your favorite foods delivered swiftly and safely to your doorstep, no matter where you are in the world.",
  },
]

const FeaturesSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary" className="w-fit mx-auto">
            Why Choose Cambia
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">Built for the Nigerian Diaspora</h2>
          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Experience the taste of home with complete peace of mind. Our platform ensures secure transactions and
            authentic products every time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description ===
                  "Rate and review vendors based on product quality, packaging, and delivery experience to help other diaspora shoppers."
                    ? "Rate and review vendors based on product quality, packaging, and delivery experience to help other shoppers worldwide."
                    : feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
