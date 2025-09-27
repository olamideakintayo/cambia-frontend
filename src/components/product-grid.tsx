"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, ShoppingCart } from "lucide-react"
import Link from "next/link"

const mockProducts = [
  {
    id: 1,
    name: "Garri",
    vendor: "Mama Kemi's place",
    state: "Lagos",
    price: 15000,
    rating: 4.8,
    reviews: 23,
    prepTime: "2-3 days",
    category: "Swallow Foods",
    image: "/garri",
    isVerified: true,
  },
  {
    id: 2,
    name: "Melon seeds",
    vendor: "Aunty Bisi Foods",
    state: "Ogun",
    price: 12000,
    rating: 4.9,
    reviews: 18,
    prepTime: "1-2 days",
    category: "Soups & Stews",
    image: "/egusi-soup-nigerian.jpg",
    isVerified: true,
  },
  {
    id: 3,
    name: "Premium Suya Spice Mix (500g)",
    vendor: "Northern Spices Co.",
    state: "Kano",
    price: 3500,
    rating: 4.7,
    reviews: 45,
    prepTime: "Same day",
    category: "Spices & Seasonings",
    image: "/suya-spice-mix.jpg",
    isVerified: true,
  },
  {
    id: 4,
    name: "Water Yam",
    vendor: "Yoruba Delights",
    state: "Oyo",
    price: 18000,
    rating: 4.6,
    reviews: 12,
    prepTime: "2-3 days",
    category: "Swallow Foods",
    image: "/water-yam.jpg",
    isVerified: false,
  },
  {
    id: 5,
    name: "Stock Fish",
    vendor: "Delta Fresh Foods",
    state: "Delta",
    price: 14000,
    rating: 4.8,
    reviews: 31,
    prepTime: "1-2 days",
    category: "Soups & Stews",
    image: "/pepper-soup-fish.jpg",
    isVerified: true,
  },
  {
    id: 6,
    name: "Beans",
    vendor: "Morning Glory Kitchen",
    state: "Lagos",
    price: 5000,
    rating: 4.5,
    reviews: 67,
    prepTime: "Same day",
    category: "Legumes & Pulses",
    image: "/beans.jpg",
    isVerified: true,
  },
]

export function ProductGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockProducts.map((product) => (
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
              {product.isVerified && (
                <Badge className="absolute top-3 right-3 bg-success text-success-foreground">Verified</Badge>
              )}
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
                <Clock className="h-3 w-3" />
                <span>{product.prepTime}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">₦{product.price.toLocaleString()}</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/marketplace/product/${product.id}`}>View</Link>
                </Button>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
