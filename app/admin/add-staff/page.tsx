"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, CheckCircle } from "lucide-react"

interface StaffFormData {
  name: string
  role: "doctor" | "nurse"
  staffId: string
  password: string
  confirmPassword: string
  department?: string
}

export default function AddStaff() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role") as "doctor" | "nurse" | null

  const [formData, setFormData] = useState<StaffFormData>({
    name: "",
    role: roleParam || "doctor",
    staffId: "",
    password: "",
    confirmPassword: "",
    department: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const departments = ["Cardiology", "Neurology", "Orthopedics", "General Medicine", "Pediatrics"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.staffId &&
      formData.password &&
      formData.password === formData.confirmPassword &&
      (formData.role === "nurse" || formData.department)
    ) {
      setSubmitted(true)
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 2000)
    }
  }

  if (submitted) {
    return (
      <DashboardLayout userRole="admin" userName="Hospital Head">
        <div className="max-w-md mx-auto flex items-center justify-center min-h-[400px]">
          <Card className="border-border text-center">
            <CardContent className="pt-8">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Staff Added!</h3>
              <p className="text-muted-foreground mb-4">{formData.name} has been successfully added to the system.</p>
              <p className="text-sm text-muted-foreground">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin" userName="Hospital Head">
      <div className="max-w-2xl space-y-6">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Add Staff Member</h2>
          <p className="text-muted-foreground">Add a new doctor or nurse to the hospital</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
            <CardDescription>Enter the staff member details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name *</label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-border bg-input"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "doctor" | "nurse",
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                    required
                  >
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Staff ID *</label>
                  <Input
                    type="text"
                    placeholder="e.g., DOC001"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="border-border bg-input"
                    required
                  />
                </div>
              </div>

              {formData.role === "doctor" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input"
                    required
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password *</label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="border-border bg-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password *</label>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="border-border bg-input"
                    required
                  />
                </div>
              </div>

              {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">Passwords do not match</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={
                    formData.password !== formData.confirmPassword ||
                    !formData.name ||
                    !formData.staffId ||
                    (formData.role === "doctor" && !formData.department)
                  }
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Add Staff Member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/dashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-blue-50 border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> Staff members can use their Staff ID and the password you set
              here to login to their respective portals.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
