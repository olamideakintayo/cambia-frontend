"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import type { ProductSearchParams, ProductListResponse } from "@/lib/services/product-service"

interface ProductFiltersProps {
  filters: ProductListResponse["filters"] | null
  currentParams: ProductSearchParams
  onFiltersChange: (params: ProductSearchParams) => void
  onClearFilters: () => void
}

export function ProductFilters({ filters, currentParams, onFiltersChange, onClearFilters }: ProductFiltersProps) {
  const [localParams, setLocalParams] = useState<ProductSearchParams>(currentParams)
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentParams.minPrice || 0,
    currentParams.maxPrice || 100000,
  ])

  useEffect(() => {
    setLocalParams(currentParams)
    setPriceRange([currentParams.minPrice || 0, currentParams.maxPrice || 100000])
  }, [currentParams])

  const handleParamChange = (key: keyof ProductSearchParams, value: any) => {
    const newParams = { ...localParams, [key]: value }
    setLocalParams(newParams)
    onFiltersChange(newParams)
  }

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
    const newParams = {
      ...localParams,
      minPrice: values[0],
      maxPrice: values[1],
    }
    setLocalParams(newParams)
    onFiltersChange(newParams)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (localParams.query) count++
    if (localParams.category) count++
    if (localParams.region) count++
    if (localParams.minPrice || localParams.maxPrice) count++
    if (localParams.inStock) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount}</Badge>}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Query */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name, description..."
            value={localParams.query || ""}
            onChange={(e) => handleParamChange("query", e.target.value)}
          />
        </div>

        {/* Category Filter */}
        {filters?.categories && filters.categories.length > 0 && (
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={localParams.category || "all"}
              onValueChange={(value) => handleParamChange("category", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {filters.categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Region Filter */}
        {filters?.regions && filters.regions.length > 0 && (
          <div className="space-y-2">
            <Label>Region</Label>
            <Select
              value={localParams.region || "all"}
              onValueChange={(value) => handleParamChange("region", value || undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                {filters.regions.map((region) => (
                  <SelectItem key={region.name} value={region.name}>
                    {region.name} ({region.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Price Range */}
        {filters?.priceRange && (
          <div className="space-y-4">
            <Label>Price Range (₦)</Label>
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={filters.priceRange.max}
                min={filters.priceRange.min}
                step={1000}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={localParams.inStock || false}
              onCheckedChange={(checked) => handleParamChange("inStock", checked || undefined)}
            />
            <Label htmlFor="inStock">In stock only</Label>
          </div>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select
            value={`${localParams.sortBy || "newest"}-${localParams.sortOrder || "desc"}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split("-")
              handleParamChange("sortBy", sortBy)
              handleParamChange("sortOrder", sortOrder)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest-desc">Newest first</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Highest rated</SelectItem>
              <SelectItem value="sales-desc">Most popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
