// app/dashboard/vendor/transactions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Withdrawal = {
    id: string
    amount: number
    bank: string
    accountNumber: string
    status: "PENDING" | "COMPLETED" | "FAILED"
    date: string
}

export default function VendorTransactions() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🔹 Replace with backend API
        setTimeout(() => {
            setWithdrawals([
                {
                    id: "wd1",
                    amount: 150000,
                    bank: "GTB",
                    accountNumber: "0123456789",
                    status: "COMPLETED",
                    date: "2025-09-20T12:00:00Z",
                },
                {
                    id: "wd2",
                    amount: 50000,
                    bank: "UBA",
                    accountNumber: "0987654321",
                    status: "PENDING",
                    date: "2025-09-22T15:30:00Z",
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const getStatusColor = (status: Withdrawal["status"]) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-500/20 text-green-700"
            case "PENDING":
                return "bg-yellow-500/20 text-yellow-700"
            case "FAILED":
                return "bg-red-500/20 text-red-700"
            default:
                return "bg-muted text-foreground"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold">Withdrawal History</h1>
                <p className="text-muted-foreground">Track your bank payouts</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Withdrawals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : withdrawals.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-6">No withdrawals yet</p>
                        ) : (
                            <ul className="divide-y divide-muted">
                                {withdrawals.map((wd) => (
                                    <li key={wd.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">₦{wd.amount.toLocaleString()} → {wd.bank}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(wd.date).toLocaleString()} • Acc: {wd.accountNumber}
                                            </p>
                                        </div>
                                        <Badge className={`${getStatusColor(wd.status)} text-xs`}>{wd.status}</Badge>
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
