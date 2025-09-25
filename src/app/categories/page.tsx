import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"

const categories = [
  {
    name: "Rice & Grains",
    description: "Premium rice varieties, grains, and cereals",
    productCount: 45,
    image: "/jollof-rice-with-chicken.jpg",
  },
  {
    name: "Soup Mixes",
    description: "Traditional Nigerian soup ingredients and mixes",
    productCount: 32,
    image: "/egusi-soup-nigerian.jpg",
  },
  {
    name: "Spices & Seasonings",
    description: "Authentic Nigerian spices and seasoning blends",
    productCount: 67,
    image: "/suya-spice-mix.jpg",
  },
  {
    name: "Vegetables",
    description: "Fresh and dried Nigerian vegetables",
    productCount: 28,
    image: "/dried-bitter-leaf-package.jpg",
  },
  {
    name: "Oils & Fats",
    description: "Palm oil, groundnut oil, and other cooking oils",
    productCount: 19,
    image: "/palm-oil-bottle.jpg",
  },
  {
    name: "Flour & Starches",
    description: "Yam flour, cassava flour, and other starches",
    productCount: 24,
    image: "/yam-flour-package.jpg",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Product Categories</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <Badge className="absolute top-4 right-4">{category.productCount} products</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <Button className="w-full" asChild>
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>Browse {category.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
