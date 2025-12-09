"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/shared/login-form"

export default function NurseLogin() {
  const router = useRouter()

  return (
    <LoginForm
      title="Nurse Login"
      idLabel="Nurse ID"
      dashboardRoute="/nurse/dashboard"
      userType="nurse"
      onBack={() => router.push("/")}
    />
  )
}
