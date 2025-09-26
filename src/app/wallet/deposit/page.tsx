// app/wallet/deposit/page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DepositPage() {
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleDeposit = async () => {
        setIsLoading(true)
        try {
            const res = await fetch("http://localhost:3000/api/wallet/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            })
            if (res.ok) {
                router.push("/dashboard/sender")
            } else {
                console.error("Deposit failed")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Deposit USDC</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="number"
                        placeholder="Enter amount in USDC"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <Button onClick={handleDeposit} disabled={isLoading || !amount}>
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Confirm Deposit
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
