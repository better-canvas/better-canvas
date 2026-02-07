"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CourseCardsGrid } from "@/components/course-card"
import { Card } from "@/components/ui/card"
import { Clock, Calendar, TrendingUp, CheckCircle2 } from "lucide-react"
import { courses, assignments } from "@/lib/data"

export default function DashboardPage() {
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>()

  // Calculate stats
  const pendingSubmissions = assignments.filter(a => a.status === "not-submitted").length
  const upcomingDeadlines = assignments.filter(a => {
    const daysUntilDue = Math.ceil((a.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return daysUntilDue >= 0 && daysUntilDue <= 7
  }).length
  const gradedAssignments = assignments.filter(a => a.status === "graded")
  const averageGrade = gradedAssignments.length > 0
    ? (gradedAssignments.reduce((sum, a) => sum + ((a.earnedPoints || 0) / a.points * 100), 0) / gradedAssignments.length).toFixed(1)
    : "N/A"

  return (
    <DashboardLayout
      activeCourseId={activeCourseId}
      onSelectCourse={(id) =>
        setActiveCourseId(id === activeCourseId ? undefined : id)
      }
    >
      <div className="flex gap-8">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-8 max-w-5xl">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-base text-muted-foreground">
              Welcome back! Here's what's happening in your courses.
            </p>
          </div>

          <section>
            <CourseCardsGrid courses={courses} />
          </section>
        </div>

        {/* Right Sidebar - Stat Cards */}
        <aside className="w-72 flex-shrink-0 space-y-3">
          {/* Pending Submissions */}
          <Card className="p-5 bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-1">{pendingSubmissions}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-foreground">Pending Submissions</div>
                <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">Across {courses.length} courses</div>
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="p-5 bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-1">{upcomingDeadlines}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-foreground">Upcoming Deadlines</div>
                <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">Next 7 days</div>
              </div>
            </div>
          </Card>

          {/* Current Average */}
          <Card className="p-5 bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-1">{averageGrade}%</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-foreground">Current Average</div>
                <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">Across all courses</div>
              </div>
            </div>
          </Card>

          {/* Assignments Graded */}
          <Card className="p-5 bg-white dark:bg-card border border-gray-200 dark:border-border hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground mb-1">{gradedAssignments.length}/{assignments.length}</div>
                <div className="text-sm font-semibold text-gray-700 dark:text-foreground">Assignments Graded</div>
                <div className="text-xs text-gray-500 dark:text-muted-foreground mt-1">This semester</div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </DashboardLayout>
  )
}
