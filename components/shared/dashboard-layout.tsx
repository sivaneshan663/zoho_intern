"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  LogOut,
  Menu,
  X,
  Heart,
  Home,
  Calendar,
  History,
  FileText,
  Pill,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: string
  userName?: string
  onLogout?: () => void
}

const navigationItems = {
  patient: [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/patient/dashboard" },
    { id: "appointments", label: "Book Appointment", icon: Calendar, href: "/patient/book-appointment" },
    { id: "history", label: "Medical History", icon: History, href: "/patient/medical-history" },
    { id: "prescriptions", label: "Prescriptions", icon: Pill, href: "/patient/prescriptions" },
    { id: "reports", label: "Test Reports", icon: FileText, href: "/patient/test-reports" },
  ],
  doctor: [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/doctor/dashboard" },
    { id: "patients", label: "Patient Details", icon: Users, href: "/doctor/patient-details" },
    { id: "prescription", label: "Add Prescription", icon: Pill, href: "/doctor/add-prescription" },
    { id: "tests", label: "Test Approval", icon: FileText, href: "/doctor/test-approval" },
  ],
  nurse: [{ id: "dashboard", label: "Dashboard", icon: Home, href: "/nurse/dashboard" }],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin/dashboard" },
    { id: "staff", label: "Add Staff", icon: Users, href: "/admin/add-staff" },
    { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
  ],
}

const roleColors = {
  patient: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  doctor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  nurse: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  admin: "bg-amber-500/10 text-amber-400 border-amber-500/20",
}

export function DashboardLayout({ children, userRole, userName = "User", onLogout }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    }
    router.push("/")
  }

  const navItems = navigationItems[userRole as keyof typeof navigationItems] || []
  const roleColor = roleColors[userRole as keyof typeof roleColors] || roleColors.patient

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-teal-400 rounded-lg p-1.5">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-foreground">MediCare Pro</h1>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <span className={cn("text-xs px-2 py-0.5 rounded-full border capitalize", roleColor)}>{userRole}</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed lg:sticky lg:top-[57px] left-0 w-64 h-[calc(100vh-57px)] bg-card border-r border-border/50 overflow-y-auto transition-transform duration-300 z-40",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Need help?</p>
              <p className="text-xs text-foreground">Contact support at</p>
              <p className="text-xs text-primary">support@medicare.com</p>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-57px)]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
