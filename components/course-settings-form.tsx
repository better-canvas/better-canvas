"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CourseSettingsFormData {
  courseCode: string
  courseName: string
  semester: string
  year: string
  color: string
  enrollmentLimit: string
  allowSelfEnrollment: boolean
  latePolicy: string
  latePenalty: string
  gradeCalculation: string
  showGrades: boolean
  hideStudentNames: boolean
}

const presetColors = [
  "#4F46E5",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
]

export function CourseSettingsForm() {
  const [copied, setCopied] = useState(false)
  const enrollmentCode = "CS61A-SP25-7X9K"

  const { register, control, watch, handleSubmit } =
    useForm<CourseSettingsFormData>({
      defaultValues: {
        courseCode: "CS 61A",
        courseName: "Structure and Interpretation of Computer Programs",
        semester: "Spring",
        year: "2025",
        color: "#4F46E5",
        enrollmentLimit: "",
        allowSelfEnrollment: true,
        latePolicy: "deduct",
        latePenalty: "10",
        gradeCalculation: "simple",
        showGrades: true,
        hideStudentNames: true,
      },
    })

  const latePolicy = watch("latePolicy")
  const selectedColor = watch("color")

  const handleCopy = () => {
    navigator.clipboard.writeText(enrollmentCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = (data: CourseSettingsFormData) => {
    // Handle form submission
    void data
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Basic Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="courseCode" className="text-card-foreground">
                Course Code
              </Label>
              <Input
                id="courseCode"
                {...register("courseCode")}
                className="mt-1.5 bg-secondary border-border text-card-foreground"
              />
            </div>
            <div>
              <Label htmlFor="courseName" className="text-card-foreground">
                Course Name
              </Label>
              <Input
                id="courseName"
                {...register("courseName")}
                className="mt-1.5 bg-secondary border-border text-card-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="text-card-foreground">Semester</Label>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="mt-1.5 bg-secondary border-border text-card-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Spring">Spring</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                      <SelectItem value="Fall">Fall</SelectItem>
                      <SelectItem value="Winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="year" className="text-card-foreground">
                Year
              </Label>
              <Input
                id="year"
                {...register("year")}
                className="mt-1.5 bg-secondary border-border text-card-foreground"
              />
            </div>
          </div>

          <div>
            <Label className="text-card-foreground">Course Color</Label>
            <div className="mt-2 flex gap-2">
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <>
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={cn(
                          "h-8 w-8 rounded-full border-2 transition-all",
                          selectedColor === color
                            ? "border-foreground scale-110"
                            : "border-transparent"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Enrollment</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label className="text-card-foreground">
              Enrollment Code
            </Label>
            <p className="mb-1.5 text-xs text-muted-foreground">
              Share this code with students to join your course
            </p>
            <div className="flex gap-2">
              <Input
                value={enrollmentCode}
                readOnly
                className="bg-muted border-border text-card-foreground font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy enrollment code"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="enrollmentLimit" className="text-card-foreground">
              Enrollment Limit
            </Label>
            <p className="mb-1.5 text-xs text-muted-foreground">
              Leave empty for unlimited enrollment
            </p>
            <Input
              id="enrollmentLimit"
              type="number"
              placeholder="Optional"
              {...register("enrollmentLimit")}
              className="mt-1.5 w-40 bg-secondary border-border text-card-foreground"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">
                Allow Self-Enrollment
              </Label>
              <p className="text-xs text-muted-foreground">
                Students can join using the enrollment code
              </p>
            </div>
            <Controller
              name="allowSelfEnrollment"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grading */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Grading</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label className="text-card-foreground">
              Late Submission Policy
            </Label>
            <Controller
              name="latePolicy"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accept">
                      Accept all late submissions
                    </SelectItem>
                    <SelectItem value="deduct">Deduct points</SelectItem>
                    <SelectItem value="none">
                      No late submissions
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {latePolicy === "deduct" && (
            <div>
              <Label htmlFor="latePenalty" className="text-card-foreground">
                Late Penalty (% per day)
              </Label>
              <Input
                id="latePenalty"
                type="number"
                {...register("latePenalty")}
                className="mt-1.5 w-24 bg-secondary border-border text-card-foreground"
              />
            </div>
          )}

          <div>
            <Label className="text-card-foreground">
              Grade Calculation
            </Label>
            <Controller
              name="gradeCalculation"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="mt-1.5 bg-secondary border-border text-card-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">Simple average</SelectItem>
                    <SelectItem value="weighted">
                      Weighted categories
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Visibility</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">
                Show Grades to Students
              </Label>
              <p className="text-xs text-muted-foreground">
                Students can see their grades after grading
              </p>
            </div>
            <Controller
              name="showGrades"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-card-foreground">
                Hide Student Names
              </Label>
              <p className="text-xs text-muted-foreground">
                Other students cannot see classmate names
              </p>
            </div>
            <Controller
              name="hideStudentNames"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </form>
  )
}
