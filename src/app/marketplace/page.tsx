import { Navigation } from "@/components/navigation"
import { ProductGrid } from "@/components/product-grid"
import { MarketplaceFilters } from "@/components/marketplace-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Nigerian Food Marketplace</h1>
              <p className="text-muted-foreground">
                Discover authentic Nigerian cuisine from verified vendors across all 36 states
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search for jollof rice, egusi soup, suya..." className="pl-10" />
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar */}
            <div className="space-y-6">
              <MarketplaceFilters />
            </div>

            {/* Products Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Showing 1-24 of 156 products</p>
                <select className="text-sm border rounded-md px-3 py-1 bg-background">
                  <option>Sort by: Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Best Rated</option>
                </select>
              </div>
              <ProductGrid />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
