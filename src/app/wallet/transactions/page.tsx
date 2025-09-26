// app/wallet/transactions/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

type Transaction = {
    id: string
    type: "DEPOSIT" | "CONVERSION" | "PAYMENT"
    amount: number
    currency: "USDC" | "cNGN"
    status: "PENDING" | "COMPLETED" | "FAILED"
    date: string
    description: string
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🔹 Replace with API call to your backend later
        setTimeout(() => {
            setTransactions([
                {
                    id: "tx1",
                    type: "DEPOSIT",
                    amount: 200,
                    currency: "USDC",
                    status: "COMPLETED",
                    date: "2025-09-20T10:00:00Z",
                    description: "USDC deposit from MetaMask",
                },
                {
                    id: "tx2",
                    type: "CONVERSION",
                    amount: 200,
                    currency: "cNGN",
                    status: "COMPLETED",
                    date: "2025-09-20T10:05:00Z",
                    description: "Converted USDC → cNGN",
                },
                {
                    id: "tx3",
                    type: "PAYMENT",
                    amount: 120000,
                    currency: "cNGN",
                    status: "PENDING",
                    date: "2025-09-22T14:30:00Z",
                    description: "Payment to Vendor: Mama Amala Kitchen",
                },
            ])
            setLoading(false)
        }, 800)
    }, [])

    const getStatusColor = (status: Transaction["status"]) => {
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
                <h1 className="text-2xl font-bold">Transaction History</h1>
                <p className="text-muted-foreground">Track all your deposits, conversions, and vendor payments</p>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : transactions.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center py-6">No transactions yet</p>
                        ) : (
                            <ul className="divide-y divide-muted">
                                {transactions.map((tx) => (
                                    <li key={tx.id} className="py-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{tx.description}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(tx.date).toLocaleString()} • {tx.type}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {tx.currency === "USDC" ? "$" : "₦"}
                                                {tx.amount.toLocaleString()} {tx.currency}
                                            </p>
                                            <Badge className={`${getStatusColor(tx.status)} text-xs mt-1`}>{tx.status}</Badge>
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
