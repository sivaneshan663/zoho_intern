"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  FileText,
  Pill,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  FileDown,
  AlertCircle,
} from "lucide-react"
import { getPatientById, type PatientRecord } from "@/lib/patient-data"
import { jsPDF } from "jspdf"

export default function MedicalHistory() {
  const router = useRouter()
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [patientData, setPatientData] = useState<PatientRecord | null>(null)
  const [downloadingPdf, setDownloadingPdf] = useState<string | null>(null)
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("patient_session")
    if (session) {
      try {
        const { patientId } = JSON.parse(session)
        const data = getPatientById(patientId)
        setPatientData(data)
      } catch (e) {
        console.error("Error loading patient data:", e)
      }
    }
    setIsLoading(false)

    // Auto-refresh
    const interval = setInterval(() => {
      const session = localStorage.getItem("patient_session")
      if (session) {
        try {
          const { patientId } = JSON.parse(session)
          const data = getPatientById(patientId)
          setPatientData(data)
        } catch (e) {
          console.error("Error refreshing:", e)
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("patient_session")
    router.push("/patient/login")
  }

  const hasViewableContent = (test: any) => {
    return test.status === "completed" || test.report || test.uploadedReport || test.uploadedFileData
  }

  const handleDownloadOriginalFile = async (test: any) => {
    if (!test.uploadedFileData) {
      alert("Original file not available.")
      return
    }
    setDownloadingFile(test.id)
    try {
      const link = document.createElement("a")
      link.href = test.uploadedFileData
      link.download = test.uploadedReport || `${test.name}_report`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      alert("Failed to download file.")
    } finally {
      setDownloadingFile(null)
    }
  }

  const handleDownloadPDF = async (test: any) => {
    setDownloadingPdf(test.id)
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()

      doc.setFillColor(37, 99, 235)
      doc.rect(0, 0, pageWidth, 40, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("Hospital Management System", pageWidth / 2, 20, { align: "center" })
      doc.setFontSize(12)
      doc.text("Medical Test Report", pageWidth / 2, 32, { align: "center" })

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.text(test.report?.title || `${test.name} Report`, 20, 55)

      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      let yPos = 75

      doc.setFillColor(248, 250, 252)
      doc.roundedRect(20, 68, pageWidth - 40, 30, 3, 3, "F")

      doc.setFont("helvetica", "bold")
      doc.text("Patient:", 25, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(patientData?.name || "N/A", 55, yPos)

      doc.setFont("helvetica", "bold")
      doc.text("Date:", 120, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(test.date, 140, yPos)

      yPos += 10
      doc.setFont("helvetica", "bold")
      doc.text("Test:", 25, yPos)
      doc.setFont("helvetica", "normal")
      doc.text(test.name, 55, yPos)

      yPos = 115
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("Report Findings", 20, yPos)

      yPos += 15
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      const content = test.report?.content || `Report file: ${test.uploadedReport || "No file"}`
      const lines = doc.splitTextToSize(content, pageWidth - 40)
      doc.text(lines, 20, yPos)

      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280)

      doc.save(`${test.name.replace(/\s+/g, "_")}_Report.pdf`)
    } catch (error) {
      alert("Failed to generate PDF.")
    } finally {
      setDownloadingPdf(null)
    }
  }

  if (!isLoading && !patientData) {
    return (
      <DashboardLayout userRole="patient">
        <div className="max-w-md mx-auto mt-8">
          <Card className="border-border/50">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-4">Please login to view your medical history.</p>
              <Button onClick={() => router.push("/patient/login")} className="w-full">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="patient" userName={patientData?.name} onLogout={handleLogout}>
      <div className="space-y-6">
        <button
          onClick={() => router.push("/patient/dashboard")}
          className="flex items-center gap-2 text-primary hover:underline font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Medical History</h2>
          <p className="text-muted-foreground">Timeline of your visits, tests, and prescriptions</p>
        </div>

        {/* Report Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{selectedReport.report?.title || `${selectedReport.name} Report`}</CardTitle>
                  <CardDescription>{selectedReport.date}</CardDescription>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-muted-foreground hover:text-foreground">
                  X
                </button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                  {selectedReport.report?.content ? (
                    <p className="text-foreground whitespace-pre-wrap font-mono text-sm">
                      {selectedReport.report.content}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p>
                        <span className="font-semibold">Test:</span> {selectedReport.name}
                      </p>
                      <p>
                        <span className="font-semibold">Status:</span> {selectedReport.status}
                      </p>
                      {selectedReport.uploadedReport && (
                        <p>
                          <span className="font-semibold">File:</span> {selectedReport.uploadedReport}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {selectedReport.uploadedFileData && selectedReport.uploadedFileType?.startsWith("image/") && (
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <p className="text-sm font-medium p-3 bg-secondary/30 border-b border-border/50">Preview</p>
                    <div className="p-4 flex justify-center">
                      <img
                        src={selectedReport.uploadedFileData || "/placeholder.svg"}
                        alt="Report"
                        className="max-w-full max-h-[300px] object-contain rounded"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {selectedReport.uploadedFileData && (
                    <Button
                      onClick={() => handleDownloadOriginalFile(selectedReport)}
                      disabled={downloadingFile === selectedReport.id}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {downloadingFile === selectedReport.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-4 h-4 mr-2" />
                          Download Original File
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDownloadPDF(selectedReport)}
                    disabled={downloadingPdf === selectedReport.id}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {downloadingPdf === selectedReport.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF Summary
                      </>
                    )}
                  </Button>
                  <Button onClick={() => setSelectedReport(null)} variant="outline" className="w-full border-border/50">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {patientData?.medicalHistory?.length ? (
            patientData.medicalHistory.map((entry, index) => (
              <Card key={index} className="border-l-4 border-l-primary border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{entry.department}</CardTitle>
                      <CardDescription>
                        {entry.date} - {entry.doctor}
                      </CardDescription>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${entry.visitStatus === "completed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}
                    >
                      {entry.visitStatus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Symptoms</p>
                      <p className="text-foreground">{entry.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Diagnosis</p>
                      <p className="text-foreground">{entry.diagnosis}</p>
                    </div>
                  </div>

                  {entry.tests?.length > 0 && (
                    <div className="border-t border-border/50 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <p className="text-sm font-semibold text-foreground">Tests</p>
                      </div>
                      <div className="space-y-2">
                        {entry.tests.map((test, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-4 h-4 text-blue-400" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{test.name}</p>
                                {test.uploadedReport && (
                                  <p className="text-xs text-muted-foreground">{test.uploadedReport}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${test.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                              >
                                {test.status === "completed" ? (
                                  <CheckCircle2 className="w-3 h-3" />
                                ) : (
                                  <Clock className="w-3 h-3" />
                                )}
                                {test.status}
                              </span>
                              {hasViewableContent(test) && (
                                <Button
                                  onClick={() => setSelectedReport(test)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-400 hover:text-blue-500"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.prescriptions?.length > 0 && (
                    <div className="border-t border-border/50 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Pill className="w-4 h-4 text-green-400" />
                        <p className="text-sm font-semibold text-foreground">Prescriptions</p>
                      </div>
                      <div className="space-y-2">
                        {entry.prescriptions.map((presc, idx) => (
                          <div key={idx} className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-semibold text-foreground">{presc.medicine}</p>
                                <p className="text-xs text-muted-foreground">
                                  {presc.dosage} - {presc.timing}
                                </p>
                              </div>
                              {presc.isIssued && (
                                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Dispensed
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center text-muted-foreground">No medical history available</CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
