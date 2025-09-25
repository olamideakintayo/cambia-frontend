import { Navigation } from "@/components/navigation"
import { ProductDetails } from "@/components/product-details"
import { RelatedProducts } from "@/components/related-products"

export default function ProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <ProductDetails productId={params.id} />
        <div className="mt-12">
          <RelatedProducts />
        </div>
      </div>
    </div>
  )
}
