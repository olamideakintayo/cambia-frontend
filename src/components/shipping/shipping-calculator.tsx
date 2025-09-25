"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Truck, Clock, Package, Calculator, Loader2 } from "lucide-react"
import { useShipping } from "@/hooks/use-shipping"
import type { ShippingRate } from "@/lib/api-types"

interface ShippingCalculatorProps {
  items?: Array<{
    weight: number
    dimensions?: {
      length: number
      width: number
      height: number
    }
    value: number
  }>
  onRateSelect?: (rate: ShippingRate) => void
}

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
]

export function ShippingCalculator({ items = [], onRateSelect }: ShippingCalculatorProps) {
  const [origin, setOrigin] = useState({
    country: "Nigeria",
    state: "",
    city: "",
    postalCode: "",
  })

  const [destination, setDestination] = useState({
    country: "",
    state: "",
    city: "",
    postalCode: "",
  })

  const [packageInfo, setPackageInfo] = useState({
    weight: "",
    length: "",
    width: "",
    height: "",
    value: "",
  })

  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null)

  const { shippingRates, isLoading, calculateRates } = useShipping()

  const handleCalculate = async () => {
    if (!origin.state || !destination.country || !packageInfo.weight) {
      return
    }

    const calculatedItems =
      items.length > 0
        ? items
        : [
            {
              weight: Number.parseFloat(packageInfo.weight),
              dimensions: packageInfo.length
                ? {
                    length: Number.parseFloat(packageInfo.length),
                    width: Number.parseFloat(packageInfo.width),
                    height: Number.parseFloat(packageInfo.height),
                  }
                : undefined,
              value: Number.parseFloat(packageInfo.value) || 0,
            },
          ]

    await calculateRates({
      origin,
      destination,
      items: calculatedItems,
    })
  }

  const handleRateSelect = (rate: ShippingRate) => {
    setSelectedRate(rate)
    if (onRateSelect) {
      onRateSelect(rate)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Shipping Calculator
          </CardTitle>
          <CardDescription>Calculate shipping rates for your order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Origin */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ship From</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin-state">State</Label>
                <Select
                  value={origin.state}
                  onValueChange={(value) => setOrigin((prev) => ({ ...prev, state: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origin-city">City</Label>
                <Input
                  id="origin-city"
                  placeholder="Enter city"
                  value={origin.city}
                  onChange={(e) => setOrigin((prev) => ({ ...prev, city: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Destination */}
          <div className="space-y-4">
            <h3 className="font-semibold">Ship To</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dest-country">Country</Label>
                <Select
                  value={destination.country}
                  onValueChange={(value) => setDestination((prev) => ({ ...prev, country: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                    <SelectItem value="Ghana">Ghana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dest-state">State/Province</Label>
                <Input
                  id="dest-state"
                  placeholder="Enter state or province"
                  value={destination.state}
                  onChange={(e) => setDestination((prev) => ({ ...prev, state: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dest-city">City</Label>
                <Input
                  id="dest-city"
                  placeholder="Enter city"
                  value={destination.city}
                  onChange={(e) => setDestination((prev) => ({ ...prev, city: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dest-postal">Postal Code</Label>
                <Input
                  id="dest-postal"
                  placeholder="Enter postal code"
                  value={destination.postalCode}
                  onChange={(e) => setDestination((prev) => ({ ...prev, postalCode: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Package Information */}
          {items.length === 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Package Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="2.5"
                      value={packageInfo.weight}
                      onChange={(e) => setPackageInfo((prev) => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Declared Value (₦)</Label>
                    <Input
                      id="value"
                      type="number"
                      placeholder="50000"
                      value={packageInfo.value}
                      onChange={(e) => setPackageInfo((prev) => ({ ...prev, value: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Length (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      placeholder="30"
                      value={packageInfo.length}
                      onChange={(e) => setPackageInfo((prev) => ({ ...prev, length: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="width">Width (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="20"
                      value={packageInfo.width}
                      onChange={(e) => setPackageInfo((prev) => ({ ...prev, width: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="15"
                      value={packageInfo.height}
                      onChange={(e) => setPackageInfo((prev) => ({ ...prev, height: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Button onClick={handleCalculate} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Calculate Shipping Rates
          </Button>
        </CardContent>
      </Card>

      {/* Shipping Rates */}
      {shippingRates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Shipping Options</CardTitle>
            <CardDescription>Choose the best shipping option for your needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {shippingRates.map((rate, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedRate === rate ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => handleRateSelect(rate)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{rate.service}</h4>
                      <p className="text-sm text-muted-foreground">{rate.carrier}</p>
                      <p className="text-sm text-muted-foreground">{rate.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold">₦{rate.cost.toLocaleString()}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{rate.estimatedDays} days</span>
                    </div>
                  </div>
                </div>

                {selectedRate === rate && (
                  <div className="mt-3 pt-3 border-t">
                    <Badge variant="default">Selected</Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Package Summary */}
      {(items.length > 0 || packageInfo.weight) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Package Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total items: {items.length}</p>
                <p className="text-sm text-muted-foreground">
                  Total weight: {items.reduce((sum, item) => sum + item.weight, 0).toFixed(1)} kg
                </p>
                <p className="text-sm text-muted-foreground">
                  Total value: ₦{items.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Weight: {packageInfo.weight} kg</p>
                {packageInfo.length && (
                  <p className="text-sm text-muted-foreground">
                    Dimensions: {packageInfo.length} × {packageInfo.width} × {packageInfo.height} cm
                  </p>
                )}
                {packageInfo.value && (
                  <p className="text-sm text-muted-foreground">
                    Value: ₦{Number.parseFloat(packageInfo.value).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
