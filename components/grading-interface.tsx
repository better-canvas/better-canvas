"use client"

import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import {
  Check,
  Clock,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { students, type Student } from "@/lib/data"

function StatusIcon({ status }: { status: Student["submissionStatus"] }) {
  switch (status) {
    case "graded":
      return <Check className="h-4 w-4 text-emerald-500" />
    case "submitted":
      return <Clock className="h-4 w-4 text-amber-500" />
    case "not-submitted":
      return <X className="h-4 w-4 text-red-500" />
  }
}

export function GradingInterface() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [points, setPoints] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, string>>({})
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const selected = students[selectedIndex]

  useEffect(() => {
    const defaults: Record<string, string> = {}
    const defaultFeedback: Record<string, string> = {}
    students.forEach((s) => {
      if (s.earnedPoints !== undefined) defaults[s.id] = String(s.earnedPoints)
      if (s.feedback) defaultFeedback[s.id] = s.feedback
    })
    setPoints(defaults)
    setFeedback(defaultFeedback)
  }, [])

  const handlePointsChange = useCallback(
    (value: string) => {
      setPoints((prev) => ({ ...prev, [selected.id]: value }))
      setSavedAt(null)
      const timeout = setTimeout(() => {
        setSavedAt(format(new Date(), "h:mm:ss a"))
      }, 1000)
      return () => clearTimeout(timeout)
    },
    [selected.id]
  )

  const handleFeedbackChange = useCallback(
    (value: string) => {
      setFeedback((prev) => ({ ...prev, [selected.id]: value }))
      setSavedAt(null)
      const timeout = setTimeout(() => {
        setSavedAt(format(new Date(), "h:mm:ss a"))
      }, 1000)
      return () => clearTimeout(timeout)
    },
    [selected.id]
  )

  const initials = selected.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
      <Card className="border-border bg-card lg:w-80 shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-card-foreground">Students</CardTitle>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <div className="flex flex-col">
            {students.map((student, index) => {
              const sInitials = student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
              return (
                <button
                  key={student.id}
                  onClick={() => {
                    setSelectedIndex(index)
                    setSavedAt(null)
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    index === selectedIndex
                      ? "border-l-4 border-l-primary bg-primary/5"
                      : "border-l-4 border-l-transparent hover:bg-muted/50"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                      {sInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm font-medium text-card-foreground">
                    {student.name}
                  </span>
                  <StatusIcon status={student.submissionStatus} />
                </button>
              )
            })}
          </div>
        </ScrollArea>
      </Card>

      <Card className="flex-1 border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-card-foreground">
              {selected.name}
            </CardTitle>
            {savedAt && (
              <span className="text-xs text-success">
                Saved at {savedAt}
              </span>
            )}
          </div>
          {selected.submittedAt && (
            <p className="text-sm text-muted-foreground">
              Submitted{" "}
              {format(selected.submittedAt, "MMM d, yyyy 'at' h:mm a")}
              {selected.submittedAt > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) && (
                <span className="ml-2 text-xs text-destructive font-medium">
                  Late
                </span>
              )}
            </p>
          )}
          {!selected.submittedAt && (
            <p className="text-sm text-muted-foreground">
              No submission received
            </p>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {selected.file && (
            <Button variant="outline" className="w-fit gap-2">
              <FileText className="h-4 w-4" />
              View {selected.file}
            </Button>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              Points Earned
            </label>
            <div className="flex items-baseline gap-2">
              <Input
                type="number"
                min={0}
                max={100}
                value={points[selected.id] ?? ""}
                onChange={(e) => handlePointsChange(e.target.value)}
                className="w-32 text-center text-4xl font-bold h-16 bg-secondary border-border text-card-foreground"
                disabled={!selected.file}
              />
              <span className="text-2xl text-muted-foreground">/ 100</span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-card-foreground">
              Feedback
            </label>
            <Textarea
              value={feedback[selected.id] ?? ""}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              placeholder="Enter feedback for student..."
              className="h-32 resize-none bg-secondary border-border text-card-foreground"
              disabled={!selected.file}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() =>
                setSelectedIndex(Math.max(0, selectedIndex - 1))
              }
              disabled={selectedIndex === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {selectedIndex + 1} of {students.length}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setSelectedIndex(
                  Math.min(students.length - 1, selectedIndex + 1)
                )
              }
              disabled={selectedIndex === students.length - 1}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
