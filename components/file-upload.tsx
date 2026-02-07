"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  file: File | null
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export function FileUpload({ onFileSelect, file }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!isDragging) setIsDragging(true)
    },
    [isDragging]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile) onFileSelect(droppedFile)
    },
    [onFileSelect]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile) onFileSelect(selectedFile)
    },
    [onFileSelect]
  )

  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <FileText className="h-8 w-8 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-card-foreground">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onFileSelect(null)}
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        "flex h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/50 hover:border-primary/50"
      )}
      role="button"
      tabIndex={0}
      aria-label="Upload file"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
    >
      <Upload
        className={cn(
          "h-10 w-10",
          isDragging ? "text-primary" : "text-muted-foreground"
        )}
      />
      <p className="mt-3 text-sm font-medium text-card-foreground">
        Drag and drop your file here
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        or{" "}
        <span className="text-primary underline">click to browse</span>
      </p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />
    </div>
  )
}
