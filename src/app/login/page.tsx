"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { useAuth, type UserRole } from "@/hooks/use-auth"

export default function LoginPage() {
    const router = useRouter()
    const { login, register, error } = useAuth()

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // form states
    const [loginData, setLoginData] = useState({ email: "", password: "", remember: false })
    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        walletAddress: "",
        phone: "",
        address: "",
        role: "CUSTOMER" as UserRole,
    })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const success = await login(loginData)
        setIsLoading(false)
        if (success) router.push("/dashboard")
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const success = await register(registerData)
        setIsLoading(false)

        if (success) {
            // Switch to login tab
            const loginTab = document.querySelector('[data-value="login"]') as HTMLButtonElement
            if (loginTab) loginTab.click()
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center space-x-2 mb-8">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">C</span>
                        </div>
                        <span className="font-bold text-xl">Cambia</span>
                    </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login" data-value="login">
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    {/* LOGIN TAB */}
                    <TabsContent value="login">
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Welcome back</CardTitle>
                                <CardDescription>Enter your credentials to access your account</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={loginData.password}
                                                onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {error && <p className="text-sm text-destructive">{error}</p>}

                                    <div className="flex items-center justify-between">
                                        <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Sign in
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* REGISTER TAB */}
                    <TabsContent value="register">
                        <Card>
                            <CardHeader className="space-y-1">
                                <CardTitle className="text-2xl">Create account</CardTitle>
                                <CardDescription>Join Cambia to start shopping authentic Nigerian foods</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First name</Label>
                                            <Input
                                                id="firstName"
                                                value={registerData.firstName}
                                                onChange={(e) => setRegisterData((p) => ({ ...p, firstName: e.target.value }))}
                                                placeholder="Enter first name"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last name</Label>
                                            <Input
                                                id="lastName"
                                                value={registerData.lastName}
                                                onChange={(e) => setRegisterData((p) => ({ ...p, lastName: e.target.value }))}
                                                placeholder="Enter last name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registerEmail">Email</Label>
                                        <Input
                                            id="registerEmail"
                                            type="email"
                                            value={registerData.email}
                                            onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="registerPassword">Password</Label>
                                        <Input
                                            id="registerPassword"
                                            type="password"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))}
                                            placeholder="Create a password"
                                            required
                                        />
                                    </div>

                                    {/* Optional: wallet, phone, address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="walletAddress">Wallet Address</Label>
                                        <Input
                                            id="walletAddress"
                                            value={registerData.walletAddress}
                                            onChange={(e) => setRegisterData((p) => ({ ...p, walletAddress: e.target.value }))}
                                            placeholder="Enter your wallet address"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            value={registerData.phone}
                                            onChange={(e) => setRegisterData((p) => ({ ...p, phone: e.target.value }))}
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={registerData.address}
                                            onChange={(e) => setRegisterData((p) => ({ ...p, address: e.target.value }))}
                                            placeholder="Enter your address"
                                        />
                                    </div>

                                    {error && <p className="text-sm text-destructive">{error}</p>}

                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Create account
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
