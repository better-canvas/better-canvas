"use client"

import { Users, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Course } from "@/lib/data"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group cursor-pointer border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="h-1 rounded-t-lg" style={{ backgroundColor: course.color }} />
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-card-foreground">{course.code}</h3>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {course.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground/70">
          {course.semester}
        </p>
        <div className="mt-4 border-t border-border pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5 text-destructive" />
              {course.assignmentsDue} due
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {course.studentCount}
            </span>
          </div>
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
