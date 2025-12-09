"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/shared/login-form"

export default function PatientLogin() {
  const router = useRouter()

  return (
    <LoginForm
      title="Patient Login"
      idLabel="Patient ID"
      dashboardRoute="/patient/dashboard"
      userType="patient"
      onBack={() => router.push("/")}
      showRegister={true}
    />
  )
}
