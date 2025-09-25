"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, MapPin } from "lucide-react"
import type { Product } from "@/lib/api-types"
import { productService } from "@/lib/services/product-service"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  showVendor?: boolean
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, showVendor = true, onAddToCart }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsLoading(true)

    try {
      if (isWishlisted) {
        await productService.removeFromWishlist(product.id)
        setIsWishlisted(false)
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        })
      } else {
        await productService.addToWishlist(product.id)
        setIsWishlisted(true)
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (onAddToCart) {
      onAddToCart(product)
    } else {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    }
  }

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0]
  const isOutOfStock = product.stock === 0 || product.status === "out_of_stock"

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={primaryImage?.url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
            disabled={isLoading}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
            {product.status === "draft" && <Badge variant="secondary">Draft</Badge>}
            {product.totalSales > 100 && <Badge variant="default">Popular</Badge>}
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Product Name */}
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>

            {/* Vendor Info */}
            {showVendor && product.vendor && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>by {product.vendor.businessName}</span>
                {product.vendor.verified && (
                  <Badge variant="outline" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
            )}

            {/* Location */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{product.region}</span>
            </div>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.totalReviews})</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">₦{product.price.toLocaleString()}</span>
                {product.weight && <span className="text-sm text-muted-foreground">({product.weight}kg)</span>}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              variant={isOutOfStock ? "secondary" : "default"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
