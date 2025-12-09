"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, RefreshCw, Ticket } from "lucide-react"
import {
  getAllStaff,
  getAllPatients,
  getActiveVisitsForToday,
  type StaffUser,
  type PatientRecord,
  type ActiveVisit,
} from "@/lib/patient-data"

const ADMIN_SESSION_KEY = "admin_session"

export default function AdminDashboard() {
  const router = useRouter()
  const [adminInfo, setAdminInfo] = useState<{ staffId: string; name: string } | null>(null)
  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [activeVisits, setActiveVisits] = useState<ActiveVisit[]>([])
  const [activeSection, setActiveSection] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (!session) {
      router.push("/admin/login")
      return
    }
    try {
      const info = JSON.parse(session)
      setAdminInfo(info)
      loadData()
    } catch (e) {
      router.push("/admin/login")
    }
    setIsLoading(false)
  }, [router])

  const loadData = () => {
    setStaffList(getAllStaff())
    setPatients(getAllPatients())
    setActiveVisits(getActiveVisitsForToday())
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY)
    router.push("/admin/login")
  }

  const quickActions = [
    {
      id: "add-doctor",
      label: "Add Doctor",
      icon: UserPlus,
      color: "bg-blue-500/10 text-blue-400",
      onClick: () => router.push("/admin/add-staff?role=doctor"),
    },
    {
      id: "add-nurse",
      label: "Add Nurse",
      icon: UserPlus,
      color: "bg-green-500/10 text-green-400",
      onClick: () => router.push("/admin/add-staff?role=nurse"),
    },
    {
      id: "view-staff",
      label: "View Staff List",
      icon: Users,
      color: "bg-purple-500/10 text-purple-400",
      onClick: () => setActiveSection("staff"),
    },
  ]

  if (isLoading) {
    return (
      <DashboardLayout userRole="admin" userName="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin" userName={adminInfo?.name || "Admin"} onLogout={handleLogout}>
      {activeSection === "overview" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Total Staff</p>
                <p className="text-4xl font-bold text-foreground">{staffList.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Doctors</p>
                <p className="text-4xl font-bold text-blue-400">
                  {staffList.filter((s) => s.role === "doctor").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Nurses</p>
                <p className="text-4xl font-bold text-green-400">
                  {staffList.filter((s) => s.role === "nurse").length}
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-2">Registered Patients</p>
                <p className="text-4xl font-bold text-purple-400">{patients.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Visits */}
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  Today&apos;s Visits
                </CardTitle>
                <CardDescription>Patient visits for today</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {activeVisits.length > 0 ? (
                <div className="space-y-3">
                  {activeVisits.map((visit) => (
                    <div
                      key={visit.tokenNumber}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-primary">{visit.tokenNumber}</div>
                        <div>
                          <p className="font-semibold text-foreground">{visit.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {visit.department} - {visit.doctor}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full capitalize ${
                          visit.status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : visit.status === "in-progress"
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
                <p className="text-center text-muted-foreground py-8">No visits today</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Card
                    key={action.id}
                    className="cursor-pointer border-border/50 hover:border-primary/50 transition-all"
                    onClick={action.onClick}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className={`p-3 rounded-full ${action.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-foreground">{action.label}</h3>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Staff List */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>All hospital staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffList.slice(0, 5).map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-secondary/30"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {staff.id} - {staff.department || staff.role}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        staff.role === "doctor"
                          ? "bg-blue-500/10 text-blue-400"
                          : staff.role === "nurse"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {staff.role}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeSection === "staff" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Staff List</h2>
              <p className="text-muted-foreground">All hospital staff members</p>
            </div>
            <Button onClick={() => setActiveSection("overview")} variant="outline" className="border-border/50">
              Back to Overview
            </Button>
          </div>

          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{staff.name}</p>
                      <p className="text-sm text-muted-foreground">{staff.id}</p>
                      {staff.department && <p className="text-sm text-primary mt-1">{staff.department}</p>}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        staff.role === "doctor"
                          ? "bg-blue-500/10 text-blue-400"
                          : staff.role === "nurse"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {staff.role}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
