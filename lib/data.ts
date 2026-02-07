export interface Course {
  id: string
  code: string
  name: string
  semester: string
  color: string
  assignmentsDue: number
  studentCount: number
  grade?: number | null  // Percentage grade (0-100) or null if N/A
  upcomingAssignments?: Assignment[]  // List of upcoming assignments
}

export interface Assignment {
  id: string
  courseId: string
  courseCode: string
  courseColor: string
  name: string
  dueDate: Date
  status: "not-submitted" | "submitted" | "graded"
  points: number
  earnedPoints?: number
  isOverdue?: boolean  // Computed helper
  dueProximity?: 'overdue' | 'today' | 'this-week' | 'future'  // For styling
}

export interface Student {
  id: string
  name: string
  avatar?: string
  submissionStatus: "graded" | "submitted" | "not-submitted"
  submittedAt?: Date
  file?: string
  earnedPoints?: number
  feedback?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  postedBy: {
    name: string
    avatar?: string
  }
  postedAt: Date
  isPinned?: boolean
}

// Helper function to calculate due date proximity
function calculateDueProximity(dueDate: Date): 'overdue' | 'today' | 'this-week' | 'future' {
  const today = new Date()
  const dateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const diffTime = dateOnly.getTime() - todayOnly.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'overdue'
  if (diffDays === 0) return 'today'
  if (diffDays <= 7) return 'this-week'
  return 'future'
}

export const assignments: Assignment[] = [
  // Biology 101 assignments
  {
    id: "biol-quiz5",
    courseId: "biol101",
    courseCode: "BIOL 101",
    courseColor: "#10B981",
    name: "Chapter 5 Quiz",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    status: "not-submitted",
    points: 50,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  {
    id: "biol-lab3",
    courseId: "biol101",
    courseCode: "BIOL 101",
    courseColor: "#10B981",
    name: "Lab Report 3",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Feb 12
    status: "not-submitted",
    points: 100,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  {
    id: "biol-discussion",
    courseId: "biol101",
    courseCode: "BIOL 101",
    courseColor: "#10B981",
    name: "Discussion Post: Cell Division",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Feb 14
    status: "not-submitted",
    points: 30,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  // English 203 assignments
  {
    id: "eng-essay-draft",
    courseId: "eng203",
    courseCode: "ENGL 203",
    courseColor: "#3B82F6",
    name: "Essay Draft",
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // OVERDUE (Feb 5)
    status: "not-submitted",
    points: 100,
    isOverdue: true,
    dueProximity: 'overdue',
  },
  {
    id: "eng-peer-review",
    courseId: "eng203",
    courseCode: "ENGL 203",
    courseColor: "#3B82F6",
    name: "Peer Review Assignment",
    dueDate: new Date(), // Today
    status: "not-submitted",
    points: 50,
    isOverdue: false,
    dueProximity: 'today',
  },
  {
    id: "eng-final-essay",
    courseId: "eng203",
    courseCode: "ENGL 203",
    courseColor: "#3B82F6",
    name: "Final Essay",
    dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // Feb 20
    status: "not-submitted",
    points: 200,
    isOverdue: false,
    dueProximity: 'future',
  },
  // Computer Science 150 assignments
  {
    id: "cs-prog4",
    courseId: "cs150",
    courseCode: "CS 150",
    courseColor: "#8B5CF6",
    name: "Programming Assignment 4",
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Feb 11
    status: "not-submitted",
    points: 150,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  {
    id: "cs-midterm",
    courseId: "cs150",
    courseCode: "CS 150",
    courseColor: "#8B5CF6",
    name: "Midterm Exam",
    dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // Feb 18
    status: "not-submitted",
    points: 300,
    isOverdue: false,
    dueProximity: 'future',
  },
  // History 101 assignments
  {
    id: "hist-quiz7",
    courseId: "hist101",
    courseCode: "HIST 101",
    courseColor: "#EAB308",
    name: "Reading Quiz Chapter 7",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
    status: "not-submitted",
    points: 40,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  {
    id: "hist-primary",
    courseId: "hist101",
    courseCode: "HIST 101",
    courseColor: "#EAB308",
    name: "Primary Source Analysis",
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // Feb 13
    status: "not-submitted",
    points: 100,
    isOverdue: false,
    dueProximity: 'this-week',
  },
  {
    id: "hist-discussion",
    courseId: "hist101",
    courseCode: "HIST 101",
    courseColor: "#EAB308",
    name: "Discussion Response",
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Feb 15
    status: "not-submitted",
    points: 30,
    isOverdue: false,
    dueProximity: 'future',
  },
  {
    id: "hist-outline",
    courseId: "hist101",
    courseCode: "HIST 101",
    courseColor: "#EAB308",
    name: "Research Paper Outline",
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Feb 17
    status: "not-submitted",
    points: 80,
    isOverdue: false,
    dueProximity: 'future',
  },
  // Mathematics 201 assignments
  {
    id: "math-ps6",
    courseId: "math201",
    courseCode: "MATH 201",
    courseColor: "#F97316",
    name: "Problem Set 6",
    dueDate: new Date(), // Today
    status: "not-submitted",
    points: 100,
    isOverdue: false,
    dueProximity: 'today',
  },
  {
    id: "math-ps7",
    courseId: "math201",
    courseCode: "MATH 201",
    courseColor: "#F97316",
    name: "Problem Set 7",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Feb 14
    status: "not-submitted",
    points: 100,
    isOverdue: false,
    dueProximity: 'this-week',
  },
]

export const courses: Course[] = [
  {
    id: "biol101",
    code: "BIOL 101",
    name: "Introduction to Biology",
    semester: "Spring 2025",
    color: "#10B981",
    assignmentsDue: 3,
    studentCount: 320,
    grade: 92,
    upcomingAssignments: assignments.filter(a => a.courseId === "biol101"),
  },
  {
    id: "eng203",
    code: "ENGL 203",
    name: "Advanced Composition",
    semester: "Spring 2025",
    color: "#3B82F6",
    assignmentsDue: 3,
    studentCount: 85,
    grade: 87,
    upcomingAssignments: assignments.filter(a => a.courseId === "eng203"),
  },
  {
    id: "cs150",
    code: "CS 150",
    name: "Data Structures and Algorithms",
    semester: "Spring 2025",
    color: "#8B5CF6",
    assignmentsDue: 2,
    studentCount: 180,
    grade: 95,
    upcomingAssignments: assignments.filter(a => a.courseId === "cs150"),
  },
  {
    id: "hist101",
    code: "HIST 101",
    name: "World History",
    semester: "Spring 2025",
    color: "#EAB308",
    assignmentsDue: 4,
    studentCount: 150,
    grade: 78,
    upcomingAssignments: assignments.filter(a => a.courseId === "hist101"),
  },
  {
    id: "math201",
    code: "MATH 201",
    name: "Calculus II",
    semester: "Spring 2025",
    color: "#F97316",
    assignmentsDue: 2,
    studentCount: 220,
    grade: null, // N/A - not yet graded
    upcomingAssignments: assignments.filter(a => a.courseId === "math201"),
  },
  {
    id: "psych101",
    code: "PSYC 101",
    name: "Introduction to Psychology",
    semester: "Spring 2025",
    color: "#EC4899",
    assignmentsDue: 0,
    studentCount: 280,
    grade: 89,
    upcomingAssignments: [], // No upcoming assignments
  },
]

export const students: Student[] = [
  {
    id: "s1",
    name: "Alice Chen",
    submissionStatus: "graded",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    file: "homework1.pdf",
    earnedPoints: 95,
    feedback: "Great work! Minor issue on problem 3.",
  },
  {
    id: "s2",
    name: "Bob Smith",
    submissionStatus: "submitted",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    file: "hw1_bob.pdf",
  },
  {
    id: "s3",
    name: "Carol Wu",
    submissionStatus: "not-submitted",
  },
  {
    id: "s4",
    name: "David Kim",
    submissionStatus: "graded",
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    file: "hw1_david.pdf",
    earnedPoints: 88,
    feedback: "Good effort. Review problem 2 concepts.",
  },
  {
    id: "s5",
    name: "Eva Martinez",
    submissionStatus: "submitted",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    file: "homework1_eva.pdf",
  },
]

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "Homework 1 Due Date Extended",
    content:
      "Due to the holiday, HW1 is now due Feb 12 instead of Feb 10. Please use the extra time wisely to review your solutions.",
    postedBy: { name: "Prof. John DeNero" },
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isPinned: true,
  },
  {
    id: "a2",
    title: "Office Hours Updated",
    content:
      "Starting this week, office hours will be held in Soda 271 on Tuesdays and Thursdays from 2-4 PM. Please check the calendar for the latest schedule.",
    postedBy: { name: "TA Sarah Johnson" },
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: "a3",
    title: "Midterm 1 Information",
    content:
      "Midterm 1 will cover lectures 1-10 and homework 1-3. A review session will be held on Friday at 5 PM in Wheeler Auditorium.",
    postedBy: { name: "Prof. John DeNero" },
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
]

export const gradeDistribution = [
  { grade: "F", range: "0-59", count: 2, fill: "#EF4444" },
  { grade: "D", range: "60-69", count: 3, fill: "#F97316" },
  { grade: "C", range: "70-79", count: 8, fill: "#EAB308" },
  { grade: "B", range: "80-89", count: 12, fill: "#3B82F6" },
  { grade: "A", range: "90-100", count: 15, fill: "#10B981" },
]
