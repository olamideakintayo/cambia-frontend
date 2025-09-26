// app/dashboard/vendor/withdraw/page.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function WithdrawPage() {
    const [amount, setAmount] = useState("")
    const [bank, setBank] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // 🔹 Replace with API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        alert(`Withdrawal of ₦${amount} to ${bank} (${accountNumber}) submitted successfully.`)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 px-6 py-10">
            <div className="max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Withdraw Funds</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount (cNGN)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Bank</Label>
                                <Select value={bank} onValueChange={setBank}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GTB">GTBank</SelectItem>
                                        <SelectItem value="UBA">UBA</SelectItem>
                                        <SelectItem value="ACCESS">Access Bank</SelectItem>
                                        <SelectItem value="ZENITH">Zenith Bank</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    type="text"
                                    placeholder="Enter your 10-digit account number"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value)}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Withdraw
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
