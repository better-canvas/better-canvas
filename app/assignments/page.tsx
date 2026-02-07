"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileUpload } from "@/components/file-upload"
import { AssignmentTimeline } from "@/components/assignment-timeline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function AssignmentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const createdDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const submittedDate = isSubmitted ? new Date() : undefined

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Homework 1: Recursion and Tree Recursion
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Due: February 10, 2025 at 11:59 PM
            </span>
            <span className="text-muted-foreground/40">|</span>
            <span className="text-sm text-muted-foreground">
              100 points possible
            </span>
            <span className="text-muted-foreground/40">|</span>
            {isSubmitted ? (
              <Badge className="bg-warning text-warning-foreground text-xs">
                Submitted
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-xs">
                Not Submitted
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    In this homework, you will practice writing recursive
                    functions and tree recursion patterns. These concepts are
                    fundamental to understanding how complex problems can be
                    broken down into simpler sub-problems.
                  </p>
                  <p className="mt-3">
                    You will implement several functions including{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-card-foreground">
                      count_partitions
                    </code>
                    ,{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-card-foreground">
                      tree_map
                    </code>
                    , and{" "}
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-card-foreground">
                      flatten
                    </code>
                    . Make sure to test your solutions thoroughly before
                    submitting.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Submission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload file={file} onFileSelect={setFile} />
                <Button
                  className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={!file || isSubmitted}
                  onClick={() => setIsSubmitted(true)}
                >
                  {isSubmitted ? "Submitted" : "Submit Assignment"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AssignmentTimeline
                  created={createdDate}
                  submitted={submittedDate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
