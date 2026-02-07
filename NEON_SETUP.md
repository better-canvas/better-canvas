# Neon Database Setup Guide

> Quick setup guide for getting your Neon Postgres database ready for the Canvas MVP

---

## Step 1: Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in with GitHub
3. Click "Create Project"
4. Project settings:
   - **Name**: canvas-mvp
   - **Region**: Choose closest to your users (e.g., US East for East Coast)
   - **Postgres version**: 16 (latest)
5. Click "Create Project"

---

## Step 2: Get Connection String

1. After project creation, you'll see a connection string like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
2. **Copy this entire string** - you'll need it for `.env.local`

---

## Step 3: Run Initial Schema

### Option A: Using Drizzle Kit (Recommended)

1. **Create Drizzle schema file**:

Create `src/db/schema.ts`:

```typescript
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
```

2. **Create Drizzle config**:

Create `drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

3. **Push schema to Neon**:

```bash
# Install dependencies
npm install drizzle-orm postgres
npm install -D drizzle-kit dotenv

# Push schema to database
npx drizzle-kit push:pg
```

### Option B: Using SQL Directly

If you prefer to run SQL directly in Neon's console:

1. Go to your Neon project dashboard
2. Click "SQL Editor"
3. Paste and run this SQL:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'ta')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  semester VARCHAR(20) NOT NULL,
  color VARCHAR(7),
  instructor_id UUID REFERENCES users(id),
  invite_code VARCHAR(8) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  course_id UUID REFERENCES courses(id) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'ta', 'instructor')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_possible DECIMAL(5,2) NOT NULL DEFAULT 100,
  due_date TIMESTAMP NOT NULL,
  allow_late BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) NOT NULL,
  student_id UUID REFERENCES users(id) NOT NULL,
  file_url VARCHAR(500),
  file_name VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT NOW(),
  is_late BOOLEAN DEFAULT false,
  UNIQUE(assignment_id, student_id)
);

-- Grades table
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) UNIQUE NOT NULL,
  points_earned DECIMAL(5,2),
  feedback TEXT,
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by UUID REFERENCES users(id) NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_announcements_course ON announcements(course_id);
```

---

## Step 4: Database Connection Setup

Create `src/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Disable prefetch for serverless
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
```

---

## Step 5: Environment Variables

Add to `.env.local`:

```env
# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Vercel Blob (for file uploads)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

---

## Step 6: Verify Connection

Create `src/app/api/test-db/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected!',
      userCount: result.length 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
```

Test by visiting: `http://localhost:3000/api/test-db`

---

## Step 7: Seed Data (Optional for Testing)

Create `src/db/seed.ts`:

```typescript
import { db } from './index';
import { users, courses, enrollments, assignments } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create instructor
  const [instructor] = await db.insert(users).values({
    email: 'instructor@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
    name: 'Prof. John DeNero',
    role: 'instructor',
  }).returning();

  // Create students
  const [student1] = await db.insert(users).values({
    email: 'alice@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
    name: 'Alice Chen',
    role: 'student',
  }).returning();

  const [student2] = await db.insert(users).values({
    email: 'bob@example.com',
    passwordHash: await bcrypt.hash('password123', 10),
    name: 'Bob Smith',
    role: 'student',
  }).returning();

  // Create course
  const [course] = await db.insert(courses).values({
    code: 'CS 61A',
    name: 'Structure and Interpretation of Computer Programs',
    semester: 'Spring 2025',
    color: '#4F46E5',
    instructorId: instructor.id,
    inviteCode: 'CS61A001',
  }).returning();

  // Enroll students
  await db.insert(enrollments).values([
    { userId: instructor.id, courseId: course.id, role: 'instructor' },
    { userId: student1.id, courseId: course.id, role: 'student' },
    { userId: student2.id, courseId: course.id, role: 'student' },
  ]);

  // Create assignments
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.insert(assignments).values([
    {
      courseId: course.id,
      title: 'Homework 1: Recursion',
      description: 'Complete problems on recursion and tree recursion.',
      pointsPossible: '100',
      dueDate: tomorrow,
    },
    {
      courseId: course.id,
      title: 'Lab 2: Higher Order Functions',
      description: 'Practice with lambda and map/filter/reduce.',
      pointsPossible: '50',
      dueDate: new Date(tomorrow.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  console.log('✅ Seed completed!');
  console.log('Login credentials:');
  console.log('  Instructor: instructor@example.com / password123');
  console.log('  Student 1: alice@example.com / password123');
  console.log('  Student 2: bob@example.com / password123');
}

seed().catch(console.error);
```

Run seed:
```bash
npx tsx src/db/seed.ts
```

---

## Neon Features to Leverage

### 1. **Branching** (Free Dev Databases)
- Create a branch for testing: `main` → `dev`
- Each branch gets its own connection string
- Test schema changes without affecting production
- Command:
  ```bash
  neon branches create --project-id <project-id> --name dev
  ```

### 2. **Auto-Suspend**
- Neon automatically suspends inactive databases after 5 minutes
- Wakes up in <500ms on first query
- **Perfect for MVP**: No cost when not in use

### 3. **Connection Pooling**
- Use PgBouncer connection string for serverless functions
- Replace `ep-xxx.us-east-2.aws.neon.tech` with `ep-xxx.us-east-2.aws.neon.tech:6543`
- Prevents connection limit issues with Vercel

---

## Common Issues & Solutions

### Issue 1: "Too many connections"
**Solution**: Use pooled connection string (port 6543) or enable connection pooling in Neon dashboard.

### Issue 2: "SSL required"
**Solution**: Ensure `?sslmode=require` is in your connection string.

### Issue 3: Slow cold starts
**Solution**: This is normal for auto-suspended databases. First query takes ~500ms. Subsequent queries are fast.

### Issue 4: Migration conflicts
**Solution**: Use Drizzle's `push` command for MVP (no migration files). For production, use `drizzle-kit generate`.

---

## Monitoring & Debugging

### Neon Dashboard
- **Metrics**: Query performance, connection count, storage usage
- **Logs**: See all SQL queries executed
- **Branches**: Manage database branches

### Query Logs in Code
Enable query logging for development:

```typescript
// src/db/index.ts
const client = postgres(connectionString, { 
  prepare: false,
  onnotice: (notice) => console.log('Notice:', notice),
  debug: process.env.NODE_ENV === 'development',
});
```

---

## Scaling Considerations

### MVP (Now)
- **Compute**: Shared (free tier) - 1 vCPU, 1 GB RAM
- **Storage**: 0.5 GB included
- **Data transfer**: 5 GB/month

### Post-Launch (If needed)
- Upgrade to **Pro** ($19/month): 4 vCPU, 8 GB RAM
- Auto-scaling for traffic spikes
- Point-in-time recovery
- 99.95% uptime SLA

**For MVP**: Free tier handles 100+ users easily.

---

## Backup & Recovery

### Automatic Backups
- Neon takes daily backups automatically (retained for 7 days on free tier)
- Point-in-time recovery available on Pro plan

### Manual Backup
Export to SQL file:
```bash
pg_dump $DATABASE_URL > backup.sql
```

Restore from backup:
```bash
psql $DATABASE_URL < backup.sql
```

---

## Production Checklist

Before launching:
- [ ] Enable connection pooling (port 6543)
- [ ] Add indexes to frequently queried columns
- [ ] Set up monitoring/alerts in Neon dashboard
- [ ] Create production branch separate from dev
- [ ] Test under load (use tools like `k6` or `artillery`)
- [ ] Enable SSL certificate pinning (optional, advanced)

---

## Quick Reference

### Connection Methods

**Direct connection** (for migrations, scripts):
```typescript
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL!);
```

**Drizzle ORM** (for app queries):
```typescript
import { db } from '@/db';
import { users } from '@/db/schema';

const allUsers = await db.select().from(users);
```

**Raw SQL with Drizzle**:
```typescript
import { sql } from 'drizzle-orm';
const result = await db.execute(sql`SELECT * FROM users WHERE role = 'student'`);
```

---

## Support & Resources

- **Neon Docs**: https://neon.tech/docs
- **Drizzle Docs**: https://orm.drizzle.team
- **Discord**: https://discord.gg/neon (Neon community)

---

**You're all set!** Database is ready for the Canvas MVP. Now start building those API routes. 🚀
