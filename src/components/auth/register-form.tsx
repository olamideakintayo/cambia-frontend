"use client"

import type React from "react"
import { useState } from "react"
import type { UserRole, RegisterRequest } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function RegisterForm() {
    const [formData, setFormData] = useState<
        RegisterRequest & { confirmPassword?: string; acceptTerms?: boolean }
    >({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        walletAddress: "",
        phone: "",
        address: "",
        role: "SENDER",
        confirmPassword: "",
        acceptTerms: false,
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const { register, error } = useAuth()
    const router = useRouter()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "You must accept the terms and conditions"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setIsLoading(true)

        const { confirmPassword, acceptTerms, ...registerData } = formData
        const success = await register(registerData)

        if (success) {
            // redirect by role
            switch (registerData.role) {
                case "SENDER":
                    router.push("/dashboard/sender")
                    break
                case "VENDOR":
                    router.push("/dashboard/vendor")
                    break
                case "SHIPPING_PARTNER":
                    router.push("/dashboard/shipping")
                    break
                default:
                    router.push("/dashboard")
            }
        }

        setIsLoading(false)
    }


    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Join Cambia and start your food journey</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First + Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+234 801 234 5678"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            placeholder="123 Main Street, Lagos"
                            value={formData.address}
                            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2">
                        <Label htmlFor="walletAddress">Wallet Address</Label>
                        <Input
                            id="walletAddress"
                            placeholder="0x1234abcd..."
                            value={formData.walletAddress}
                            onChange={(e) => setFormData((prev) => ({ ...prev, walletAddress: e.target.value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Role Selector */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            value={formData.role}
                            onValueChange={(value: UserRole) =>
                                setFormData((prev) => ({ ...prev, role: value }))
                            }
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SENDER">Sender (Diaspora)</SelectItem>
                                <SelectItem value="VENDOR">Vendor (Nigeria)</SelectItem>
                                <SelectItem value="SHIPPING_PARTNER">Shipping Partner</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                                required
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                                }
                                required
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Terms */}
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="acceptTerms"
                            checked={formData.acceptTerms}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))
                            }
                            disabled={isLoading}
                            className="mt-1"
                        />
                        <Label htmlFor="acceptTerms" className="text-sm leading-5">
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </Link>
                        </Label>
                    </div>
                    {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}

                    {/* Backend error */}
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>

                    {/* Link to Login */}
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
