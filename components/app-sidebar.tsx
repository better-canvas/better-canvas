"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Settings,
  BarChart3,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { courses } from "@/lib/data"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AppSidebarProps {
  open: boolean
  onClose: () => void
  activeCourseId?: string
  onSelectCourse: (courseId: string) => void
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Assignments", href: "/assignments", icon: FileText },
  { label: "Grading", href: "/grading", icon: ClipboardCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar({
  open,
  onClose,
  activeCourseId,
  onSelectCourse,
}: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <span className="text-lg font-semibold text-sidebar-foreground">
            Courses
          </span>
        </div>

        <ScrollArea className="flex-1">
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="px-3 pb-2">
            <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              My Courses
            </div>
            <div className="flex flex-col gap-1">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    onSelectCourse(course.id)
                    onClose()
                  }}
                  className={cn(
                    "flex flex-col items-start rounded-md px-3 py-2.5 text-left transition-colors",
                    activeCourseId === course.id
                      ? "bg-primary/10"
                      : "hover:bg-sidebar-accent"
                  )}
                >
                  <div className="flex w-full items-center gap-2">
                    <div
                      className="h-6 w-1 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        activeCourseId === course.id
                          ? "text-primary"
                          : "text-sidebar-foreground"
                      )}
                    >
                      {course.code}
                    </span>
                  </div>
                  <p className="ml-3 mt-0.5 truncate text-xs text-muted-foreground max-w-[180px]">
                    {course.name}
                  </p>
                  <p className="ml-3 mt-0.5 text-[11px] text-muted-foreground/70">
                    {course.semester}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
