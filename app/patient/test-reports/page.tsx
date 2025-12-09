"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, ArrowLeft } from "lucide-react"

export default function TestReports() {
  const router = useRouter()

  const testReports = [
    {
      id: 1,
      name: "Blood Test",
      doctor: "Dr. Kaviya",
      status: "completed",
      date: "2025-01-10",
    },
    {
      id: 2,
      name: "Chest X-Ray",
      doctor: "Dr. Pragadish",
      status: "completed",
      date: "2025-01-05",
    },
    {
      id: 3,
      name: "ECG",
      doctor: "Dr. Kaviya",
      status: "pending",
      date: "2025-01-15",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "completed"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-yellow-100 text-yellow-700 border-yellow-200"
  }

  return (
    <DashboardLayout userRole="patient">
      <div className="space-y-6">
        <button
          onClick={() => router.push("/patient/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Test Reports</h2>
          <p className="text-muted-foreground">All your medical test results</p>
        </div>

        <div className="space-y-3">
          {testReports.map((report) => (
            <Card key={report.id} className="border-border">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Approved by {report.doctor} • {report.date}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium border capitalize ${getStatusColor(report.status)}`}
                  >
                    {report.status}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                  {report.status === "completed" && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
