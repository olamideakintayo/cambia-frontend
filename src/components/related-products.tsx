import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, ShoppingCart } from "lucide-react"
import Link from "next/link"

const relatedProducts = [
  {
    id: 2,
    name: "Homemade Egusi Soup",
    vendor: "Aunty Bisi Foods",
    state: "Ogun",
    price: 12000,
    rating: 4.9,
    category: "Soups & Stews",
    image: "/egusi-soup-nigerian.jpg",
  },
  {
    id: 4,
    name: "Fresh Pounded Yam with Egusi",
    vendor: "Yoruba Delights",
    state: "Oyo",
    price: 18000,
    rating: 4.6,
    category: "Swallow Foods",
    image: "/pounded-yam-egusi.jpg",
  },
  {
    id: 5,
    name: "Pepper Soup with Fresh Fish",
    vendor: "Delta Fresh Foods",
    state: "Delta",
    price: 14000,
    rating: 4.8,
    category: "Soups & Stews",
    image: "/pepper-soup-fish.jpg",
  },
]

export function RelatedProducts() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">You Might Also Like</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {product.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">{product.vendor}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{product.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">₦{product.price.toLocaleString()}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/marketplace/product/${product.id}`}>View</Link>
                  </Button>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
