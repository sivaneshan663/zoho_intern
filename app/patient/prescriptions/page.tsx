"use client"

import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function Prescriptions() {
  const router = useRouter()

  const prescriptions = [
    {
      id: 1,
      date: "2025-01-15",
      doctor: "Dr. Kaviya",
      medicines: [
        { name: "Aspirin", dosage: "500mg", timing: "Twice daily" },
        { name: "Lisinopril", dosage: "10mg", timing: "Once daily" },
      ],
    },
    {
      id: 2,
      date: "2024-12-20",
      doctor: "Dr. Pragadish",
      medicines: [
        { name: "Paracetamol", dosage: "500mg", timing: "As needed" },
        { name: "Cough Syrup", dosage: "10ml", timing: "Twice daily" },
      ],
    },
  ]

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
          <h2 className="text-3xl font-bold text-foreground mb-2">Prescriptions</h2>
          <p className="text-muted-foreground">Your active prescriptions</p>
        </div>

        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="border-border">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Prescription from {prescription.doctor}</CardTitle>
                    <CardDescription>{prescription.date}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescription.medicines.map((medicine, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {medicine.dosage} • {medicine.timing}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Download Prescription
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
