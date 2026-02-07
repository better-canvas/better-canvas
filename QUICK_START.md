# Canvas MVP - Quick Start Guide

> Your step-by-step guide to shipping the MVP in 6 hours

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Neon account created (free tier)
- [ ] Vercel account created (free tier)
- [ ] 6 hours of focused time 🔥

---

## 🚀 Hour 0: Setup (30 minutes)

### Step 1: Create Next.js Project

```bash
# Create new Next.js app
npx create-next-app@latest canvas-mvp --typescript --tailwind --app --import-alias "@/*"

cd canvas-mvp
```

When prompted:
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ❌ Customize default import alias: No

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install drizzle-orm postgres @vercel/blob next-auth@beta
npm install @tanstack/react-query zustand react-dropzone recharts
npm install bcryptjs date-fns nanoid

# Dev dependencies
npm install -D drizzle-kit @types/bcryptjs @types/node dotenv

# shadcn/ui (CLI will prompt for config)
npx shadcn-ui@latest init
```

When shadcn prompts:
- Style: Default
- Base color: Slate
- CSS variables: Yes

### Step 3: Install shadcn Components

```bash
npx shadcn-ui@latest add button card input label textarea select badge avatar dropdown-menu table sidebar toast
```

### Step 4: Setup Neon Database

1. Go to [neon.tech](https://neon.tech) and create project
2. Copy connection string
3. Create `.env.local`:

```env
# Neon Database
DATABASE_URL="your-connection-string-here"

# NextAuth
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# Vercel Blob (add later when needed)
BLOB_READ_WRITE_TOKEN=""
```

### Step 5: Setup Database Schema

1. **Copy the schema from NEON_SETUP.md** to `src/db/schema.ts`
2. **Copy the db connection file** to `src/db/index.ts`
3. **Create drizzle.config.ts** in root directory
4. **Push schema to Neon**:

```bash
npx drizzle-kit push:pg
```

### Step 6: Verify Setup

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      time: result.rows[0].now 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown' 
    }, { status: 500 });
  }
}
```

**Test**: Visit `http://localhost:3000/api/health`

✅ **Setup Complete!** You should see `{"status":"healthy","database":"connected",...}`

---

## ⏱️ Hour 1: Authentication (60 minutes)

### Tasks:
1. Setup NextAuth with credentials provider
2. Create signup/login pages
3. Protect routes with middleware

### Files to Create:

#### `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);
        
        if (!user) return null;
        
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        
        if (!passwordMatch) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
});

export { handler as GET, handler as POST };
```

#### `src/app/(auth)/login/page.tsx`

Use shadcn form components for login form. See V0_PROMPTS.md or build manually.

#### `src/app/(auth)/signup/page.tsx`

Similar to login, but with role selection (student/instructor).

#### `src/middleware.ts`

```typescript
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*'],
};
```

### Test Hour 1:
- [ ] Can sign up as student
- [ ] Can sign up as instructor
- [ ] Can log in with created account
- [ ] Visiting `/dashboard` redirects to `/login` when not authenticated

---

## ⏱️ Hour 2: Course Management (60 minutes)

### Tasks:
1. Create course creation form (instructor)
2. Create course join flow (student)
3. Build course list dashboard
4. Implement drag-and-drop course reordering

### API Routes to Create:

#### `src/app/api/courses/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/db';
import { courses, enrollments } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// GET: List user's courses
export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userCourses = await db
    .select()
    .from(courses)
    .innerJoin(enrollments, eq(courses.id, enrollments.courseId))
    .where(eq(enrollments.userId, session.user.id));

  return NextResponse.json(userCourses);
}

// POST: Create new course (instructor only)
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id || session.user.role !== 'instructor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { code, name, semester, color } = body;

  const [course] = await db
    .insert(courses)
    .values({
      code,
      name,
      semester,
      color,
      instructorId: session.user.id,
      inviteCode: nanoid(8),
    })
    .returning();

  // Enroll instructor
  await db.insert(enrollments).values({
    userId: session.user.id,
    courseId: course.id,
    role: 'instructor',
  });

  return NextResponse.json(course);
}
```

#### `src/app/api/courses/join/route.ts`

```typescript
// POST: Join course via invite code
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { inviteCode } = await req.json();

  const [course] = await db
    .select()
    .from(courses)
    .where(eq(courses.inviteCode, inviteCode))
    .limit(1);

  if (!course) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 404 });
  }

  // Check if already enrolled
  const existing = await db
    .select()
    .from(enrollments)
    .where(
      and(
        eq(enrollments.userId, session.user.id),
        eq(enrollments.courseId, course.id)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ error: 'Already enrolled' }, { status: 400 });
  }

  await db.insert(enrollments).values({
    userId: session.user.id,
    courseId: course.id,
    role: 'student',
  });

  return NextResponse.json(course);
}
```

### Components to Build:

- `CourseCard` (draggable, use V0_PROMPTS.md)
- `CreateCourseModal` (instructor)
- `JoinCourseModal` (student)
- `DashboardLayout` with sidebar

### Test Hour 2:
- [ ] Instructor can create course
- [ ] Student can join course via code
- [ ] Both see courses on dashboard
- [ ] Can drag to reorder courses (persist order to user preferences)

---

## ⏱️ Hour 3: Assignments (Instructor) (60 minutes)

### Tasks:
1. Assignment creation form
2. Assignment list view
3. Submission inbox
4. Download all submissions

### API Routes:

#### `src/app/api/courses/[courseId]/assignments/route.ts`

```typescript
// GET: List assignments for course
// POST: Create new assignment (instructor only)
```

#### `src/app/api/assignments/[id]/submissions/route.ts`

```typescript
// GET: List all submissions for assignment (instructor only)
```

#### `src/app/api/assignments/[id]/download/route.ts`

```typescript
// GET: Download all submissions as ZIP
import archiver from 'archiver';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Fetch all submissions
  // Create ZIP archive
  // Stream to response
}
```

### Components:

- `AssignmentForm` (create/edit)
- `AssignmentList` (table with status badges)
- `SubmissionInbox` (grid of student submissions)

### Test Hour 3:
- [ ] Instructor can create assignment
- [ ] Assignment appears in list
- [ ] Can view submission inbox (empty for now)

---

## ⏱️ Hour 4: Submissions & Grading (60 minutes)

### Tasks:
1. Student file upload
2. Instructor grading interface
3. Auto-save grades
4. Student view grades

### Setup Vercel Blob:

```bash
npm install @vercel/blob
```

Get token from Vercel dashboard → Storage → Create Blob Store

#### `src/app/api/upload/route.ts`

```typescript
import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const blob = await put(file.name, file, { access: 'public' });

  return NextResponse.json({ url: blob.url });
}
```

#### `src/app/api/assignments/[id]/submit/route.ts`

```typescript
// POST: Submit assignment (student)
export async function POST(req: NextRequest, { params }) {
  const session = await getServerSession();
  const { fileUrl, fileName } = await req.json();

  // Check if assignment exists and is not past due
  // Create submission record
  // Return submission
}
```

#### `src/app/api/submissions/[id]/grade/route.ts`

```typescript
// PUT: Grade submission (instructor/TA)
export async function PUT(req: NextRequest, { params }) {
  const { pointsEarned, feedback } = await req.json();

  // Update or create grade record
  // Return updated grade
}
```

### Components:

- `FileUploader` (drag-and-drop, use react-dropzone)
- `GradingInterface` (see V0_PROMPTS.md)
- `GradeViewer` (student sees their grade + feedback)

### Test Hour 4:
- [ ] Student can upload file
- [ ] Instructor sees submission in inbox
- [ ] Instructor can enter grade + feedback
- [ ] Student can view their grade

---

## ⏱️ Hour 5: Dashboards & Gradebook (60 minutes)

### Tasks:
1. Student dashboard with upcoming assignments
2. Instructor dashboard with pending grading count
3. Gradebook view (all assignments + grades)
4. Grade visualization (bar chart)

### Components:

- `StudentDashboard` (upcoming assignments, recent grades)
- `InstructorDashboard` (quick stats, courses)
- `Gradebook` (table of all assignments + grades)
- `GradeChart` (use recharts for bar chart)

### Queries to Implement:

```typescript
// Upcoming assignments (next 7 days)
const upcomingAssignments = await db
  .select()
  .from(assignments)
  .where(
    and(
      inArray(assignments.courseId, userCourseIds),
      gte(assignments.dueDate, new Date()),
      lte(assignments.dueDate, sevenDaysFromNow)
    )
  )
  .orderBy(assignments.dueDate);

// Pending grading count
const pendingCount = await db
  .select({ count: sql`count(*)` })
  .from(submissions)
  .leftJoin(grades, eq(submissions.id, grades.submissionId))
  .where(
    and(
      inArray(submissions.assignmentId, instructorAssignmentIds),
      isNull(grades.id)
    )
  );
```

### Test Hour 5:
- [ ] Student sees upcoming assignments on dashboard
- [ ] Instructor sees pending grading count
- [ ] Gradebook shows all assignments + grades
- [ ] Grade chart displays properly

---

## ⏱️ Hour 6: Polish & Deploy (60 minutes)

### Tasks:
1. Dark mode implementation
2. Mobile responsive fixes
3. Loading states & error handling
4. Deploy to Vercel

### Dark Mode Setup:

```bash
npm install next-themes
```

#### `src/app/layout.tsx`

```typescript
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### `src/components/ThemeToggle.tsx`

```typescript
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
```

### Loading States:

Use `loading.tsx` files in each route:

```typescript
// src/app/dashboard/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
```

### Error Handling:

```typescript
// src/app/error.tsx
'use client';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your Vercel URL)
- `BLOB_READ_WRITE_TOKEN`

### Test Hour 6:
- [ ] Dark mode toggle works
- [ ] Mobile layout looks good on phone
- [ ] Loading skeletons show during data fetch
- [ ] Deployed to Vercel successfully
- [ ] Can access from public URL

---

## ✅ Post-Launch Checklist

### Immediately After Deploy:

1. **Test full user flow**:
   - [ ] Sign up as instructor
   - [ ] Create course
   - [ ] Copy invite code
   - [ ] Sign up as student (different browser/incognito)
   - [ ] Join course
   - [ ] Instructor creates assignment
   - [ ] Student submits assignment
   - [ ] Instructor grades assignment
   - [ ] Student views grade

2. **Get first users**:
   - [ ] Find a friendly professor
   - [ ] Get 5-10 students from one class
   - [ ] Set up actual course on platform

3. **Monitor**:
   - [ ] Check Vercel logs for errors
   - [ ] Monitor Neon database metrics
   - [ ] Watch for user feedback

### First Week:

- [ ] Implement announcements (if not done)
- [ ] Add email notifications (optional)
- [ ] Fix top 3 bugs reported by users
- [ ] Improve most confusing UI element

### First Month:

- [ ] Add rubrics for grading
- [ ] Implement late penalty calculation
- [ ] Build basic analytics for instructors
- [ ] Add CSV grade export

---

## 🐛 Troubleshooting

### Issue: Database connection fails

**Check**:
- Is `DATABASE_URL` in `.env.local`?
- Is Neon database active (not suspended)?
- Try pinging: `npx drizzle-kit studio` (opens DB viewer)

### Issue: NextAuth not working

**Check**:
- Is `NEXTAUTH_SECRET` set?
- Is `NEXTAUTH_URL` correct (http://localhost:3000 in dev)?
- Clear cookies and try again

### Issue: File upload fails

**Check**:
- Is `BLOB_READ_WRITE_TOKEN` set?
- Is file size < 10 MB?
- Check Vercel Blob dashboard for errors

### Issue: Slow page loads

**Check**:
- Are you using React Query for caching?
- Is Neon database in same region as Vercel?
- Use Vercel Analytics to identify slow routes

---

## 📚 Resources

### Documentation:
- [Next.js App Router](https://nextjs.org/docs/app)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [shadcn/ui](https://ui.shadcn.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Neon Postgres](https://neon.tech/docs)

### Community:
- [Next.js Discord](https://discord.gg/nextjs)
- [Neon Discord](https://discord.gg/neon)
- [shadcn Discord](https://discord.gg/shadcn)

---

## 🎯 Success Metrics

### Qualitative (First Week):
- "This is so much faster than Canvas!"
- "I love that I can grade on my phone"
- "Finally, everything in one place"

### Quantitative (First Month):
- Page load time: < 500ms (measure with Vercel Analytics)
- Submission success rate: > 95%
- Daily active users: > 50% of enrolled students
- NPS score: > 50

---

## 🚀 Next Features (Post-MVP)

Based on user feedback, prioritize:

1. **Most Requested**:
   - Email notifications for new assignments/grades
   - Mobile app (React Native)
   - Google Calendar integration

2. **Instructor Pain Points**:
   - Bulk grade import from CSV
   - Regrade request workflow
   - Plagiarism detection

3. **Student Pain Points**:
   - Group assignments
   - Peer review
   - Study groups / discussion forums

---

## 💪 Final Pep Talk

You're not just building a Canvas clone. You're solving a real problem that affects millions of students and instructors every day.

**Your advantages**:
- ⚡ Modern stack (10x faster than Canvas)
- 🎯 Laser focus (one core loop done perfectly)
- 🚀 Rapid iteration (ship updates in minutes, not months)

**Remember**:
- Perfect is the enemy of done
- Ship early, ship often
- Listen to users, ignore trolls
- Focus on the core value prop

**You have 6 hours. Go build something that makes students' lives easier.**

Now get shipping! 🚀

---

## 📞 Need Help?

If you get stuck:
1. Check this guide's troubleshooting section
2. Search the relevant documentation
3. Ask in the Discord communities
4. Check Vercel/Neon status pages

**Most importantly**: Don't let perfect be the enemy of shipped. If a feature takes more than its allotted hour, skip it and move on. You can always add it later.

**Now go build it!** ✨
