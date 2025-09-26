// app/dashboard/shipping/deliveries/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Delivery = {
    id: string
    orderId: string
    sender: string
    recipient: string
    address: string
    status: "PENDING" | "IN_TRANSIT" | "DELIVERED" | "FAILED"
    fee: number
}

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🔹 Replace with backend API
        setTimeout(() => {
            setDeliveries([
                {
                    id: "d1",
                    orderId: "ORD-2025-01",
                    sender: "John Doe",
                    recipient: "Mama Put",
                    address: "24 Ikorodu Rd, Lagos",
                    status: "PENDING",
                    fee: 2000,
                },
                {
                    id: "d2",
                    orderId: "ORD-2025-02",
                    sender: "Chinedu Okafor",
                    recipient: "Naija Foods",
                    address: "12 Allen Ave, Ikeja",
                    status: "IN_TRANSIT",
                    fee: 2500,
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const updateStatus = (id: string, status: Delivery["status"]) => {
        setDeliveries((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status } : d))
        )
    }

    const getStatusColor = (status: Delivery["status"]) => {
        switch (status) {
            case "PENDING":
                return "bg-gray-200 text-gray-800"
            case "IN_TRANSIT":
                return "bg-blue-200 text-blue-800"
            case "DELIVERED":
                return "bg-green-200 text-green-800"
            case "FAILED":
                return "bg-red-200 text-red-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Assigned Deliveries</h1>
                <p className="text-muted-foreground">Track and update order deliveries</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : deliveries.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground">No deliveries assigned yet</p>
                        ) : (
                            <ul className="divide-y divide-muted">
                                {deliveries.map((d) => (
                                    <li key={d.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Order #{d.orderId}</p>
                                            <p className="text-sm text-muted-foreground">
                                                From {d.sender} → {d.recipient}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Address: {d.address}</p>
                                            <p className="text-xs text-muted-foreground">Fee: ₦{d.fee}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge className={`${getStatusColor(d.status)}`}>{d.status}</Badge>
                                            {d.status !== "DELIVERED" && d.status !== "FAILED" && (
                                                <>
                                                    <Button size="sm" onClick={() => updateStatus(d.id, "IN_TRANSIT")}>
                                                        In Transit
                                                    </Button>
                                                    <Button size="sm" onClick={() => updateStatus(d.id, "DELIVERED")}>
                                                        Delivered
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => updateStatus(d.id, "FAILED")}>
                                                        Failed
                                                    </Button>
                                                </>
                                            )}
                                        </div>
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
