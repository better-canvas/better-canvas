"use client"

import { Pin, Megaphone } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Announcement } from "@/lib/data"

interface AnnouncementCardProps {
  announcement: Announcement
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const initials = announcement.postedBy.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Card
      className={cn(
        "border-border",
        announcement.isPinned
          ? "bg-primary/5 border-primary/20"
          : "bg-card"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-primary" />
          <Badge variant="secondary" className="text-xs">
            Announcement
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(announcement.postedAt, { addSuffix: true })}
          </span>
          {announcement.isPinned && (
            <Pin className="ml-auto h-4 w-4 text-primary" />
          )}
        </div>

        <h3 className="mt-3 text-xl font-semibold text-card-foreground">
          {announcement.title}
        </h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">
          {announcement.content}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {announcement.postedBy.name}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
