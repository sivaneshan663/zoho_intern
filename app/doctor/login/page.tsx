"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/shared/login-form"

export default function DoctorLogin() {
  const router = useRouter()

  return (
    <LoginForm
      title="Doctor Login"
      idLabel="Doctor ID"
      dashboardRoute="/doctor/dashboard"
      userType="doctor"
      onBack={() => router.push("/")}
    />
  )
}
