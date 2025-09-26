// app/dashboard/shipping/payouts/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Payout = {
    id: string
    deliveryId: string
    amount: number
    status: "PENDING" | "PAID"
    date: string
}

export default function ShippingPayouts() {
    const [payouts, setPayouts] = useState<Payout[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🔹 Replace with backend API
        setTimeout(() => {
            setPayouts([
                { id: "p1", deliveryId: "d1", amount: 2000, status: "PAID", date: "2025-09-20T12:00:00Z" },
                { id: "p2", deliveryId: "d2", amount: 2500, status: "PENDING", date: "2025-09-22T15:30:00Z" },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const getStatusColor = (status: Payout["status"]) => {
        switch (status) {
            case "PAID":
                return "bg-green-200 text-green-800"
            case "PENDING":
                return "bg-yellow-200 text-yellow-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Payout History</h1>
                <p className="text-muted-foreground">Track earnings from completed deliveries</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Payouts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : payouts.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-6">No payouts yet</p>
                        ) : (
                            <ul className="divide-y divide-muted">
                                {payouts.map((p) => (
                                    <li key={p.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">₦{p.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Delivery #{p.deliveryId} • {new Date(p.date).toLocaleString()}
                                            </p>
                                        </div>
                                        <Badge className={`${getStatusColor(p.status)} text-xs`}>{p.status}</Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
