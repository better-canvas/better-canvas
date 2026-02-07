"use client"

import { format } from "date-fns"
import { Check, Clock, FileText, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssignmentTimelineProps {
  created: Date
  submitted?: Date
  graded?: Date
}

interface TimelineNode {
  label: string
  date?: Date
  icon: React.ElementType
  status: "completed" | "current" | "future"
  color: string
}

export function AssignmentTimeline({
  created,
  submitted,
  graded,
}: AssignmentTimelineProps) {
  const nodes: TimelineNode[] = [
    {
      label: "Assignment created",
      date: created,
      icon: FileText,
      status: "completed",
      color: "text-muted-foreground",
    },
    {
      label: submitted ? "Submitted by student" : "Awaiting submission",
      date: submitted,
      icon: Clock,
      status: submitted ? (graded ? "completed" : "current") : "future",
      color: submitted ? "text-warning" : "text-muted-foreground",
    },
    {
      label: graded ? "Graded by instructor" : "Awaiting grading",
      date: graded,
      icon: Award,
      status: graded ? "completed" : submitted ? "current" : "future",
      color: graded ? "text-success" : "text-muted-foreground",
    },
  ]

  return (
    <div className="flex flex-col gap-0">
      {nodes.map((node, index) => {
        const Icon = node.icon
        const isLast = index === nodes.length - 1

        return (
          <div key={node.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2",
                  node.status === "completed" &&
                    "border-success bg-success/10",
                  node.status === "current" &&
                    "animate-pulse border-warning bg-warning/10",
                  node.status === "future" &&
                    "border-border bg-muted"
                )}
              >
                {node.status === "completed" ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      node.status === "current"
                        ? "text-warning"
                        : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "my-1 h-8 w-0.5",
                    node.status === "completed"
                      ? "bg-success/40"
                      : "bg-border"
                  )}
                />
              )}
            </div>
            <div className="pb-6">
              <p className="text-sm font-medium text-card-foreground">
                {node.label}
              </p>
              {node.date && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {format(node.date, "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
