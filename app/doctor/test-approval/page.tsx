"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function TestApproval() {
  const router = useRouter()
  const [selectedTests, setSelectedTests] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const availableTests = [
    { id: "blood", name: "Blood Test" },
    { id: "urine", name: "Urine Test" },
    { id: "xray", name: "X-Ray" },
    { id: "mri", name: "MRI" },
    { id: "ct", name: "CT Scan" },
  ]

  const handleTestToggle = (testId: string) => {
    setSelectedTests((prev) => (prev.includes(testId) ? prev.filter((t) => t !== testId) : [...prev, testId]))
  }

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => {
      router.push("/doctor/dashboard")
    }, 2000)
  }

  if (submitted) {
    return (
      <DashboardLayout userRole="doctor" userName="Dr. Kaviya">
        <div className="max-w-md mx-auto flex items-center justify-center min-h-[400px]">
          <Card className="border-border text-center">
            <CardContent className="pt-8">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Tests Approved!</h3>
              <p className="text-muted-foreground mb-4">
                {selectedTests.length} test(s) have been approved for the patient.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Kaviya">
      <div className="space-y-6">
        <button
          onClick={() => router.push("/doctor/patient-details")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Details
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Approve Tests for Patient</h2>
          <p className="text-muted-foreground">Select tests to be performed on the patient</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Available Tests</CardTitle>
            <CardDescription>Select one or more tests to approve</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTests.map((test) => (
              <div
                key={test.id}
                className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  id={test.id}
                  checked={selectedTests.includes(test.id)}
                  onCheckedChange={() => handleTestToggle(test.id)}
                />
                <label htmlFor={test.id} className="flex-1 cursor-pointer font-medium text-foreground">
                  {test.name}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedTests.length > 0 && (
          <Card className="border-l-4 border-l-green-500 bg-green-50 border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-green-700 mb-4">
                You have selected <span className="font-bold">{selectedTests.length}</span> test(s) to approve.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleSubmit} className="flex-1 bg-green-600 text-white hover:bg-green-700">
                  Submit Approvals
                </Button>
                <Button variant="outline" onClick={() => setSelectedTests([])} className="flex-1">
                  Clear Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
