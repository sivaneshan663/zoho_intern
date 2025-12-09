"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Trash2, CheckCircle } from "lucide-react"

interface Medicine {
  id: string
  name: string
  dosage: string
  timing: string
}

export default function AddPrescription() {
  const router = useRouter()
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [currentMedicine, setCurrentMedicine] = useState({
    name: "",
    dosage: "",
    timing: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const addMedicine = () => {
    if (currentMedicine.name && currentMedicine.dosage && currentMedicine.timing) {
      setMedicines([
        ...medicines,
        {
          ...currentMedicine,
          id: Date.now().toString(),
        },
      ])
      setCurrentMedicine({ name: "", dosage: "", timing: "" })
    }
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((m) => m.id !== id))
  }

  const handleSubmit = () => {
    if (medicines.length > 0) {
      setSubmitted(true)
      setTimeout(() => {
        router.push("/doctor/dashboard")
      }, 2000)
    }
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
              <h3 className="text-xl font-semibold text-foreground mb-2">Prescription Saved!</h3>
              <p className="text-muted-foreground mb-4">{medicines.length} medicine(s) have been prescribed.</p>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="doctor" userName="Dr. Pragadish">
      <div className="space-y-6">
        <button
          onClick={() => router.push("/doctor/patient-details")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patient Details
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Add Prescription</h2>
          <p className="text-muted-foreground">Add medicines to the patient's prescription</p>
        </div>

        {/* Add Medicine Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Add Medicine</CardTitle>
            <CardDescription>Fill in the medicine details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Medicine Name *</label>
              <Input
                placeholder="e.g., Aspirin"
                value={currentMedicine.name}
                onChange={(e) => setCurrentMedicine({ ...currentMedicine, name: e.target.value })}
                className="border-border bg-input"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dosage *</label>
                <Input
                  placeholder="e.g., 500mg"
                  value={currentMedicine.dosage}
                  onChange={(e) => setCurrentMedicine({ ...currentMedicine, dosage: e.target.value })}
                  className="border-border bg-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timing *</label>
                <Input
                  placeholder="e.g., Twice daily"
                  value={currentMedicine.timing}
                  onChange={(e) => setCurrentMedicine({ ...currentMedicine, timing: e.target.value })}
                  className="border-border bg-input"
                />
              </div>
            </div>

            <Button
              onClick={addMedicine}
              disabled={!currentMedicine.name || !currentMedicine.dosage || !currentMedicine.timing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </CardContent>
        </Card>

        {/* Medicines List */}
        {medicines.length > 0 && (
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Medicines Added ({medicines.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {medicines.map((medicine) => (
                <div
                  key={medicine.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-semibold text-foreground">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {medicine.dosage} • {medicine.timing}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMedicine(medicine.id)}
                    className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <Button onClick={handleSubmit} className="w-full mt-4 bg-green-600 text-white hover:bg-green-700">
                Save Prescription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
