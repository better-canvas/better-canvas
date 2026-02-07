export interface Course {
  id: string
  code: string
  name: string
  semester: string
  color: string
  assignmentsDue: number
  studentCount: number
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

export const courses: Course[] = [
  {
    id: "cs61a",
    code: "CS 61A",
    name: "Structure and Interpretation of Computer Programs",
    semester: "Spring 2025",
    color: "#4F46E5",
    assignmentsDue: 3,
    studentCount: 450,
  },
  {
    id: "eecs16a",
    code: "EECS 16A",
    name: "Designing Information Devices and Systems I",
    semester: "Spring 2025",
    color: "#10B981",
    assignmentsDue: 1,
    studentCount: 380,
  },
  {
    id: "data100",
    code: "Data 100",
    name: "Principles and Techniques of Data Science",
    semester: "Spring 2025",
    color: "#8B5CF6",
    assignmentsDue: 2,
    studentCount: 520,
  },
]

export const assignments: Assignment[] = [
  {
    id: "hw1",
    courseId: "cs61a",
    courseCode: "CS 61A",
    courseColor: "#4F46E5",
    name: "Homework 1: Recursion and Tree Recursion",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "not-submitted",
    points: 100,
  },
  {
    id: "lab2",
    courseId: "cs61a",
    courseCode: "CS 61A",
    courseColor: "#4F46E5",
    name: "Lab 2: Higher-Order Functions",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "not-submitted",
    points: 50,
  },
  {
    id: "hw2",
    courseId: "eecs16a",
    courseCode: "EECS 16A",
    courseColor: "#10B981",
    name: "Homework 2: Linear Algebra Foundations",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "submitted",
    points: 80,
  },
  {
    id: "proj1",
    courseId: "data100",
    courseCode: "Data 100",
    courseColor: "#8B5CF6",
    name: "Project 1: Data Cleaning and EDA",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "not-submitted",
    points: 200,
  },
  {
    id: "hw1-data",
    courseId: "data100",
    courseCode: "Data 100",
    courseColor: "#8B5CF6",
    name: "Homework 1: Pandas and NumPy",
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "graded",
    points: 100,
    earnedPoints: 92,
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
