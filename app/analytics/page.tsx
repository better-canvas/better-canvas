"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GradeDistributionChart } from "@/components/grade-distribution-chart"
import { StatCards } from "@/components/stat-cards"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track performance across all your courses.
          </p>
        </div>

        <StatCards />
        <GradeDistributionChart />
      </div>
    </DashboardLayout>
  )
}
