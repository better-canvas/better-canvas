"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AnnouncementCard } from "@/components/announcement-card"
import { announcements } from "@/lib/data"

export default function AnnouncementsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Announcements
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay up to date with the latest course announcements.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
