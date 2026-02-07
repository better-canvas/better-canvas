"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AppSidebar } from "@/components/app-sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeCourseId?: string
  onSelectCourse?: (courseId: string) => void
}

export function DashboardLayout({
  children,
  activeCourseId,
  onSelectCourse,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeCourseId={activeCourseId}
          onSelectCourse={onSelectCourse ?? (() => {})}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
