"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart, ArrowLeft, AlertCircle, UserPlus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loginPatient, loginStaff, resetDatabase } from "@/lib/patient-data"

interface LoginFormProps {
  title: string
  idLabel: string
  dashboardRoute: string
  userType: "patient" | "doctor" | "nurse" | "admin"
  onBack?: () => void
  showRegister?: boolean
}

export function LoginForm({ title, idLabel, dashboardRoute, userType, onBack, showRegister }: LoginFormProps) {
  const router = useRouter()
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingSession = localStorage.getItem(`${userType}_session`)
      if (existingSession) {
        router.push(dashboardRoute)
      }
    }
  }, [userType, dashboardRoute, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      let user = null

      if (userType === "patient") {
        user = loginPatient(id, password)
        if (user) {
          localStorage.setItem(
            "patient_session",
            JSON.stringify({
              patientId: user.patientId,
              name: user.name,
            }),
          )
        }
      } else {
        user = loginStaff(id, password)
        if (user && user.role === userType) {
          localStorage.setItem(
            `${userType}_session`,
            JSON.stringify({
              staffId: user.id,
              name: user.name,
              role: user.role,
              department: user.department,
            }),
          )
        } else if (user && user.role !== userType) {
          setError(`This ID belongs to a ${user.role}, not a ${userType}`)
          setLoading(false)
          return
        }
      }

      if (user) {
        router.push(dashboardRoute)
      } else {
        setError("Invalid ID or password. Please try again.")
      }
      setLoading(false)
    }, 500)
  }

  const handleResetDatabase = () => {
    resetDatabase()
    setError("")
    setId("")
    setPassword("")
    window.location.reload()
  }

  const getDemoCredentials = () => {
    switch (userType) {
      case "patient":
        return [
          { id: "P001", pass: "patient123", name: "Vaseekar" },
          { id: "P002", pass: "patient123", name: "Hariharan" },
        ]
      case "doctor":
        return [
          { id: "D001", pass: "doctor123", name: "Dr. Kaviya (Cardiology)" },
          { id: "D002", pass: "doctor123", name: "Dr. Pragadish (General)" },
        ]
      case "nurse":
        return [
          { id: "N001", pass: "nurse123", name: "Nurse Surya" },
          { id: "N002", pass: "nurse123", name: "Nurse Rohith" },
        ]
      case "admin":
        return [{ id: "A001", pass: "admin123", name: "Admin Krishiv" }]
      default:
        return []
    }
  }

  const fillDemoCredentials = (demoId: string, demoPass: string) => {
    setId(demoId)
    setPassword(demoPass)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background gradient-mesh flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">{idLabel}</label>
              <Input
                type="text"
                placeholder={`Enter your ${idLabel.toLowerCase()}`}
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                className="border-border/50 bg-secondary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-border/50 bg-secondary/50"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {showRegister && (
            <Button
              variant="outline"
              className="w-full mt-3 border-border/50 bg-transparent"
              onClick={() => router.push("/patient/register")}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              New Patient? Register Here
            </Button>
          )}

          <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border/50">
            <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials (click to auto-fill):</p>
            <div className="space-y-1">
              {getDemoCredentials().map((cred, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => fillDemoCredentials(cred.id, cred.pass)}
                  className="block w-full text-left text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 p-1 rounded transition-colors"
                >
                  ID: {cred.id}, Pass: {cred.pass} ({cred.name})
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDatabase}
            className="w-full mt-3 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3 mr-2" />
            Reset Demo Database
          </Button>

          <div className="mt-4 text-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 justify-center text-primary hover:underline font-medium text-sm mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
