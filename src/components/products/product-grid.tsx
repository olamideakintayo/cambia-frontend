"use client"

import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import type { Product } from "@/lib/api-types"
import type { ProductListResponse } from "@/lib/services/product-service"

interface ProductGridProps {
  products: Product[]
  pagination: ProductListResponse["pagination"] | null
  isLoading: boolean
  onLoadMore?: () => void
  onAddToCart?: (product: Product) => void
  showVendor?: boolean
  emptyMessage?: string
}

export function ProductGrid({
  products,
  pagination,
  isLoading,
  onLoadMore,
  onAddToCart,
  showVendor = true,
  emptyMessage = "No products found",
}: ProductGridProps) {
  const hasMore = pagination && pagination.page < pagination.totalPages

  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg">{emptyMessage}</div>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search criteria or browse our categories.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showVendor={showVendor} onAddToCart={onAddToCart} />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && onLoadMore && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      )}

      {/* Pagination Info */}
      {pagination && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {products.length} of {pagination.total} products
        </div>
      )}
    </div>
  )
}
