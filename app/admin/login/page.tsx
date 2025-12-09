"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/shared/login-form"

export default function AdminLogin() {
  const router = useRouter()

  return (
    <LoginForm
      title="Admin Login"
      idLabel="Admin ID"
      dashboardRoute="/admin/dashboard"
      userType="admin"
      onBack={() => router.push("/")}
    />
  )
}
