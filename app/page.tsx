"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCards } from "@/components/stat-cards"
import { CourseCardsGrid } from "@/components/course-card"
import { AssignmentsTable } from "@/components/assignments-table"
import { AnnouncementCard } from "@/components/announcement-card"
import { courses, assignments, announcements } from "@/lib/data"

export default function DashboardPage() {
  const [activeCourseId, setActiveCourseId] = useState<string | undefined>()

  const filteredAssignments = activeCourseId
    ? assignments.filter((a) => a.courseId === activeCourseId)
    : assignments

  const sortedAssignments = [...filteredAssignments].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  )

  return (
    <DashboardLayout
      activeCourseId={activeCourseId}
      onSelectCourse={(id) =>
        setActiveCourseId(id === activeCourseId ? undefined : id)
      }
    >
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back, John. Here is what is happening in your courses.
          </p>
        </div>

        <StatCards />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            My Courses
          </h2>
          <CourseCardsGrid courses={courses} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Upcoming Assignments
          </h2>
          <AssignmentsTable assignments={sortedAssignments} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Announcements
          </h2>
          <div className="flex flex-col gap-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
              />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
