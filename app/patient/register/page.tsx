"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerPatient } from "@/lib/patient-data"

export default function PatientRegister() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    allergies: "",
    bloodGroup: "",
    address: "",
    emergencyContact: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<{ patientId: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const calculateAge = (dob: string) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    setTimeout(() => {
      try {
        const patient = registerPatient({
          name: formData.name,
          dob: formData.dob,
          age: calculateAge(formData.dob),
          gender: formData.gender,
          contactNumber: formData.contactNumber,
          email: formData.email,
          password: formData.password,
          allergies: formData.allergies || "None",
          bloodGroup: formData.bloodGroup,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
        })
        setSuccess({ patientId: patient.patientId })
      } catch (err) {
        setError("Registration failed. Please try again.")
      }
      setLoading(false)
    }, 500)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription>Your account has been created</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 rounded-xl p-6 text-center border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Your Patient ID</p>
              <p className="text-4xl font-bold text-primary">{success.patientId}</p>
              <p className="text-xs text-muted-foreground mt-2">Save this ID for login</p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => router.push("/patient/login")} className="w-full">
                Go to Login
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full border-border/50">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">New Patient Registration</CardTitle>
          <CardDescription>Create your patient account to access healthcare services</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name *</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Birth *</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-border/50 rounded-lg bg-secondary/50 text-foreground"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contact Number *</label>
                <Input
                  type="tel"
                  placeholder="+1-555-0123"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-border/50 rounded-lg bg-secondary/50 text-foreground"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-foreground">Allergies</label>
                <Input
                  type="text"
                  placeholder="e.g., Penicillin, Peanuts (or None)"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password *</label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password *</label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="border-border/50 bg-secondary/50"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push("/patient/login")}
              className="flex items-center gap-2 justify-center text-primary hover:underline font-medium text-sm mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Already have an account? Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
