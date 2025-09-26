// app/dashboard/sender/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Package, ShoppingCart, User, Wallet } from "lucide-react"

export default function SenderDashboard() {
    const auth = useAuth()
    const router = useRouter()
    const [balances, setBalances] = useState({
        usdc: 1200, // fetched from backend
        ngn: 350000, // fetched from backend
    })

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
            {/* Top Nav */}
            <header className="flex items-center justify-between px-6 py-4 border-b bg-card shadow-sm">
                <h1 className="text-xl font-bold">Cambia Sender Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                        {auth.user?.firstName} {auth.user?.lastName}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => {
                            auth.logout()
                            router.push("/auth/login")
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
                <h2 className="text-2xl font-semibold">Welcome back, {auth.user?.firstName || "Sender"} 👋</h2>

                {/* Wallet Section */}
                <Card>
                    <CardHeader>
                        <Wallet className="h-6 w-6 text-primary" />
                        <CardTitle>Your Wallet</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg border bg-muted/40">
                                <p className="text-sm text-muted-foreground">USDC Balance</p>
                                <p className="text-xl font-bold">${balances.usdc.toFixed(2)} USDC</p>
                            </div>
                            <div className="p-4 rounded-lg border bg-muted/40">
                                <p className="text-sm text-muted-foreground">Naira Stablecoin Balance</p>
                                <p className="text-xl font-bold">₦{balances.ngn.toLocaleString()} cNGN</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={() => router.push("/wallet/deposit")}>Deposit USDC</Button>
                            <Button variant="outline" onClick={() => router.push("/wallet/transactions")}>
                                View Transactions
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Place Order */}
                    <Card
                        className="hover:shadow-lg transition cursor-pointer"
                        onClick={() => router.push("/orders/new")}
                    >
                        <CardHeader>
                            <Package className="h-6 w-6 text-primary" />
                            <CardTitle>Place New Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Send authentic Nigerian meals & goods to your loved ones.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Track Orders */}
                    <Card
                        className="hover:shadow-lg transition cursor-pointer"
                        onClick={() => router.push("/orders")}
                    >
                        <CardHeader>
                            <ShoppingCart className="h-6 w-6 text-primary" />
                            <CardTitle>Track Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                View all your orders and follow their delivery progress.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Profile */}
                    <Card
                        className="hover:shadow-lg transition cursor-pointer"
                        onClick={() => router.push("/profile")}
                    >
                        <CardHeader>
                            <User className="h-6 w-6 text-primary" />
                            <CardTitle>Profile</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Manage your wallet, address, and personal details.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
