"use client"

import { useRouter } from "next/navigation"
import { Heart, Stethoscope, Activity, Shield, ArrowRight, Sparkles } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const portals = [
    {
      id: "patient",
      title: "Patient Portal",
      description: "Book appointments, view medical history, and manage your health journey",
      icon: Heart,
      href: "/patient/login",
      gradient: "from-teal-500/20 to-cyan-500/20",
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-400",
      borderColor: "hover:border-teal-500/50",
    },
    {
      id: "doctor",
      title: "Doctor Portal",
      description: "Manage patient records, prescribe treatments, and order diagnostic tests",
      icon: Stethoscope,
      href: "/doctor/login",
      gradient: "from-blue-500/20 to-indigo-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      borderColor: "hover:border-blue-500/50",
    },
    {
      id: "nurse",
      title: "Nurse Portal",
      description: "Perform tests, upload reports, and manage medication dispensing",
      icon: Activity,
      href: "/nurse/login",
      gradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      borderColor: "hover:border-purple-500/50",
    },
    {
      id: "admin",
      title: "Admin Panel",
      description: "Manage staff, view analytics, and maintain hospital operations",
      icon: Shield,
      href: "/admin/login",
      gradient: "from-amber-500/20 to-orange-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      borderColor: "hover:border-amber-500/50",
    },
  ]

  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
                <div className="relative bg-gradient-to-br from-primary to-teal-400 rounded-xl p-2.5">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">MediCare Pro</h1>
                <p className="text-xs text-muted-foreground">Hospital Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3 text-primary" />
                v2.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 bg-secondary/50 border border-border/50 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground">Trusted by 500+ healthcare providers</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight text-balance">
              Modern Healthcare
              <span className="block text-primary">Infrastructure</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Streamline patient care, optimize workflows, and deliver exceptional healthcare experiences with our
              integrated platform.
            </p>
          </div>

          {/* Portal Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {portals.map((portal) => {
              const Icon = portal.icon
              return (
                <button
                  key={portal.id}
                  onClick={() => router.push(portal.href)}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 text-left transition-all duration-300 card-hover ${portal.borderColor}`}
                >
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-xl ${portal.iconBg} mb-4`}>
                      <Icon className={`w-6 h-6 ${portal.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{portal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{portal.description}</p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary">
                      <span>Access Portal</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Features Section */}
          <div className="mt-20 sm:mt-28">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Built for Modern Healthcare</h3>
              <p className="text-muted-foreground max-w-xl mx-auto">
                One integrated system to manage your entire healthcare operation
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { title: "Real-time Updates", desc: "Instant synchronization across all departments" },
                { title: "Secure & Compliant", desc: "HIPAA-ready data protection standards" },
                { title: "Smart Workflows", desc: "Automated task management and notifications" },
              ].map((feature, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl bg-secondary/30 border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 MediCare Pro. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
