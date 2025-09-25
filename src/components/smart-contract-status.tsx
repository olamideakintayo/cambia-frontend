"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Lock, Unlock, CheckCircle, Clock, AlertTriangle, ExternalLink, Copy } from "lucide-react"
import { useState } from "react"

interface SmartContractStatusProps {
  orderId: string
  contractAddress?: string
  paymentAmount: number
  currency?: string
  status: "pending" | "escrowed" | "shipping" | "delivered" | "released" | "disputed"
  customerAddress?: string
  vendorAddress?: string
  shippingPartnerAddress?: string
  transactionHash?: string
  createdAt: string
  estimatedRelease?: string
}

export function SmartContractStatus({
  orderId,
  contractAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e",
  paymentAmount,
  currency = "₦",
  status,
  customerAddress = "0x1234...5678",
  vendorAddress = "0x9876...4321",
  shippingPartnerAddress = "0x5555...9999",
  transactionHash = "0xabcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yz",
  createdAt,
  estimatedRelease,
}: SmartContractStatusProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/20",
          label: "Payment Pending",
          description: "Waiting for customer payment confirmation",
          progress: 10,
        }
      case "escrowed":
        return {
          icon: Lock,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
          label: "Payment Secured in Escrow",
          description: "Funds locked in smart contract until delivery confirmation",
          progress: 25,
        }
      case "shipping":
        return {
          icon: Lock,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/20",
          label: "In Transit - Payment Secured",
          description: "Product verified and shipped, payment remains in escrow",
          progress: 60,
        }
      case "delivered":
        return {
          icon: CheckCircle,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
          label: "Delivered - Awaiting Confirmation",
          description: "Product delivered, waiting for customer confirmation to release payment",
          progress: 85,
        }
      case "released":
        return {
          icon: Unlock,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
          label: "Payment Released",
          description: "Customer confirmed delivery, payment released to vendor",
          progress: 100,
        }
      case "disputed":
        return {
          icon: AlertTriangle,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          label: "Payment Disputed",
          description: "Dispute raised, payment held pending resolution",
          progress: 50,
        }
      default:
        return {
          icon: Clock,
          color: "text-muted-foreground",
          bgColor: "bg-muted/10",
          borderColor: "border-muted/20",
          label: "Unknown Status",
          description: "Status unknown",
          progress: 0,
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <Card className={`${statusConfig.borderColor} border-2`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
              <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{statusConfig.label}</CardTitle>
              <CardDescription>{statusConfig.description}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {orderId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Amount */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Escrow Amount</p>
            <p className="text-2xl font-bold">
              {currency}
              {paymentAmount.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Payment Flow Progress</span>
            <span>{statusConfig.progress}%</span>
          </div>
          <Progress value={statusConfig.progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Order Placed</span>
            <span>Payment Released</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Payment Timeline</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Payment deposited:</span>
              <span>{createdAt}</span>
            </div>
            {status !== "pending" && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Funds locked in escrow:</span>
                <span>Confirmed</span>
              </div>
            )}
            {(status === "shipping" || status === "delivered" || status === "released") && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Product verified & shipped:</span>
                <span>Confirmed</span>
              </div>
            )}
            {(status === "delivered" || status === "released") && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Product delivered:</span>
                <span>Confirmed</span>
              </div>
            )}
            {status === "released" && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Payment released:</span>
                <span>Completed</span>
              </div>
            )}
            {estimatedRelease && status !== "released" && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                <span className="text-muted-foreground">Estimated release:</span>
                <span>{estimatedRelease}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contract Details */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-semibold text-sm">Smart Contract Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Contract Address:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">
                  {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(contractAddress, "contract")}
                >
                  {copied === "contract" ? (
                    <CheckCircle className="h-3 w-3 text-success" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Transaction Hash:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">
                  {transactionHash.slice(0, 10)}...{transactionHash.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(transactionHash, "tx")}
                >
                  {copied === "tx" ? <CheckCircle className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Blockchain Explorer
          </Button>
        </div>

        {/* Participants */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Contract Participants</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-mono text-xs">{customerAddress}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-muted-foreground">Vendor:</span>
              <span className="font-mono text-xs">{vendorAddress}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
              <span className="text-muted-foreground">Shipping Partner:</span>
              <span className="font-mono text-xs">{shippingPartnerAddress}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {status === "delivered" && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Product has been delivered. Please confirm receipt to release payment to the vendor.
            </p>
            <div className="flex gap-2">
              <Button className="flex-1">Confirm Delivery & Release Payment</Button>
              <Button variant="outline">Report Issue</Button>
            </div>
          </div>
        )}

        {status === "disputed" && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              A dispute has been raised. Payment is held until resolution.
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              View Dispute Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
