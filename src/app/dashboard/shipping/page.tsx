// app/dashboard/shipping/page.tsx
"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ShippingDashboard() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Shipping Partner Dashboard</h1>
                <p className="text-muted-foreground">Manage deliveries and payouts</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <Button onClick={() => router.push("/dashboard/shipping/deliveries")}>
                            Assigned Deliveries
                        </Button>
                        <Button variant="outline" onClick={() => router.push("/dashboard/shipping/payouts")}>
                            Payout History
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
