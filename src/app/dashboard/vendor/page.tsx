// app/dashboard/vendor/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VendorDashboard() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <p className="text-muted-foreground">Manage your sales and withdrawals</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Wallet Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold">₦250,000</p>
                            <p className="text-muted-foreground text-sm">cNGN (Naira stablecoin)</p>
                        </div>
                        <div className="space-x-2">
                            <Button onClick={() => router.push("/dashboard/vendor/withdraw")}>Withdraw</Button>
                            <Button variant="outline" onClick={() => router.push("/dashboard/vendor/transactions")}>
                                Transactions
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
