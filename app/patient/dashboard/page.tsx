"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Activity,
  History,
  FileText,
  Pill,
  Bell,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Ticket,
} from "lucide-react"
import { getPatientById, getPatientActiveVisit, type PatientRecord, type ActiveVisit } from "@/lib/patient-data"

export default function PatientDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("overview")
  const [patientData, setPatientData] = useState<PatientRecord | null>(null)
  const [activeVisit, setActiveVisit] = useState<ActiveVisit | null>(null)
  const [notifications, setNotifications] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("patient_session")
    if (!session) {
      router.push("/patient/login")
      return
    }

    try {
      const { patientId } = JSON.parse(session)
      const patient = getPatientById(patientId)
      if (patient) {
        setPatientData(patient)
        const visit = getPatientActiveVisit(patientId)
        setActiveVisit(visit)
        generateNotifications(patient)
      } else {
        router.push("/patient/login")
      }
    } catch (e) {
      router.push("/patient/login")
    }
    setIsLoading(false)
  }, [router])

  const generateNotifications = (data: PatientRecord) => {
    const newNotifications: string[] = []
    if (data.medicalHistory?.length > 0) {
      const latestVisit = data.medicalHistory[data.medicalHistory.length - 1]
      const pendingTests = latestVisit.tests?.filter((t) => t.status === "pending")
      const completedTests = latestVisit.tests?.filter((t) => t.status === "completed")
      if (completedTests?.length > 0) {
        newNotifications.push(`${completedTests.length} test report(s) are ready to view`)
      }
      if (pendingTests?.length > 0) {
        newNotifications.push(`${pendingTests.length} test(s) are pending`)
      }
    }
    setNotifications(newNotifications)
  }

  const handleRefresh = () => {
    if (patientData) {
      const updated = getPatientById(patientData.patientId)
      if (updated) {
        setPatientData(updated)
        const visit = getPatientActiveVisit(updated.patientId)
        setActiveVisit(visit)
        generateNotifications(updated)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("patient_session")
    router.push("/patient/login")
  }

  const menuItems = [
    { id: "appointments", label: "Book Appointment", icon: Calendar, color: "bg-teal-500/10 text-teal-400" },
    { id: "token", label: "View Token Status", icon: Ticket, color: "bg-blue-500/10 text-blue-400" },
    { id: "history", label: "Medical History", icon: History, color: "bg-purple-500/10 text-purple-400" },
    { id: "prescriptions", label: "My Prescriptions", icon: Pill, color: "bg-amber-500/10 text-amber-400" },
    { id: "reports", label: "Test Reports", icon: FileText, color: "bg-pink-500/10 text-pink-400" },
    { id: "visits", label: "Visit History", icon: Activity, color: "bg-cyan-500/10 text-cyan-400" },
  ]

  const getLatestVisit = () => {
    if (patientData?.medicalHistory?.length) {
      return patientData.medicalHistory[patientData.medicalHistory.length - 1]
    }
    return null
  }

  if (isLoading) {
    return (
      <DashboardLayout userRole="patient" userName="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patientData) return null

  return (
    <DashboardLayout userRole="patient" userName={patientData.name} onLogout={handleLogout}>
      {activeSection === "overview" && (
        <div className="space-y-6">
          {/* Active Token Card */}
          {activeVisit && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl animate-pulse">
                      <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Your Active Token</p>
                      <p className="text-5xl font-bold text-primary">{activeVisit.tokenNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">Status: {activeVisit.status}</p>
                    </div>
                  </div>
                  <div className="text-center md:text-right p-4 bg-secondary/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Appointment Details</p>
                    <p className="font-semibold text-foreground">{activeVisit.department}</p>
                    <p className="text-sm text-muted-foreground">{activeVisit.doctor}</p>
                    <p className="text-sm text-primary">{activeVisit.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {notifications.length > 0 && (
            <Card className="border-l-4 border-l-primary border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <p className="font-semibold text-foreground">Notifications</p>
                </div>
                <ul className="space-y-2">
                  {notifications.map((note, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {note}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Patient Info */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Your personal health profile</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh} className="text-muted-foreground">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Patient ID", value: patientData.patientId },
                  { label: "Name", value: patientData.name },
                  { label: "Age", value: `${patientData.age} years` },
                  { label: "Blood Group", value: patientData.bloodGroup || "N/A" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Active Token",
                value: activeVisit?.tokenNumber || "None",
                icon: Ticket,
                color: "text-amber-400 bg-amber-500/10",
              },
              {
                label: "Completed Tests",
                value: getLatestVisit()?.tests?.filter((t) => t.status === "completed").length || 0,
                icon: FileText,
                color: "text-blue-400 bg-blue-500/10",
              },
              {
                label: "Prescriptions",
                value: getLatestVisit()?.prescriptions?.length || 0,
                icon: Pill,
                color: "text-green-400 bg-green-500/10",
              },
              {
                label: "Total Visits",
                value: patientData.medicalHistory?.length || 0,
                icon: TrendingUp,
                color: "text-purple-400 bg-purple-500/10",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <Card key={idx} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Card
                    key={item.id}
                    className="cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-300 card-hover group"
                    onClick={() => {
                      if (item.id === "appointments") router.push("/patient/book-appointment")
                      else if (item.id === "history") router.push("/patient/medical-history")
                      else if (item.id === "token") setActiveSection("token")
                      else setActiveSection(item.id)
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className={`inline-flex p-3 rounded-xl mb-3 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </h3>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeSection === "token" && (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setActiveSection("overview")} className="mb-4 text-muted-foreground">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Overview
          </Button>
          <Card className="border-border/50 max-w-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Token Status
              </CardTitle>
              <CardDescription>Your current visit token information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeVisit ? (
                <>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Your Token Number</p>
                    <p className="text-6xl font-bold text-primary">{activeVisit.tokenNumber}</p>
                    <p className="text-sm text-muted-foreground mt-2 capitalize">Status: {activeVisit.status}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-xl">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Visit Details</p>
                    <p className="font-semibold text-foreground">{activeVisit.department}</p>
                    <p className="text-sm text-muted-foreground">{activeVisit.doctor}</p>
                    <p className="text-sm text-primary">
                      {activeVisit.date} at {activeVisit.time}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No active token for today</p>
                  <Button onClick={() => router.push("/patient/book-appointment")}>Book an Appointment</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {(activeSection === "prescriptions" || activeSection === "reports" || activeSection === "visits") && (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setActiveSection("overview")} className="mb-4 text-muted-foreground">
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Overview
          </Button>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>
                {activeSection === "prescriptions" && "My Prescriptions"}
                {activeSection === "reports" && "Test Reports"}
                {activeSection === "visits" && "Visit History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getLatestVisit() ? (
                <div className="space-y-4">
                  {activeSection === "prescriptions" &&
                    getLatestVisit()?.prescriptions?.map((presc, idx) => (
                      <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <p className="font-semibold text-foreground">{presc.medicine}</p>
                        <p className="text-sm text-muted-foreground">
                          {presc.dosage} - {presc.timing}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${presc.isIssued ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                        >
                          {presc.isIssued ? "Issued" : "Pending"}
                        </span>
                      </div>
                    ))}
                  {activeSection === "reports" &&
                    getLatestVisit()?.tests?.map((test, idx) => (
                      <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <p className="font-semibold text-foreground">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.date}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${test.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}
                        >
                          {test.status}
                        </span>
                      </div>
                    ))}
                  {activeSection === "visits" &&
                    patientData.medicalHistory?.map((visit, idx) => (
                      <div key={idx} className="p-4 bg-secondary/30 rounded-lg border border-border/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">{visit.department}</p>
                            <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                            <p className="text-sm text-primary">{visit.date}</p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${visit.visitStatus === "completed" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}
                          >
                            {visit.visitStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
