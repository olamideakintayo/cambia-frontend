"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, ShoppingCart, Heart, Share2, Shield, Truck, CheckCircle } from "lucide-react"

interface ProductDetailsProps {
  productId: string
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: 1,
    name: "Authentic Jollof Rice with Chicken",
    vendor: {
      name: "Mama Kemi's Kitchen",
      avatar: "/vendor-avatar.jpg",
      rating: 4.8,
      totalOrders: 156,
      joinedDate: "2023",
      isVerified: true,
    },
    state: "Lagos",
    price: 15000,
    rating: 4.8,
    reviews: 23,
    prepTime: "2-3 days",
    serves: "4-6 people",
    category: "Rice Dishes",
    subcategories: ["Jollof Rice", "Chicken"],
    images: [
      "/jollof-rice-with-chicken.jpg",
      "/jollof-rice-ingredients.jpg",
      "/jollof-rice-cooking.jpg",
      "/jollof-rice-plated.jpg",
    ],
    description: `Experience the authentic taste of Nigerian Jollof Rice prepared with love and traditional spices. This hearty meal features perfectly seasoned rice cooked with fresh tomatoes, peppers, and aromatic spices, served with tender chicken pieces.

Our Jollof Rice is prepared using the traditional Lagos-style method, ensuring that smoky flavor that makes it truly special. Each serving comes with generous portions of well-seasoned chicken, making it a complete meal for your family.

Perfect for special occasions, family dinners, or when you're craving that authentic taste of home. We use only the finest ingredients including premium rice, fresh tomatoes, and carefully selected spices.`,
    ingredients: [
      "Premium Parboiled Rice",
      "Fresh Chicken",
      "Tomatoes",
      "Red Bell Peppers",
      "Onions",
      "Garlic & Ginger",
      "Bay Leaves",
      "Thyme",
      "Curry Powder",
      "Stock Cubes",
      "Palm Oil",
      "Salt & Pepper",
    ],
    nutritionalInfo: {
      calories: "450 per serving",
      protein: "25g",
      carbs: "55g",
      fat: "12g",
    },
    shippingInfo: {
      packaging: "Vacuum-sealed containers with ice packs",
      shelfLife: "3-4 days refrigerated",
      shippingTime: "5-7 business days international",
      temperature: "Keep refrigerated",
    },
  }

  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      location: "London, UK",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Absolutely amazing! Tastes just like my grandmother's jollof rice. The chicken was perfectly seasoned and the rice had that authentic smoky flavor. Will definitely order again!",
      verified: true,
    },
    {
      id: 2,
      user: "Michael Chen",
      location: "Toronto, Canada",
      rating: 5,
      date: "1 month ago",
      comment:
        "Best Nigerian food I've had outside of Nigeria. The packaging was excellent and everything arrived fresh. Mama Kemi knows what she's doing!",
      verified: true,
    },
    {
      id: 3,
      user: "Emma Williams",
      location: "Sydney, Australia",
      rating: 4,
      date: "1 month ago",
      comment:
        "Really good jollof rice! Maybe a bit less spicy next time, but the flavor was authentic. Great portion size too.",
      verified: true,
    },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg border">
          <img
            src={product.images[selectedImage] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 ${
                selectedImage === index ? "border-primary" : "border-transparent"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${product.name} ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.subcategories.map((sub) => (
              <Badge key={sub} variant="outline">
                {sub}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{product.state} State</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{product.prepTime} prep</span>
            </div>
            <span>Serves {product.serves}</span>
          </div>
        </div>

        {/* Vendor Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={product.vendor.avatar || "/placeholder.svg"} />
                <AvatarFallback>{product.vendor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{product.vendor.name}</h3>
                  {product.vendor.isVerified && <CheckCircle className="h-4 w-4 text-success" />}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{product.vendor.rating}</span>
                  </div>
                  <span>{product.vendor.totalOrders} orders</span>
                  <span>Since {product.vendor.joinedDate}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">{product.rating}</span>
          </div>
          <span className="text-muted-foreground">({product.reviews} reviews)</span>
        </div>

        {/* Price and Actions */}
        <div className="space-y-4">
          <div className="text-3xl font-bold">₦{product.price.toLocaleString()}</div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 border rounded-md min-w-[60px] text-center">{quantity}</span>
            <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
              +
            </Button>
          </div>

          <div className="flex gap-3">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart - ₦{(product.price * quantity).toLocaleString()}
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Security Notice */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm">Secure Payment with Smart Contract Escrow</h4>
                  <p className="text-sm text-muted-foreground">
                    Your payment is protected by blockchain escrow. Funds are only released to the vendor after you
                    confirm delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Shipping Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">International Shipping Available</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Preparation: {product.prepTime}</p>
                  <p>• Shipping: 5-7 business days worldwide</p>
                  <p>• Packaging: Vacuum-sealed with ice packs</p>
                  <p>• Shelf life: 3-4 days refrigerated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for additional info */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {product.description.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="space-y-4">
            <div className="grid gap-2">
              {product.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>{ingredient}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{review.user}</span>
                          <span className="text-xs text-muted-foreground">{review.location}</span>
                          {review.verified && <CheckCircle className="h-3 w-3 text-success" />}
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3 w-3 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
