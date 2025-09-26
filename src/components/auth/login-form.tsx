"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { login, error } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const success = await login(formData)
        if (success) {
            router.push("/dashboard")
        }

        setIsLoading(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Sign in to your Cambia account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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
                    </div>

                    {/* Remember Me + Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={formData.remember}
                                onCheckedChange={(checked) =>
                                    setFormData((prev) => ({ ...prev, remember: checked as boolean }))
                                }
                                disabled={isLoading}
                            />
                            <Label htmlFor="remember" className="text-sm">
                                Remember me
                            </Label>
                        </div>
                        <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Backend error */}
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>

                    {/* Link to Register */}
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/auth/register" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
