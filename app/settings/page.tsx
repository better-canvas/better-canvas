"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { CourseSettingsForm } from "@/components/course-settings-form"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Course Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure your course settings, enrollment, and grading policies.
          </p>
        </div>

        <CourseSettingsForm />
      </div>
    </DashboardLayout>
  )
}
