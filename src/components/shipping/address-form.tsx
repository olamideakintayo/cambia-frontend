"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { useShipping } from "@/hooks/use-shipping"
import type { Address } from "@/lib/api-types"

interface AddressFormProps {
  address?: Partial<Address>
  onAddressChange: (address: Address) => void
  onValidationChange?: (isValid: boolean) => void
  title?: string
  description?: string
  showValidation?: boolean
  required?: boolean
}

const countries = [
  { code: "NG", name: "Nigeria" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ZA", name: "South Africa" },
  { code: "GH", name: "Ghana" },
]

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

export function AddressForm({
  address = {},
  onAddressChange,
  onValidationChange,
  title = "Shipping Address",
  description = "Enter the address where you want your order delivered",
  showValidation = true,
  required = true,
}: AddressFormProps) {
  const [formData, setFormData] = useState<Partial<Address>>({
    firstName: "",
    lastName: "",
    company: "",
    street: "",
    street2: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
    isDefault: false,
    ...address,
  })

  const [validationResult, setValidationResult] = useState<{
    isValid: boolean
    suggestions?: Address[]
    errors?: string[]
    standardized?: Address
  } | null>(null)

  const [isValidating, setIsValidating] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { validateAddress } = useShipping()

  const handleInputChange = (field: keyof Address, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    onAddressChange(newFormData as Address)

    // Clear validation when address changes
    if (validationResult) {
      setValidationResult(null)
      setShowSuggestions(false)
    }
  }

  const handleValidateAddress = async () => {
    if (!formData.street || !formData.city || !formData.country) {
      return
    }

    setIsValidating(true)
    const result = await validateAddress(formData as Address)
    setValidationResult(result)
    setShowSuggestions(!!result.suggestions?.length)
    setIsValidating(false)

    if (onValidationChange) {
      onValidationChange(result.isValid)
    }
  }

  const handleUseSuggestion = (suggestion: Address) => {
    setFormData(suggestion)
    onAddressChange(suggestion)
    setValidationResult({ isValid: true })
    setShowSuggestions(false)

    if (onValidationChange) {
      onValidationChange(true)
    }
  }

  const handleUseStandardized = () => {
    if (validationResult?.standardized) {
      setFormData(validationResult.standardized)
      onAddressChange(validationResult.standardized)
      setValidationResult({ isValid: true })
      setShowSuggestions(false)

      if (onValidationChange) {
        onValidationChange(true)
      }
    }
  }

  // Auto-validate when required fields are filled
  useEffect(() => {
    if (
      showValidation &&
      formData.street &&
      formData.city &&
      formData.country &&
      formData.postalCode &&
      !validationResult &&
      !isValidating
    ) {
      const timer = setTimeout(() => {
        handleValidateAddress()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [formData.street, formData.city, formData.country, formData.postalCode])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name {required && <span className="text-destructive">*</span>}</Label>
            <Input
              id="firstName"
              placeholder="John"
              value={formData.firstName || ""}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              required={required}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name {required && <span className="text-destructive">*</span>}</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              value={formData.lastName || ""}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              required={required}
            />
          </div>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            placeholder="Company name"
            value={formData.company || ""}
            onChange={(e) => handleInputChange("company", e.target.value)}
          />
        </div>

        {/* Address Lines */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address {required && <span className="text-destructive">*</span>}</Label>
            <Input
              id="street"
              placeholder="123 Main Street"
              value={formData.street || ""}
              onChange={(e) => handleInputChange("street", e.target.value)}
              required={required}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street2">Apartment, suite, etc. (Optional)</Label>
            <Input
              id="street2"
              placeholder="Apt 4B"
              value={formData.street2 || ""}
              onChange={(e) => handleInputChange("street2", e.target.value)}
            />
          </div>
        </div>

        {/* City, State, Country */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City {required && <span className="text-destructive">*</span>}</Label>
            <Input
              id="city"
              placeholder="Lagos"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              required={required}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province {required && <span className="text-destructive">*</span>}</Label>
            {formData.country === "Nigeria" ? (
              <Select value={formData.state || ""} onValueChange={(value) => handleInputChange("state", value)}>
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
            ) : (
              <Input
                id="state"
                placeholder="State or Province"
                value={formData.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required={required}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country {required && <span className="text-destructive">*</span>}</Label>
            <Select value={formData.country || ""} onValueChange={(value) => handleInputChange("country", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Postal Code and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              placeholder="100001"
              value={formData.postalCode || ""}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+234 xxx xxx xxxx"
              value={formData.phone || ""}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault || false}
            onCheckedChange={(checked) => handleInputChange("isDefault", checked as boolean)}
          />
          <Label htmlFor="isDefault">Set as default address</Label>
        </div>

        {/* Address Validation */}
        {showValidation && (
          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleValidateAddress}
              disabled={isValidating || !formData.street || !formData.city}
              className="w-full bg-transparent"
            >
              {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Validate Address
            </Button>

            {/* Validation Results */}
            {validationResult && (
              <div className="space-y-3">
                {validationResult.isValid ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Address is valid and ready for shipping.</AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Address validation failed. Please check the details or use one of the suggestions below.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Standardized Address */}
                {validationResult.standardized && (
                  <Alert>
                    <AlertDescription className="space-y-2">
                      <p>We found a standardized version of your address:</p>
                      <div className="text-sm bg-muted p-2 rounded">
                        <p>
                          {validationResult.standardized.street}
                          {validationResult.standardized.street2 && `, ${validationResult.standardized.street2}`}
                        </p>
                        <p>
                          {validationResult.standardized.city}, {validationResult.standardized.state}{" "}
                          {validationResult.standardized.postalCode}
                        </p>
                        <p>{validationResult.standardized.country}</p>
                      </div>
                      <Button size="sm" onClick={handleUseStandardized}>
                        Use Standardized Address
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Address Suggestions */}
                {showSuggestions && validationResult.suggestions && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Did you mean:</p>
                    {validationResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded p-3 space-y-2">
                        <div className="text-sm">
                          <p>
                            {suggestion.street}
                            {suggestion.street2 && `, ${suggestion.street2}`}
                          </p>
                          <p>
                            {suggestion.city}, {suggestion.state} {suggestion.postalCode}
                          </p>
                          <p>{suggestion.country}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleUseSuggestion(suggestion)}>
                          Use This Address
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
