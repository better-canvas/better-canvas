"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GradingInterface } from "@/components/grading-interface"
import { GradeDistributionChart } from "@/components/grade-distribution-chart"

export default function GradingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Grading: Homework 1
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            CS 61A - Recursion and Tree Recursion
          </p>
        </div>

        <GradingInterface />
        <GradeDistributionChart />
      </div>
    </DashboardLayout>
  )
}
