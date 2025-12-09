"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, Plus, RefreshCw, Search, ArrowLeft, FileText, Pill, Ticket, Eye, Download } from "lucide-react"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import {
  getPatientById,
  searchPatientByToken,
  addTestsToPatient,
  addPrescriptionsToPatient,
  getActiveVisitsForToday,
  updateVisitStatus,
  type PatientRecord,
  type ActiveVisit,
} from "@/lib/patient-data"
import { jsPDF } from "jspdf"

const DOCTOR_SESSION_KEY = "doctor_session"

export default function DoctorDashboard() {
  const router = useRouter()
  const [doctorInfo, setDoctorInfo] = useState<{ staffId: string; name: string; department?: string } | null>(null)
  const [searchToken, setSearchToken] = useState("")
  const [patientData, setPatientData] = useState<PatientRecord | null>(null)
  const [activeVisits, setActiveVisits] = useState<ActiveVisit[]>([])
  const [currentSymptoms, setCurrentSymptoms] = useState("")
  const [newTests, setNewTests] = useState<any[]>([])
  const [newPrescriptions, setNewPrescriptions] = useState<any[]>([])
  const [newTestName, setNewTestName] = useState("")
  const [newMedicineName, setNewMedicineName] = useState("")
  const [newMedicineDosage, setNewMedicineDosage] = useState("")
  const [newMedicineTiming, setNewMedicineTiming] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem(DOCTOR_SESSION_KEY)
    if (!session) {
      router.push("/doctor/login")
      return
    }
    try {
      const info = JSON.parse(session)
      setDoctorInfo(info)
      loadActiveVisits()
    } catch (e) {
      router.push("/doctor/login")
    }
    setIsLoading(false)
  }, [router])

  const loadActiveVisits = () => {
    const visits = getActiveVisitsForToday()
    setActiveVisits(visits)
  }

  const handleSearch = () => {
    if (!searchToken) {
      alert("Please enter a token number")
      return
    }
    const patient = searchPatientByToken(searchToken)
    if (patient) {
      setPatientData(patient)
      setCurrentSymptoms("")
      setNewTests([])
      setNewPrescriptions([])
      // Update visit status to in-progress
      updateVisitStatus(searchToken, "in-progress")
      loadActiveVisits()
    } else {
      alert("Patient not found with this token")
    }
  }

  const handleSelectPatient = (visit: ActiveVisit) => {
    const patient = getPatientById(visit.patientId)
    if (patient) {
      setPatientData(patient)
      setSearchToken(visit.tokenNumber)
      updateVisitStatus(visit.tokenNumber, "in-progress")
      loadActiveVisits()
    }
  }

  const handleRefresh = () => {
    if (patientData) {
      const updated = getPatientById(patientData.patientId)
      if (updated) setPatientData(updated)
    }
    loadActiveVisits()
  }

  const handleAddTest = () => {
    if (!newTestName.trim()) return
    setNewTests([
      ...newTests,
      { id: `test-${Date.now()}`, name: newTestName, status: "pending", date: new Date().toISOString().split("T")[0] },
    ])
    setNewTestName("")
  }

  const handleRemoveTest = (index: number) => {
    setNewTests(newTests.filter((_, i) => i !== index))
  }

  const handleAddMedicine = () => {
    if (!newMedicineName.trim() || !newMedicineDosage.trim() || !newMedicineTiming.trim()) return
    setNewPrescriptions([
      ...newPrescriptions,
      { id: `presc-${Date.now()}`, medicine: newMedicineName, dosage: newMedicineDosage, timing: newMedicineTiming },
    ])
    setNewMedicineName("")
    setNewMedicineDosage("")
    setNewMedicineTiming("")
  }

  const handleRemoveMedicine = (index: number) => {
    setNewPrescriptions(newPrescriptions.filter((_, i) => i !== index))
  }

  const handleSaveVisit = () => {
    if (!patientData) return
    if (newTests.length === 0 && newPrescriptions.length === 0) {
      alert("Please add at least one test or prescription")
      return
    }

    if (newTests.length > 0) {
      addTestsToPatient(patientData.patientId, newTests)
    }
    if (newPrescriptions.length > 0) {
      addPrescriptionsToPatient(patientData.patientId, newPrescriptions)
    }

    alert("Visit saved successfully!")
    const updated = getPatientById(patientData.patientId)
    setPatientData(updated)
    setNewTests([])
    setNewPrescriptions([])
  }

  const handleCompleteVisit = () => {
    if (searchToken) {
      updateVisitStatus(searchToken, "completed")
      loadActiveVisits()
      setPatientData(null)
      setSearchToken("")
      alert("Visit completed successfully!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem(DOCTOR_SESSION_KEY)
    router.push("/doctor/login")
  }

  const handleBackToSearch = () => {
    setPatientData(null)
    setSearchToken("")
  }

  const handleViewReport = (test: any) => {
    setSelectedReport(test)
    setReportModalOpen(true)
  }

  const handleDownloadReport = (test: any) => {
    if (test.report?.fileData) {
      // Download original file
      const link = document.createElement("a")
      link.href = test.report.fileData
      link.download = test.report.fileName || `${test.name}_report.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Generate PDF summary
      const doc = new jsPDF()
      doc.setFontSize(20)
      doc.text("MediCare Hospital", 105, 20, { align: "center" })
      doc.setFontSize(12)
      doc.text("Test Report", 105, 30, { align: "center" })
      doc.line(20, 35, 190, 35)

      doc.setFontSize(11)
      doc.text(`Patient: ${patientData?.name}`, 20, 45)
      doc.text(`Patient ID: ${patientData?.patientId}`, 20, 52)
      doc.text(`Test: ${test.name}`, 20, 59)
      doc.text(`Date: ${test.date}`, 20, 66)
      doc.text(`Status: ${test.status}`, 20, 73)

      if (test.report?.content) {
        doc.line(20, 80, 190, 80)
        doc.text("Findings:", 20, 90)
        const splitText = doc.splitTextToSize(test.report.content, 170)
        doc.text(splitText, 20, 100)
      }

      doc.save(`${test.name}_report.pdf`)
    }
  }

  const hasViewableReport = (test: any) => {
    return (
      test.status === "completed" ||
      test.report ||
      test.uploadedReport ||
      test.uploadedFileData ||
      test.report?.fileData ||
      test.report?.content
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="doctor" userName="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patientData) {
    return (
      <DashboardLayout userRole="doctor" userName={doctorInfo?.name || "Doctor"} onLogout={handleLogout}>
        <div className="space-y-6">
          {/* Today's Queue */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                Today&apos;s Patient Queue
              </CardTitle>
              <CardDescription>Patients waiting to be seen</CardDescription>
            </CardHeader>
            <CardContent>
              {activeVisits.length > 0 ? (
                <div className="space-y-3">
                  {activeVisits.map((visit) => (
                    <div
                      key={visit.tokenNumber}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:border-primary/50 ${
                        visit.status === "in-progress"
                          ? "bg-blue-500/10 border-blue-500/20"
                          : visit.status === "completed"
                            ? "bg-green-500/10 border-green-500/20"
                            : "bg-secondary/30 border-border/50"
                      }`}
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
                            : visit.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No patients in queue</p>
              )}
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="mt-4">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Queue
              </Button>
            </CardContent>
          </Card>

          {/* Search by Token */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Search Patient by Token
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter token number (e.g., 001)"
                  value={searchToken}
                  onChange={(e) => setSearchToken(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="doctor" userName={doctorInfo?.name || "Doctor"} onLogout={handleLogout}>
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleBackToSearch} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Queue
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="border-border/50 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCompleteVisit}>
              Complete Visit
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xl">
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
                { label: "Age / Gender", value: `${patientData.age} / ${patientData.gender}` },
                { label: "Contact", value: patientData.contactNumber },
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

        {patientData.currentTests && patientData.currentTests.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Current Tests
              </CardTitle>
              <CardDescription>Tests prescribed for this patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientData.currentTests.map((test, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    test.status === "completed"
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{test.name}</p>
                    <p className="text-sm text-muted-foreground">{test.date}</p>
                    {test.report?.uploadedBy && (
                      <p className="text-xs text-muted-foreground mt-1">Uploaded by: {test.report.uploadedBy}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${
                        test.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {test.status}
                    </span>
                    {hasViewableReport(test) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewReport(test)}
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReport(test)}
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Current Prescriptions */}
        {patientData.currentPrescriptions && patientData.currentPrescriptions.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-400" />
                Current Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patientData.currentPrescriptions.map((presc, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    presc.isIssued ? "bg-green-500/10 border-green-500/20" : "bg-amber-500/10 border-amber-500/20"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-foreground">{presc.medicine}</p>
                    <p className="text-sm text-muted-foreground">
                      {presc.dosage} - {presc.timing}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      presc.isIssued ? "bg-green-500/20 text-green-400" : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {presc.isIssued ? "Issued" : "Pending"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Symptoms Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Current Symptoms</CardTitle>
            <CardDescription>Record patient&apos;s symptoms and observations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter symptoms and observations..."
              value={currentSymptoms}
              onChange={(e) => setCurrentSymptoms(e.target.value)}
              className="min-h-24 bg-secondary/50 border-border/50"
            />
          </CardContent>
        </Card>

        {/* Add Tests Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Prescribe Tests
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newTests.length > 0 && (
              <div className="space-y-2">
                {newTests.map((test, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.date}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveTest(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                placeholder="Test name (e.g., Blood Test, X-Ray)"
                value={newTestName}
                onChange={(e) => setNewTestName(e.target.value)}
                className="bg-secondary/50 border-border/50"
                onKeyDown={(e) => e.key === "Enter" && handleAddTest()}
              />
              <Button onClick={handleAddTest} variant="outline" className="border-border/50 bg-transparent">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Prescription Card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-400" />
              Prescribe Medicines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {newPrescriptions.length > 0 && (
              <div className="space-y-2">
                {newPrescriptions.map((presc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{presc.medicine}</p>
                      <p className="text-xs text-muted-foreground">
                        {presc.dosage} - {presc.timing}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid gap-3">
              <Input
                placeholder="Medicine name"
                value={newMedicineName}
                onChange={(e) => setNewMedicineName(e.target.value)}
                className="bg-secondary/50 border-border/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Dosage (e.g., 500mg)"
                  value={newMedicineDosage}
                  onChange={(e) => setNewMedicineDosage(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <Input
                  placeholder="Timing (e.g., Twice daily)"
                  value={newMedicineTiming}
                  onChange={(e) => setNewMedicineTiming(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
              </div>
              <Button onClick={handleAddMedicine} variant="outline" className="border-border/50 bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {(newTests.length > 0 || newPrescriptions.length > 0) && (
          <Button onClick={handleSaveVisit} className="w-full h-12 text-lg bg-green-600 hover:bg-green-700">
            Save Visit ({newTests.length} tests, {newPrescriptions.length} prescriptions)
          </Button>
        )}

        {/* Medical History */}
        {patientData.medicalHistory && patientData.medicalHistory.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientData.medicalHistory.map((visit, idx) => (
                <div key={idx} className="border-l-2 border-blue-500 pl-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-foreground">{visit.date}</p>
                    <span className="text-xs px-2 py-0.5 bg-secondary text-muted-foreground rounded">
                      Token: {visit.visitToken}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{visit.symptoms}</p>
                  {visit.tests && visit.tests.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Tests:</p>
                      {visit.tests.map((test, tidx) => (
                        <div key={tidx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>• {test.name}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${test.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                          >
                            {test.status}
                          </span>
                          {hasViewableReport(test) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewReport(test)}
                              className="h-6 px-2 text-xs text-cyan-400 hover:bg-cyan-500/10"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {visit.prescriptions && visit.prescriptions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Prescriptions:</p>
                      {visit.prescriptions.map((presc, pidx) => (
                        <div key={pidx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span>
                            • {presc.medicine} - {presc.dosage}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${presc.isIssued ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                          >
                            {presc.isIssued ? "Issued" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              {selectedReport?.name} Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Test Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Test Name</p>
                <p className="font-semibold">{selectedReport?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{selectedReport?.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span
                  className={`text-sm font-semibold ${selectedReport?.status === "completed" ? "text-green-400" : "text-amber-400"}`}
                >
                  {selectedReport?.status}
                </span>
              </div>
              {selectedReport?.report?.uploadedBy && (
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded By</p>
                  <p className="font-semibold">{selectedReport.report.uploadedBy}</p>
                </div>
              )}
            </div>

            {/* Report Findings */}
            {selectedReport?.report?.content && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Findings / Notes:</p>
                <div className="p-4 bg-secondary/30 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{selectedReport.report.content}</p>
                </div>
              </div>
            )}

            {/* Image Preview if available */}
            {selectedReport?.report?.fileData && selectedReport?.report?.fileType?.startsWith("image/") && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Report Image:</p>
                <div className="border border-border/50 rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.report.fileData || "/placeholder.svg"}
                    alt="Report"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            )}

            {/* PDF indicator */}
            {selectedReport?.report?.fileData && selectedReport?.report?.fileType === "application/pdf" && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-400" />
                <div>
                  <p className="font-semibold text-foreground">{selectedReport.report.fileName || "Report.pdf"}</p>
                  <p className="text-sm text-muted-foreground">PDF file uploaded by nurse</p>
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => handleDownloadReport(selectedReport)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
