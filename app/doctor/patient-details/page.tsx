"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, CheckCircle, Pill } from "lucide-react"

export default function PatientDetails() {
  const router = useRouter()

  const patientData = {
    name: "Vaseekar",
    token: "001",
    age: 35,
    gender: "Male",
    dateOfBirth: "1990-05-15",
    contactNumber: "+1-555-0123",
    medicalHistory: "Hypertension, previous heart condition",
    currentSymptoms: "Chest pain, shortness of breath",
    allergies: "Penicillin",
    reports: [
      { name: "Blood Test", status: "pending", date: "2025-01-15" },
      { name: "ECG", status: "pending", date: "2025-01-15" },
      { name: "Chest X-Ray", status: "completed", date: "2025-01-10" },
    ],
  }

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Kaviya">
      <div className="space-y-6">
        <button
          onClick={() => router.push("/doctor/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Patient Info */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{patientData.name}</CardTitle>
                <CardDescription>Token: {patientData.token}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold">{patientData.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-semibold">{patientData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-semibold">{patientData.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Allergies</p>
                <p className="font-semibold text-red-600">{patientData.allergies}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Medical History</p>
                <p className="font-semibold">{patientData.medicalHistory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Symptoms */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Current Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Symptoms</p>
              <p className="text-foreground">{patientData.currentSymptoms}</p>
            </div>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Update Condition
            </Button>
          </CardContent>
        </Card>

        {/* Test Reports */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Test Reports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patientData.reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="text-sm text-muted-foreground">{report.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    report.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {report.status}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={() => router.push("/doctor/test-approval")}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Approve Tests
          </Button>
          <Button
            onClick={() => router.push("/doctor/add-prescription")}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <Pill className="w-4 h-4" />
            Add Prescription
          </Button>
          <Button variant="outline" onClick={() => router.push("/doctor/dashboard")}>
            Back
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
