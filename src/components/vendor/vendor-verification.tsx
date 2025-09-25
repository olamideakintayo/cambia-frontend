"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import { useVendor } from "@/hooks/use-vendor"
import { useToast } from "@/hooks/use-toast"

const documentTypes = [
  {
    type: "business_registration" as const,
    title: "Business Registration",
    description: "Certificate of incorporation or business registration",
    required: true,
  },
  {
    type: "tax_certificate" as const,
    title: "Tax Certificate",
    description: "Tax identification number certificate",
    required: true,
  },
  {
    type: "food_license" as const,
    title: "Food License",
    description: "Food handling or processing license",
    required: true,
  },
  {
    type: "identity" as const,
    title: "Identity Document",
    description: "National ID, passport, or driver's license",
    required: true,
  },
]

export function VendorVerification() {
  const { vendor, isLoading, submitVerification } = useVendor()
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({})
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileSelect = useCallback((type: string, file: File) => {
    setSelectedFiles((prev) => ({ ...prev, [type]: file }))
  }, [])

  const handleSubmit = async () => {
    const documents = Object.entries(selectedFiles).map(([type, file]) => ({
      type: type as any,
      file,
    }))

    if (documents.length === 0) {
      toast({
        title: "No documents selected",
        description: "Please select at least one document to upload",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const success = await submitVerification({ documents })
    setUploading(false)

    if (success) {
      setSelectedFiles({})
    }
  }

  const getDocumentStatus = (type: string) => {
    const doc = vendor?.documents?.find((d) => d.type === type)
    return doc?.status || "not_uploaded"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-500">
            Approved
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "pending":
        return <Badge variant="secondary">Under Review</Badge>
      default:
        return <Badge variant="outline">Not Uploaded</Badge>
    }
  }

  const approvedDocs = vendor?.documents?.filter((d) => d.status === "approved").length || 0
  const totalRequired = documentTypes.filter((d) => d.required).length
  const verificationProgress = (approvedDocs / totalRequired) * 100

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Verification Status
            {vendor?.verified && <CheckCircle className="h-5 w-5 text-green-500" />}
          </CardTitle>
          <CardDescription>Complete your verification to start selling on Cambia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {approvedDocs}/{totalRequired} documents approved
              </span>
            </div>
            <Progress value={verificationProgress} className="h-2" />
          </div>

          {vendor?.verified ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Your account is verified!</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Upload and get approval for all required documents to complete verification.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Upload clear, high-quality images or PDFs of your documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentTypes.map((docType) => {
            const status = getDocumentStatus(docType.type)
            const selectedFile = selectedFiles[docType.type]

            return (
              <div key={docType.type} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <h4 className="font-medium">{docType.title}</h4>
                      <p className="text-sm text-muted-foreground">{docType.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>

                {status !== "approved" && (
                  <div className="space-y-2">
                    {selectedFile ? (
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{selectedFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedFiles((prev) => {
                              const newFiles = { ...prev }
                              delete newFiles[docType.type]
                              return newFiles
                            })
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileSelect(docType.type, file)
                            }
                          }}
                          className="hidden"
                          id={`file-${docType.type}`}
                        />
                        <Button variant="outline" size="sm" asChild disabled={uploading}>
                          <label htmlFor={`file-${docType.type}`} className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </label>
                        </Button>
                      </div>
                    )}

                    {status === "rejected" && (
                      <p className="text-sm text-red-600">Document was rejected. Please upload a new version.</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {Object.keys(selectedFiles).length > 0 && (
            <div className="pt-4 border-t">
              <Button onClick={handleSubmit} disabled={uploading} className="w-full">
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Documents for Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
