"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Filter, Star, ShoppingCart } from "lucide-react"

interface Product {
  id: string
  name: string
  vendor: string
  price: number
  rating: number
  reviews: number
  image: string
  state: string
  category: string
  inStock: boolean
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const products: Product[] = [
    {
      id: "1",
      name: "Premium Jollof Rice Mix",
      vendor: "Lagos Spice Co.",
      price: 25.99,
      rating: 4.8,
      reviews: 124,
      image: "/jollof-rice-with-chicken.jpg",
      state: "Lagos",
      category: "Rice & Grains",
      inStock: true,
    },
    {
      id: "2",
      name: "Authentic Egusi Soup Mix",
      vendor: "Kano Traditional Foods",
      price: 18.5,
      rating: 4.6,
      reviews: 89,
      image: "/egusi-soup-nigerian.jpg",
      state: "Kano",
      category: "Soup Mixes",
      inStock: true,
    },
    {
      id: "3",
      name: "Suya Spice Blend",
      vendor: "Abuja Grill Masters",
      price: 12.75,
      rating: 4.9,
      reviews: 156,
      image: "/suya-spice-mix.jpg",
      state: "FCT",
      category: "Spices",
      inStock: true,
    },
    {
      id: "4",
      name: "Dried Bitter Leaf",
      vendor: "Enugu Farm Fresh",
      price: 8.99,
      rating: 4.4,
      reviews: 67,
      image: "/dried-bitter-leaf-package.jpg",
      state: "Enugu",
      category: "Vegetables",
      inStock: false,
    },
    {
      id: "5",
      name: "Palm Oil (1L)",
      vendor: "Rivers State Oils",
      price: 22.0,
      rating: 4.7,
      reviews: 203,
      image: "/palm-oil-bottle.jpg",
      state: "Rivers",
      category: "Oils & Fats",
      inStock: true,
    },
    {
      id: "6",
      name: "Yam Flour (2kg)",
      vendor: "Oyo Farms Direct",
      price: 15.5,
      rating: 4.5,
      reviews: 91,
      image: "/yam-flour-package.jpg",
      state: "Oyo",
      category: "Flour & Starches",
      inStock: true,
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesState = selectedState === "all" || product.state === selectedState
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesState && matchesCategory
  })

  const states = [...new Set(products.map((p) => p.state))].sort()
  const categories = [...new Set(products.map((p) => p.category))].sort()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Browse Products</h1>
          <Badge variant="secondary">{filteredProducts.length} products</Badge>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger>
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {product.vendor}</p>
                  </div>
                  <Badge variant="outline">{product.state}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Button size="sm" disabled={!product.inStock}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
