"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus } from "lucide-react"
import { NIGERIAN_STATES, FOOD_CATEGORIES, FOOD_SUBCATEGORIES } from "@/lib/constants"

export function VendorProductForm() {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory) ? prev.filter((s) => s !== subcategory) : [...prev, subcategory],
    )
  }

  const addImage = () => {
    setImages((prev) => [...prev, `/placeholder.svg?height=200&width=200&query=Nigerian food ${selectedCategory}`])
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>List your authentic Nigerian food products for diaspora customers worldwide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-name">Product Name</Label>
              <Input id="product-name" placeholder="e.g., Homemade Jollof Rice with Chicken" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Food Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {FOOD_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Your State</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedCategory && FOOD_SUBCATEGORIES[selectedCategory as keyof typeof FOOD_SUBCATEGORIES] && (
              <div className="space-y-2">
                <Label>Specific Food Types</Label>
                <div className="flex flex-wrap gap-2">
                  {FOOD_SUBCATEGORIES[selectedCategory as keyof typeof FOOD_SUBCATEGORIES].map((subcategory) => (
                    <Badge
                      key={subcategory}
                      variant={selectedSubcategories.includes(subcategory) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleSubcategoryToggle(subcategory)}
                    >
                      {subcategory}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your food, ingredients, preparation method, and what makes it special..."
                rows={4}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦)</Label>
                <Input id="price" type="number" placeholder="15000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prep-time">Prep Time (days)</Label>
                <Input id="prep-time" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serves">Serves (people)</Label>
                <Input id="serves" type="number" placeholder="4" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid gap-4">
                <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="h-32 border-dashed bg-transparent" onClick={addImage}>
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6" />
                      <span className="text-sm">Add Image</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping-notes">Shipping & Packaging Notes</Label>
              <Textarea
                id="shipping-notes"
                placeholder="Special packaging requirements, shelf life, temperature requirements..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">List Product</Button>
            <Button variant="outline">Save as Draft</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your product will appear to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[0] || "/placeholder.svg"}
                    alt="Product preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p>Add images to see preview</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Product Name</h3>
                <div className="flex gap-2">
                  {selectedCategory && <Badge variant="secondary">{selectedCategory}</Badge>}
                  {selectedSubcategories.slice(0, 2).map((sub) => (
                    <Badge key={sub} variant="outline">
                      {sub}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Product description will appear here...</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₦--,---</span>
                  <span className="text-sm text-muted-foreground">-- days prep</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listing Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>Use high-quality photos showing the actual food you prepare</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>Be specific about ingredients and preparation methods</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>Include packaging and shipping details for international delivery</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <p>Set realistic preparation times to manage customer expectations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
