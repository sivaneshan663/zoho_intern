"use client"

import type React from "react"
import { saveTestReport, getPatientById } from "@/lib/patient-data"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, UploadIcon, CheckCircle, File, AlertCircle } from "lucide-react"

export default function UploadReport() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")
  const testId = searchParams.get("testId")
  const testName = searchParams.get("testName")

  const [patientData, setPatientData] = useState<any>(null)
  const [formData, setFormData] = useState({
    file: null as File | null,
  })
  const [fileBase64, setFileBase64] = useState<string | null>(null)
  const [reportContent, setReportContent] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    if (patientId) {
      const patient = getPatientById(patientId)
      setPatientData(patient)
    }
  }, [patientId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "application/pdf" || file.type.startsWith("image/"))) {
      setFormData({ ...formData, file })
      setIsConfirmed(false)
      setFileUploaded(false)

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        setFileBase64(base64)
        setFileUploaded(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (patientId && testId && formData.file && fileUploaded && isConfirmed) {
      setUploading(true)
      setTimeout(() => {
        saveTestReport(
          patientId,
          testId,
          formData.file!.name,
          reportContent || undefined,
          fileBase64 || undefined,
          formData.file!.type,
        )

        setUploading(false)
        setUploaded(true)
        setTimeout(() => {
          router.push("/nurse/dashboard")
        }, 1500)
      }, 1000)
    }
  }

  const nurseSession = typeof window !== "undefined" ? localStorage.getItem("nurse_session") : null
  const nurseName = nurseSession ? JSON.parse(nurseSession).name : "Nurse"

  if (uploaded) {
    return (
      <DashboardLayout userRole="nurse" userName={nurseName}>
        <div className="max-w-md mx-auto flex items-center justify-center min-h-[400px]">
          <Card className="border-border/50 text-center">
            <CardContent className="pt-8">
              <div className="bg-green-500/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Report Uploaded!</h3>
              <p className="text-muted-foreground mb-4">The test report has been successfully uploaded.</p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="nurse" userName={nurseName}>
      <div className="max-w-2xl space-y-6">
        <button
          onClick={() => router.push("/nurse/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Upload Test Report</h2>
          <p className="text-muted-foreground">Upload the test report for the patient</p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
            <CardDescription>Patient details and test type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Patient</p>
                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">{patientData?.name || patientId}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Test Type</p>
                <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <p className="text-lg font-semibold text-foreground">{testName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Step 1: Select File</CardTitle>
            <CardDescription>Choose a PDF or image file to upload</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  <UploadIcon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {formData.file ? formData.file.name : "Click to upload"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.file ? "File selected" : "or drag and drop (PDF or image)"}
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {formData.file && fileUploaded && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg mt-4">
                <File className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{formData.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB - File ready for submission
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </CardContent>
        </Card>

        {fileUploaded && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Step 2: Add Findings & Confirm</CardTitle>
              <CardDescription>Add report details and confirm before submitting</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Report Findings (Optional)</label>
                  <Textarea
                    placeholder="Enter the test results and findings here..."
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    className="min-h-[120px] border-border/50 bg-secondary/50"
                  />
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <Checkbox
                    id="confirm-upload"
                    checked={isConfirmed}
                    onCheckedChange={(checked) => setIsConfirmed(checked === true)}
                    className="mt-0.5 h-5 w-5"
                  />
                  <label htmlFor="confirm-upload" className="cursor-pointer">
                    <p className="font-medium text-foreground">Manual Confirmation Required</p>
                    <p className="text-sm text-muted-foreground">
                      I confirm that I have reviewed the uploaded file and it contains the correct test report for this
                      patient.
                    </p>
                  </label>
                </div>

                {!isConfirmed && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-destructive" />
                    <p className="text-sm text-destructive">Please check the confirmation box above to submit.</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={!fileUploaded || uploading || !isConfirmed} className="flex-1">
                    {uploading ? "Uploading..." : "Submit Report"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/nurse/dashboard")}
                    className="flex-1 border-border/50"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
