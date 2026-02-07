"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gradeDistribution } from "@/lib/data"

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { grade: string; count: number; range: string } }>
}) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-md">
        <p className="text-sm font-medium text-popover-foreground">
          Grade {data.grade} ({data.range})
        </p>
        <p className="text-xs text-muted-foreground">
          {data.count} students
        </p>
      </div>
    )
  }
  return null
}

export function GradeDistributionChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Grade Distribution: Homework 1
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Average: 85.3 | Median: 87 | Std Dev: 8.2
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistribution}>
              <XAxis
                dataKey="grade"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gradeDistribution.map((entry) => (
                  <Cell key={entry.grade} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
