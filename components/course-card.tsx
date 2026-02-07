"use client"

import { Users, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Course } from "@/lib/data"

// Utility function for relative date formatting
function formatDueDate(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Reset time to compare dates only
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate())

  if (dateOnly < todayOnly) {
    return "Overdue"
  } else if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Today"
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return "Tomorrow"
  } else {
    // Format as "Mon, Feb 10"
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group relative cursor-pointer border border-gray-200 dark:border-border bg-white dark:bg-card transition-all hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600">
      {/* Color bar at top - slightly thicker */}
      <div className="h-2 rounded-t-lg" style={{ backgroundColor: course.color }} />

      {/* Grade Badge - Top Right */}
      {course.grade !== undefined && course.grade !== null ? (
        <Badge
          className={cn(
            "absolute top-4 right-4 font-bold text-sm px-3 py-1 hover:bg-opacity-90 shadow-sm",
            course.grade >= 90 ? "bg-green-500 text-white hover:bg-green-500" :
            course.grade >= 80 ? "bg-blue-500 text-white hover:bg-blue-500" :
            course.grade >= 70 ? "bg-yellow-500 text-gray-900 hover:bg-yellow-500" :
            "bg-red-500 text-white hover:bg-red-500"
          )}
          aria-label={`Current grade: ${course.grade}%`}
        >
          {course.grade}%
        </Badge>
      ) : (
        <Badge variant="secondary" className="absolute top-4 right-4 font-semibold text-sm px-3 py-1" aria-label="Grade not available">
          N/A
        </Badge>
      )}

      <CardContent className="p-6">
        {/* Course Header */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-card-foreground">{course.code}</h3>
        <p className="mt-1.5 truncate text-sm text-gray-600 dark:text-muted-foreground font-medium">
          {course.name}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground/70">
          {course.semester}
        </p>

        {/* Due Soon Section */}
        <div className="mt-5 border-t border-gray-200 dark:border-border pt-4">
          <h4 className="text-xs font-bold text-gray-700 dark:text-muted-foreground uppercase tracking-wide mb-3">
            Due Soon
          </h4>

          {course.upcomingAssignments && course.upcomingAssignments.length > 0 ? (
            <div className="space-y-2.5">
              {course.upcomingAssignments.slice(0, 5).map((assignment) => (
                <div key={assignment.id} className="flex items-start justify-between gap-3 text-xs">
                  <span className={cn(
                    "truncate flex-1 leading-relaxed",
                    assignment.isOverdue ? "text-red-600 dark:text-red-500 font-semibold" : "text-gray-700 dark:text-foreground"
                  )}>
                    {assignment.isOverdue && "⚠ "}
                    {assignment.name}
                  </span>
                  <span className={cn(
                    "shrink-0 font-medium",
                    assignment.isOverdue && "text-red-600 dark:text-red-500",
                    assignment.dueProximity === 'today' && "text-orange-600 dark:text-orange-500 font-semibold",
                    !assignment.isOverdue && assignment.dueProximity !== 'today' && "text-gray-500 dark:text-muted-foreground"
                  )}>
                    {formatDueDate(assignment.dueDate)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-muted-foreground/60 italic">
              No upcoming assignments
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface CourseCardsGridProps {
  courses: Course[]
}

export function CourseCardsGrid({ courses }: CourseCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
