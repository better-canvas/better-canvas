"use client"

import {
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatItem {
  label: string
  value: string
  subtext: string
  icon: React.ElementType
  iconColor: string
  iconBg: string
}

const stats: StatItem[] = [
  {
    label: "Pending Submissions",
    value: "6",
    subtext: "Across 3 courses",
    icon: Clock,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    label: "Upcoming Deadlines",
    value: "4",
    subtext: "Next 7 days",
    icon: Calendar,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    label: "Current Average",
    value: "87.5%",
    subtext: "Across all courses",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
  {
    label: "Assignments Graded",
    value: "12/15",
    subtext: "This week",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="border-border bg-card">
            <CardContent className="p-6">
              <div className={`inline-flex rounded-full p-3 ${stat.iconBg}`}>
                <Icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <p className="mt-3 text-3xl font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground/70">{stat.subtext}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
