"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, CheckCircle2, Ticket } from "lucide-react"
import { getPatientById, generateVisitToken, type PatientRecord, type ActiveVisit } from "@/lib/patient-data"

export default function BookAppointment() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<PatientRecord | null>(null)
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    date: "",
  })
  const [generatedToken, setGeneratedToken] = useState<ActiveVisit | null>(null)

  const departments = ["Cardiology", "Orthopedics", "Neurology", "General Medicine", "Pediatrics"]
  const doctors: { [key: string]: string[] } = {
    Cardiology: ["Dr. Kaviya", "Dr. Pragadish"],
    Orthopedics: ["Dr. Kaviya", "Dr. Pragadish"],
    Neurology: ["Dr. Kaviya", "Dr. Pragadish"],
    "General Medicine": ["Dr. Kaviya", "Dr. Pragadish"],
    Pediatrics: ["Dr. Kaviya", "Dr. Pragadish"],
  }

  useEffect(() => {
    const session = localStorage.getItem("patient_session")
    if (session) {
      try {
        const { patientId } = JSON.parse(session)
        const patient = getPatientById(patientId)
        setPatientData(patient)
      } catch (e) {
        console.error("Error loading patient:", e)
      }
    }
  }, [])

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientData) {
      alert("Please login first")
      router.push("/patient/login")
      return
    }

    if (formData.department && formData.doctor && formData.date) {
      const visit = generateVisitToken(patientData.patientId, formData.department, formData.doctor)
      if (visit) {
        setGeneratedToken(visit)
      } else {
        alert("Failed to generate token. Please try again.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("patient_session")
    router.push("/patient/login")
  }

  if (generatedToken) {
    return (
      <DashboardLayout userRole="patient" userName={patientData?.name} onLogout={handleLogout}>
        <div className="max-w-md mx-auto">
          <Card className="border-border/50">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle>Appointment Confirmed!</CardTitle>
              <CardDescription>Your visit has been scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Your Token Number</p>
                <p className="text-6xl font-bold text-primary">{generatedToken.tokenNumber}</p>
                <p className="text-xs text-muted-foreground mt-2">Show this token at the reception</p>
              </div>

              <div className="space-y-3 text-sm bg-secondary/30 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient:</span>
                  <span className="font-semibold text-foreground">{generatedToken.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-semibold text-foreground">{generatedToken.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-semibold text-foreground">{generatedToken.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-semibold text-foreground">{generatedToken.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-semibold text-foreground">{generatedToken.time}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
                Please arrive 10 minutes before your appointment. This token is valid for today only.
              </p>

              <div className="flex gap-2">
                <Button onClick={() => router.push("/patient/dashboard")} className="flex-1">
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    setGeneratedToken(null)
                    setFormData({ department: "", doctor: "", date: "" })
                  }}
                  variant="outline"
                  className="flex-1 border-border/50"
                >
                  Book Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="patient" userName={patientData?.name} onLogout={handleLogout}>
      <div className="max-w-2xl">
        <button
          onClick={() => router.push("/patient/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Book an Appointment
            </CardTitle>
            <CardDescription>Schedule your visit and get a token number</CardDescription>
          </CardHeader>
          <CardContent>
            {patientData ? (
              <form onSubmit={handleBookAppointment} className="space-y-6">
                <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Booking for</p>
                  <p className="font-semibold text-foreground">
                    {patientData.name} ({patientData.patientId})
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value, doctor: "" })}
                    className="w-full px-3 py-2 border border-border/50 rounded-lg bg-secondary/50 text-foreground"
                    required
                  >
                    <option value="">Choose a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Doctor *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 border border-border/50 rounded-lg bg-secondary/50 text-foreground"
                    required
                    disabled={!formData.department}
                  >
                    <option value="">{formData.department ? "Choose a doctor" : "Select a department first"}</option>
                    {formData.department &&
                      doctors[formData.department]?.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Select Date *</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="border-border/50 bg-secondary/50"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={!formData.department || !formData.doctor || !formData.date}
                  className="w-full"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Generate Token
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Please login to book an appointment</p>
                <Button onClick={() => router.push("/patient/login")}>Go to Login</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
