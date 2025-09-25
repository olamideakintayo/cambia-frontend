"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { NIGERIAN_STATES, FOOD_CATEGORIES } from "@/lib/constants"

export function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleState = (state: string) => {
    setSelectedStates((prev) => (prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]))
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider value={priceRange} onValueChange={setPriceRange} max={50000} step={1000} className="w-full" />
          <div className="flex items-center justify-between text-sm">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Food Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Food Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {FOOD_CATEGORIES.slice(0, 8).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={category} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* States */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendor Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {["Lagos", "Abuja", "Kano", "Rivers", "Ogun", "Anambra"].map((state) => (
              <Badge
                key={state}
                variant={selectedStates.includes(state) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleState(state)}
              >
                {state}
              </Badge>
            ))}
          </div>
          <details className="text-sm">
            <summary className="cursor-pointer text-primary">View all states</summary>
            <div className="mt-3 space-y-2">
              {NIGERIAN_STATES.slice(6).map((state) => (
                <div key={state} className="flex items-center space-x-2">
                  <Checkbox
                    id={state}
                    checked={selectedStates.includes(state)}
                    onCheckedChange={() => toggleState(state)}
                  />
                  <Label htmlFor={state} className="text-sm font-normal cursor-pointer">
                    {state}
                  </Label>
                </div>
              ))}
            </div>
          </details>
        </CardContent>
      </Card>

      {/* Delivery Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Express Shipping", "Standard Shipping", "Frozen/Refrigerated", "Dry Goods Only"].map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={option} />
              <Label htmlFor={option} className="text-sm font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Vendor Rating */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vendor Rating</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {["4.5+ Stars", "4.0+ Stars", "3.5+ Stars", "3.0+ Stars"].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={rating} />
              <Label htmlFor={rating} className="text-sm font-normal cursor-pointer">
                {rating}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
