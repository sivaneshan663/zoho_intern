"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CheckCircle2, AlertCircle, Pill, Bell, RefreshCw, Upload, ArrowLeft, Ticket } from "lucide-react"
import {
  searchPatientByToken,
  getPatientById,
  markTestAsPerformed,
  markMedicineAsIssued,
  getActiveVisitsForToday,
  type PatientRecord,
  type ActiveVisit,
} from "@/lib/patient-data"

const NURSE_SESSION_KEY = "nurse_session"

export default function NurseDashboard() {
  const router = useRouter()
  const [nurseInfo, setNurseInfo] = useState<{ staffId: string; name: string } | null>(null)
  const [searchToken, setSearchToken] = useState("")
  const [patientData, setPatientData] = useState<PatientRecord | null>(null)
  const [activeVisits, setActiveVisits] = useState<ActiveVisit[]>([])
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem(NURSE_SESSION_KEY)
    if (!session) {
      router.push("/nurse/login")
      return
    }
    try {
      const info = JSON.parse(session)
      setNurseInfo(info)
      loadActiveVisits()
    } catch (e) {
      router.push("/nurse/login")
    }
    setIsLoading(false)
  }, [router])

  const loadActiveVisits = () => {
    const visits = getActiveVisitsForToday()
    setActiveVisits(visits)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchToken) return
    const patient = searchPatientByToken(searchToken)
    if (patient) {
      setPatientData(patient)
    } else {
      showNotification("Patient not found", "info")
    }
  }

  const handleSelectPatient = (visit: ActiveVisit) => {
    const patient = getPatientById(visit.patientId)
    if (patient) {
      setPatientData(patient)
      setSearchToken(visit.tokenNumber)
    }
  }

  const handleRefresh = () => {
    if (patientData) {
      const updated = getPatientById(patientData.patientId)
      if (updated) setPatientData(updated)
    }
    loadActiveVisits()
    showNotification("Data refreshed", "info")
  }

  const showNotification = (message: string, type: "success" | "info") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleTestToggle = (testId: string) => {
    if (!patientData) return
    const latestVisit = patientData.medicalHistory[patientData.medicalHistory.length - 1]
    const test = latestVisit.tests.find((t) => t.id === testId)
    if (test) {
      const newStatus = !test.isPerformed
      markTestAsPerformed(patientData.patientId, testId, newStatus)
      const updated = getPatientById(patientData.patientId)
      setPatientData(updated)
      showNotification(
        newStatus ? `"${test.name}" marked as performed` : `"${test.name}" unmarked`,
        newStatus ? "success" : "info",
      )
    }
  }

  const handleMedicineToggle = (medicineId: string) => {
    if (!patientData) return
    const latestVisit = patientData.medicalHistory[patientData.medicalHistory.length - 1]
    const medicine = latestVisit.prescriptions.find((p) => p.id === medicineId)
    if (medicine) {
      const newStatus = !medicine.isIssued
      markMedicineAsIssued(patientData.patientId, medicineId, newStatus)
      const updated = getPatientById(patientData.patientId)
      setPatientData(updated)
      showNotification(
        newStatus ? `"${medicine.medicine}" given to patient` : `"${medicine.medicine}" unmarked`,
        newStatus ? "success" : "info",
      )
    }
  }

  const getLatestVisitData = () => {
    if (patientData?.medicalHistory?.length) {
      return patientData.medicalHistory[patientData.medicalHistory.length - 1]
    }
    return null
  }

  const handleBackToSearch = () => {
    setPatientData(null)
    setSearchToken("")
  }

  const handleLogout = () => {
    localStorage.removeItem(NURSE_SESSION_KEY)
    router.push("/nurse/login")
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="nurse" userName="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patientData) {
    return (
      <DashboardLayout userRole="nurse" userName={nurseInfo?.name || "Nurse"} onLogout={handleLogout}>
        <div className="space-y-6">
          {/* Today's Queue */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Today&apos;s Patients
              </CardTitle>
              <CardDescription>Patients with pending tests or medicines</CardDescription>
            </CardHeader>
            <CardContent>
              {activeVisits.filter((v) => v.status !== "completed").length > 0 ? (
                <div className="space-y-3">
                  {activeVisits
                    .filter((v) => v.status !== "completed")
                    .map((visit) => (
                      <div
                        key={visit.tokenNumber}
                        className="flex items-center justify-between p-4 rounded-xl border bg-secondary/30 border-border/50 cursor-pointer hover:border-primary/50 transition-all"
                        onClick={() => handleSelectPatient(visit)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-primary">{visit.tokenNumber}</div>
                          <div>
                            <p className="font-semibold text-foreground">{visit.patientName}</p>
                            <p className="text-sm text-muted-foreground">{visit.department}</p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full capitalize ${
                            visit.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {visit.status}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No active patients</p>
              )}
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Search Patient by Token
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter token number"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <Button type="submit">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  const latestVisit = getLatestVisitData()

  return (
    <DashboardLayout userRole="nurse" userName={nurseInfo?.name || "Nurse"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-20 right-4 z-50 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in slide-in-from-right border ${
              notification.type === "success"
                ? "bg-green-500/10 border-green-500/20"
                : "bg-blue-500/10 border-blue-500/20"
            }`}
          >
            <Bell className={`w-5 h-5 ${notification.type === "success" ? "text-green-400" : "text-blue-400"}`} />
            <p className={`font-medium ${notification.type === "success" ? "text-green-400" : "text-blue-400"}`}>
              {notification.message}
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBackToSearch} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="border-border/50 bg-transparent">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Patient Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">
                {patientData.name.charAt(0)}
              </div>
              <div>
                <span>{patientData.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-normal text-muted-foreground">ID: {patientData.patientId}</span>
                  <span className="text-sm font-normal px-2 py-0.5 bg-primary/10 text-primary rounded">
                    Token: {searchToken}
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Age", value: `${patientData.age} years` },
                { label: "Gender", value: patientData.gender },
                { label: "Blood Group", value: patientData.bloodGroup || "N/A" },
                {
                  label: "Allergies",
                  value: patientData.allergies || "None",
                  isAlert: patientData.allergies && patientData.allergies !== "None",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${item.isAlert ? "bg-destructive/10 border border-destructive/20" : "bg-secondary/30"}`}
                >
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-sm font-semibold ${item.isAlert ? "text-destructive" : "text-foreground"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {latestVisit && (
          <>
            {/* Tests Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Assigned Tests</CardTitle>
                <CardDescription>Perform tests and upload reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestVisit.tests?.length > 0 ? (
                  latestVisit.tests.map((test) => (
                    <div
                      key={test.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        test.status === "completed"
                          ? "bg-green-500/5 border-green-500/20"
                          : test.isPerformed
                            ? "bg-amber-500/5 border-amber-500/20"
                            : "bg-secondary/30 border-border/50"
                      }`}
                    >
                      <Checkbox
                        id={test.id}
                        checked={test.isPerformed || false}
                        onCheckedChange={() => handleTestToggle(test.id)}
                        className="h-6 w-6 border-2"
                      />
                      <div className="flex-1">
                        <label htmlFor={test.id} className="cursor-pointer">
                          <p
                            className={`font-semibold ${test.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {test.name}
                          </p>
                        </label>
                        <div className="flex gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${test.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                          >
                            {test.status === "completed" ? "Report Uploaded" : "Pending Report"}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${test.isPerformed ? "bg-blue-500/10 text-blue-400" : "bg-secondary text-muted-foreground"}`}
                          >
                            {test.isPerformed ? "Performed" : "Not Performed"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {test.status === "completed" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-400" />
                        )}
                        <Button
                          onClick={() =>
                            router.push(
                              `/nurse/upload-report?patientId=${patientData.patientId}&testId=${test.id}&testName=${test.name}`,
                            )
                          }
                          size="sm"
                          variant="outline"
                          className="border-border/50"
                        >
                          <Upload className="w-4 h-4 mr-1" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No tests assigned</p>
                )}
              </CardContent>
            </Card>

            {/* Medicines Section */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-green-400" />
                  Prescribed Medicines
                </CardTitle>
                <CardDescription>Check each medicine after giving it to the patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {latestVisit.prescriptions?.length > 0 ? (
                  latestVisit.prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                        prescription.isIssued
                          ? "bg-green-500/5 border-green-500/20"
                          : "bg-amber-500/5 border-amber-500/20"
                      }`}
                    >
                      <Checkbox
                        id={prescription.id}
                        checked={prescription.isIssued || false}
                        onCheckedChange={() => handleMedicineToggle(prescription.id)}
                        className="h-6 w-6 border-2"
                      />
                      <div className="flex-1">
                        <label htmlFor={prescription.id} className="cursor-pointer">
                          <p
                            className={`font-semibold ${prescription.isIssued ? "line-through text-muted-foreground" : "text-foreground"}`}
                          >
                            {prescription.medicine}
                          </p>
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {prescription.dosage} - {prescription.timing}
                        </p>
                      </div>
                      {prescription.isIssued ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium text-green-400">Given</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">Pending</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No medicines prescribed</p>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <h4 className="font-semibold text-foreground mb-4">Task Summary</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Tests Completed</p>
                    <p className="text-3xl font-bold text-foreground">
                      {latestVisit.tests?.filter((t) => t.status === "completed").length || 0}
                      <span className="text-lg text-muted-foreground"> / {latestVisit.tests?.length || 0}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medicines Given</p>
                    <p className="text-3xl font-bold text-foreground">
                      {latestVisit.prescriptions?.filter((p) => p.isIssued).length || 0}
                      <span className="text-lg text-muted-foreground"> / {latestVisit.prescriptions?.length || 0}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
