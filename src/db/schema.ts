import { pgTable, uuid, varchar, text, decimal, timestamp, boolean, index } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'student', 'instructor', 'ta'
  createdAt: timestamp('created_at').defaultNow(),
});

// Courses table
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 20 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  semester: varchar('semester', { length: 20 }).notNull(),
  color: varchar('color', { length: 7 }), // Hex color
  instructorId: uuid('instructor_id').references(() => users.id),
  inviteCode: varchar('invite_code', { length: 8 }).notNull().unique(), // For students to join
  createdAt: timestamp('created_at').defaultNow(),
});

// Enrollments table (many-to-many)
export const enrollments = pgTable('enrollments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'student', 'ta', 'instructor'
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userCourseIdx: index('enrollments_user_course_idx').on(table.userId, table.courseId),
}));

// Assignments table
export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  pointsPossible: decimal('points_possible', { precision: 5, scale: 2 }).notNull().default('100'),
  dueDate: timestamp('due_date').notNull(),
  allowLate: boolean('allow_late').default(true),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  courseDueDateIdx: index('assignments_course_due_date_idx').on(table.courseId, table.dueDate),
}));

// Submissions table
export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id').references(() => assignments.id).notNull(),
  studentId: uuid('student_id').references(() => users.id).notNull(),
  fileUrl: varchar('file_url', { length: 500 }),
  fileName: varchar('file_name', { length: 255 }),
  submittedAt: timestamp('submitted_at').defaultNow(),
  isLate: boolean('is_late').default(false),
}, (table) => ({
  assignmentStudentIdx: index('submissions_assignment_student_idx').on(table.assignmentId, table.studentId),
}));

// Grades table
export const grades = pgTable('grades', {
  id: uuid('id').primaryKey().defaultRandom(),
  submissionId: uuid('submission_id').references(() => submissions.id).notNull().unique(),
  pointsEarned: decimal('points_earned', { precision: 5, scale: 2 }),
  feedback: text('feedback'),
  gradedBy: uuid('graded_by').references(() => users.id),
  gradedAt: timestamp('graded_at').defaultNow(),
});

// Announcements table
export const announcements = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  postedBy: uuid('posted_by').references(() => users.id).notNull(),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  courseCreatedIdx: index('announcements_course_created_idx').on(table.courseId, table.createdAt),
}));
