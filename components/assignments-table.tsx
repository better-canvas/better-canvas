"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Assignment } from "@/lib/data"

interface AssignmentsTableProps {
  assignments: Assignment[]
}

function getStatusBadge(status: Assignment["status"]) {
  switch (status) {
    case "not-submitted":
      return (
        <Badge variant="destructive" className="text-xs">
          Not Submitted
        </Badge>
      )
    case "submitted":
      return (
        <Badge className="bg-warning text-warning-foreground text-xs">
          Submitted
        </Badge>
      )
    case "graded":
      return (
        <Badge className="bg-success text-success-foreground text-xs">
          Graded
        </Badge>
      )
  }
}

export function AssignmentsTable({ assignments }: AssignmentsTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Course</TableHead>
            <TableHead className="text-muted-foreground">Assignment</TableHead>
            <TableHead className="text-muted-foreground">Due Date</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-right text-muted-foreground">
              Points
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow
              key={assignment.id}
              className="cursor-pointer transition-colors hover:bg-muted/50"
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: assignment.courseColor }}
                  />
                  <span className="text-sm font-medium text-card-foreground">
                    {assignment.courseCode}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href="/assignments"
                  className="text-sm text-card-foreground hover:text-primary hover:underline"
                >
                  {assignment.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(assignment.dueDate, { addSuffix: true })}
              </TableCell>
              <TableCell>{getStatusBadge(assignment.status)}</TableCell>
              <TableCell className="text-right text-sm text-card-foreground">
                {assignment.earnedPoints !== undefined
                  ? `${assignment.earnedPoints}/${assignment.points}`
                  : `${assignment.points} pts`}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
