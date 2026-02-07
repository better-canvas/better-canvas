# Canvas Reimagined - MVP Implementation Plan

## Mission
Build a lightning-fast, unified Canvas alternative in **4-6 hours** that immediately demonstrates why fragmentation sucks and speed matters. Focus on the core loop: **assignment submission → grading → viewing grades** with exceptional UX.

## Core Value Propositions (What Makes Us Better)
1. **⚡ Speed**: Sub-second page loads (Canvas takes 3-5s)
2. **🎯 Unified**: No external links to Gradescope/Ed/Discord for core functions
3. **🎨 Modern UX**: Drag-and-drop, dark mode, intuitive grade visualization
4. **📱 Mobile-First**: Responsive from day one, no forced app download

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: React Query for server state, Zustand for client state
- **File Upload**: react-dropzone + uploadthing OR direct S3
- **Charts**: recharts for grade visualization

### Backend
- **Runtime**: Next.js API routes (serverless functions)
- **Database**: Neon Postgres (serverless, auto-scaling)
- **ORM**: Drizzle ORM (lightweight, TypeScript-first)
- **Auth**: NextAuth.js with email/password (defer SSO)
- **File Storage**: Vercel Blob or AWS S3
- **Deployment**: Vercel (optimized for Next.js)

### Why This Stack?
- **Ship in hours, not days**: No separate backend repo, integrated deployment
- **Scale when needed**: Neon and Vercel handle traffic spikes (assignment deadlines)
- **Type safety**: End-to-end TypeScript prevents bugs
- **Modern DX**: Hot reload, instant API routes, built-in optimizations

---

## Database Schema (Neon Postgres)

### Core Tables

```sql
-- Users (students, instructors, TAs)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL, -- 'student', 'instructor', 'ta'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL, -- 'CS 61A'
  name VARCHAR(255) NOT NULL, -- 'Structure and Interpretation of Computer Programs'
  semester VARCHAR(20) NOT NULL, -- 'Spring 2025'
  color VARCHAR(7), -- Hex color for UI
  instructor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Course Enrollments (many-to-many)
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  course_id UUID REFERENCES courses(id),
  role VARCHAR(20) NOT NULL, -- 'student', 'ta', 'instructor'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Assignments
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  points_possible DECIMAL(5,2) NOT NULL DEFAULT 100,
  due_date TIMESTAMP NOT NULL,
  allow_late BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id),
  student_id UUID REFERENCES users(id),
  file_url VARCHAR(500), -- S3/Blob URL
  file_name VARCHAR(255),
  submitted_at TIMESTAMP DEFAULT NOW(),
  is_late BOOLEAN DEFAULT false,
  UNIQUE(assignment_id, student_id) -- One submission per student per assignment
);

-- Grades
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES submissions(id) UNIQUE,
  points_earned DECIMAL(5,2),
  feedback TEXT,
  graded_by UUID REFERENCES users(id),
  graded_at TIMESTAMP DEFAULT NOW()
);

-- Announcements (bonus if time)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
```

---

## MVP Feature Set (Ruthlessly Scoped)

### ✅ MUST HAVE (Hours 1-4)

#### 1. Authentication (30 min)
- Email/password signup and login
- Role selection on signup (student/instructor)
- Session management with NextAuth

#### 2. Course Management (45 min)
**Instructor:**
- Create course (code, name, semester, color)
- View course roster (students enrolled)
- Invite students via shareable course code

**Student:**
- Join course via code
- View enrolled courses on dashboard
- Drag-and-drop course cards to reorder (persist to user preferences)

#### 3. Assignments (90 min)
**Instructor:**
- Create assignment (title, description, points, due date)
- View all submissions for an assignment
- Bulk download submissions (ZIP)

**Student:**
- View upcoming assignments (sorted by due date)
- Color-coded status: Not submitted (red), Submitted (yellow), Graded (green)
- Submit assignment via drag-and-drop file upload
- View submission status and timestamp

#### 4. Grading (60 min)
**Instructor/TA:**
- Grid view of all submissions for assignment
- Click student → see their file → enter grade + feedback
- Autosave grades (debounced)
- Keyboard shortcuts: Tab to next student, Cmd+S to save

**Student:**
- View grades for each assignment
- See feedback inline
- Calculate current course grade (simple average for MVP)

#### 5. Dashboard (30 min)
**Student:**
- List of courses (with custom colors)
- Upcoming assignments across all courses (next 7 days)
- Recent grades

**Instructor:**
- List of courses teaching
- Assignments needing grading (badge count)
- Quick stats: X submissions pending, Y students enrolled

### 🎯 NICE TO HAVE (Hours 5-6)

#### 6. Dark Mode (15 min)
- Toggle in header
- Persist preference to localStorage
- Use Tailwind's dark: classes

#### 7. Announcements (30 min)
- Instructor posts announcement to course
- Students see on course home page
- No comments needed for MVP

#### 8. Grade Visualization (30 min)
- Bar chart of assignment grades (student view)
- Grade distribution histogram (instructor view)
- Use recharts

#### 9. Mobile Polish (15 min)
- Hamburger menu for navigation
- Touch-friendly drag-and-drop
- Responsive tables → cards on mobile

---

## Page Structure & Routes

```
/
├── (auth)/
│   ├── login
│   ├── signup
│   └── layout.tsx (auth wrapper)
│
├── (app)/
│   ├── dashboard (role-specific dashboard)
│   ├── courses/
│   │   ├── [courseId]/
│   │   │   ├── page.tsx (course home)
│   │   │   ├── assignments/
│   │   │   │   ├── page.tsx (list)
│   │   │   │   ├── [assignmentId]/
│   │   │   │   │   ├── page.tsx (student: view & submit)
│   │   │   │   │   └── grade/page.tsx (instructor: grade all)
│   │   │   ├── grades/page.tsx (gradebook)
│   │   │   └── people/page.tsx (roster)
│   │   └── new (create course - instructor only)
│   └── layout.tsx (app shell with nav)
│
└── api/
    ├── auth/[...nextauth]
    ├── courses/
    ├── assignments/
    ├── submissions/
    └── grades/
```

---

## Component Hierarchy

### Layout Components
```
AppShell
├── Sidebar (nav with course list)
├── Header (user menu, dark mode toggle)
└── MainContent (page outlet)
```

### Key Reusable Components
- `CourseCard` (draggable, color-coded)
- `AssignmentRow` (status badge, due date, points)
- `FileUploader` (drag-and-drop zone)
- `GradeCell` (editable input with autosave)
- `StatusBadge` (not submitted/submitted/graded)
- `DateDisplay` (relative time: "due in 2 days")

---

## Implementation Order (Hour-by-Hour)

### Hour 1: Setup & Auth
1. **Create Next.js project** with TypeScript, Tailwind, shadcn/ui
2. **Setup Neon DB**: Create database, get connection string
3. **Configure Drizzle ORM**: Define schema, push to DB
4. **Implement NextAuth**: Email/password provider, session handling
5. **Build auth pages**: Login, signup (use shadcn form components)

**Deliverable**: Can create account and log in

---

### Hour 2: Course Management
1. **Create course creation form** (instructor only)
2. **Build course join flow** (student enters code)
3. **Dashboard layout**: Sidebar with course list
4. **Course card component**: Display with custom colors
5. **API routes**: Create course, join course, list my courses

**Deliverable**: Instructors create courses, students join them

---

### Hour 3: Assignments (Instructor Side)
1. **Assignment creation form**: Title, description, points, due date
2. **Assignment list page**: Table with all assignments for course
3. **Submission inbox**: Grid view of who submitted
4. **File upload handling**: API route to save to Vercel Blob/S3
5. **Download submissions**: Generate ZIP of all files

**Deliverable**: Instructors can create assignments and see submissions

---

### Hour 4: Assignments (Student Side) + Grading
1. **Student assignment list**: Color-coded by status
2. **Assignment detail page**: View description, upload file
3. **Drag-and-drop uploader**: react-dropzone integration
4. **Grading interface**: Click student → view file → enter grade
5. **Autosave grades**: Debounced API calls

**Deliverable**: Students submit, instructors grade, students see grades

---

### Hour 5: Dashboard + Grade Views
1. **Student dashboard**: Upcoming assignments, recent grades
2. **Instructor dashboard**: Pending grading count, course stats
3. **Grade visualization**: Bar chart of student's grades
4. **Gradebook page**: Table of all assignments + grades
5. **Current course grade calculation**: Simple average

**Deliverable**: Polished dashboards showing actionable info

---

### Hour 6: Polish + Nice-to-Haves
1. **Dark mode**: Tailwind dark: classes, toggle button
2. **Mobile responsive**: Test on phone simulator, fix layout issues
3. **Announcements**: Simple post → view flow
4. **Loading states**: Skeletons for async data
5. **Error handling**: Toast notifications for failures

**Deliverable**: Production-ready MVP

---

## Design Specifications (For v0)

### Color Palette
```
Primary: Indigo-600 (Canvas uses red, we differentiate)
Success: Green-500
Warning: Yellow-500
Error: Red-500
Background (light): Gray-50
Background (dark): Gray-900
Card: White (light) / Gray-800 (dark)
```

### Typography
- Headings: Inter (bold)
- Body: Inter (regular)
- Code/Files: Fira Mono

### Key UI Patterns

#### Course Card (Dashboard)
```
┌─────────────────────────┐
│ [Color Bar - 4px tall]  │
│                         │
│ CS 61A                  │ ← Course code (bold)
│ Structure & Interp...   │ ← Course name (truncate)
│                         │
│ 3 assignments due       │ ← Quick stats
│ Spring 2025             │ ← Semester
└─────────────────────────┘
```

#### Assignment Row
```
┌────────────────────────────────────────────────┐
│ [●] Homework 1: Recursion    📎 Due: Feb 10   │
│     100 points                                 │
│     [Not Submitted] ← Red badge                │
└────────────────────────────────────────────────┘
```

#### Grading Interface
```
┌──────────────────────────────────────────┐
│ Student: Alice Chen                      │
│ Submitted: Feb 9, 2025 11:47 PM (on time)│
│                                          │
│ [View File: homework1.pdf] ← Link       │
│                                          │
│ Points: [___/100] ← Editable input      │
│                                          │
│ Feedback:                                │
│ ┌────────────────────────────────────┐  │
│ │                                    │  │
│ │ Textarea for feedback              │  │
│ │                                    │  │
│ └────────────────────────────────────┘  │
│                                          │
│ [← Previous] [Save] [Next →]            │
└──────────────────────────────────────────┘
```

---

## v0 Prompts (If Using v0 for Frontend)

### Prompt 1: Course Dashboard
```
Create a Next.js course dashboard with:
- Sidebar navigation listing courses (CS 61A, EECS 16A, etc.)
- Each course has a custom color bar on the left
- Main content area shows upcoming assignments in a table
- Assignment rows have status badges (red: not submitted, yellow: submitted, green: graded)
- Dark mode toggle in header
- Mobile responsive with hamburger menu

Use Tailwind CSS and shadcn/ui components. Show 3 sample courses and 5 sample assignments.
```

### Prompt 2: Assignment Submission Page
```
Create an assignment submission page with:
- Assignment title and description at top
- Metadata: due date, points possible, submission status
- Large drag-and-drop file upload zone (dashed border, icon, "Drop files here" text)
- If file uploaded, show file name with delete option
- "Submit Assignment" button (disabled until file selected)
- Use react-dropzone for file handling
- Tailwind CSS with indigo accent color
- Dark mode support
```

### Prompt 3: Grading Interface
```
Create a grading interface for instructors:
- Left sidebar: List of student names with submission status icons
- Main area: Selected student's submission details
  - Student name and submission timestamp
  - "View File" button
  - Input field for points (out of total)
  - Textarea for feedback
  - Auto-save indicator (shows "Saved" when changes persist)
- Keyboard navigation: Tab key moves to next student
- Use shadcn/ui Table and Form components
- Indigo accent color, dark mode support
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login (handled by NextAuth)

### Courses
- `GET /api/courses` - List user's courses
- `POST /api/courses` - Create course (instructor only)
- `POST /api/courses/[id]/join` - Join course via code (student)
- `GET /api/courses/[id]` - Get course details
- `GET /api/courses/[id]/roster` - List enrolled students

### Assignments
- `GET /api/courses/[courseId]/assignments` - List assignments
- `POST /api/courses/[courseId]/assignments` - Create assignment (instructor)
- `GET /api/assignments/[id]` - Get assignment details
- `GET /api/assignments/[id]/submissions` - List all submissions (instructor)

### Submissions
- `POST /api/assignments/[id]/submit` - Submit assignment (upload file)
- `GET /api/submissions/[id]` - Get submission details
- `GET /api/assignments/[id]/download-all` - Download ZIP (instructor)

### Grades
- `PUT /api/submissions/[id]/grade` - Grade submission (instructor/TA)
- `GET /api/courses/[courseId]/grades` - Get gradebook (all assignments)

### Announcements (bonus)
- `GET /api/courses/[courseId]/announcements` - List announcements
- `POST /api/courses/[courseId]/announcements` - Post announcement (instructor)

---

## File Upload Strategy

### Option 1: Vercel Blob (Recommended for MVP)
```bash
npm install @vercel/blob
```

**Why:**
- Zero config, works out of the box
- Generous free tier (500 GB bandwidth/month)
- Integrated with Vercel deployment
- Simple API: `put(file, { access: 'public' })`

**Implementation:**
```typescript
// app/api/upload/route.ts
import { put } from '@vercel/blob';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const blob = await put(file.name, file, {
    access: 'public',
  });
  
  return Response.json({ url: blob.url });
}
```

### Option 2: AWS S3 (If scaling beyond MVP)
- More control over permissions
- Cheaper at scale
- Requires AWS setup (IAM, bucket policies)

**For MVP: Use Vercel Blob**

---

## Security Considerations

### Must Implement
1. **Row-level security**: Users can only access their enrolled courses
2. **File upload validation**: 
   - Max file size: 10 MB
   - Allowed extensions: .pdf, .zip, .txt, .py, .java, .cpp
   - Scan for malware (use Vercel's built-in scanning)
3. **Rate limiting**: Prevent spam submissions (use Upstash Rate Limit)
4. **SQL injection**: Drizzle ORM handles this, but use parameterized queries
5. **CSRF protection**: NextAuth handles this for auth, use tokens for forms

### Can Defer (Post-MVP)
- Two-factor authentication
- Email verification
- SSO integration
- Advanced permissions (course-level roles)

---

## Testing Strategy (Light Touch for MVP)

### Manual Testing Checklist
- [ ] Create instructor account
- [ ] Create course
- [ ] Generate course code
- [ ] Create student account
- [ ] Join course via code
- [ ] Create assignment
- [ ] Submit assignment as student
- [ ] Grade assignment as instructor
- [ ] View grade as student
- [ ] Check mobile layout on iPhone/Android

### Automated (If Time)
- Unit tests for grade calculation logic
- API route tests with Vitest
- E2E test for submit → grade → view flow (Playwright)

**For MVP: Manual testing is sufficient**

---

## Deployment

### Vercel (One-Click Deploy)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (your domain)
4. Deploy

### Database Migrations
```bash
# Push schema changes to Neon
npm run db:push

# Generate migrations (for production)
npm run db:generate
```

---

## Success Metrics (How We Know It's Better)

### Quantitative
- **Page load time**: < 500ms (vs Canvas 3-5s)
- **Time to submit assignment**: < 30s from dashboard (vs 2-3 min on Canvas)
- **Grading speed**: < 10s per student (vs 30s+ on Canvas)

### Qualitative
- "This is so much faster than Canvas" - Student
- "I can grade on my phone!" - Instructor
- "I don't need to open 3 tabs anymore" - Student

---

## Post-MVP Roadmap (What Comes Next)

### Week 2-4: Enhanced Grading
- Rubrics (define grading criteria)
- Peer review assignments
- Regrade requests
- Late penalty auto-calculation

### Month 2: Collaboration
- Built-in discussion (threaded comments on announcements)
- Group assignments
- TA office hours scheduling

### Month 3: Integrations
- Export grades to CSV (for registrar)
- Google Calendar sync for due dates
- Gradescope import/export
- LTI integration (so Canvas can link to us!)

### Month 6: Advanced Features
- Quiz builder with auto-grading
- Plagiarism detection
- Analytics dashboard (which students are struggling?)
- Mobile apps (React Native)

---

## Known Limitations (Be Honest)

### What This MVP Does NOT Do
- ❌ Quizzes/exams (use Google Forms for now)
- ❌ Video lectures (link to YouTube/Panopto)
- ❌ Threaded discussions (use Discord/Slack for now)
- ❌ University SSO (email/password only)
- ❌ Grade sync to registrar (manual CSV export)
- ❌ Accessibility (screen reader support) - **CRITICAL for real launch**

### Why That's OK for MVP
We're proving the core hypothesis: **unified, fast submission/grading is 10x better**. Once validated, we can add the rest.

---

## Collaboration Between v0 and Claude Code

### Workflow
1. **v0 generates UI components** (CourseCard, AssignmentRow, GradingInterface)
2. **Claude Code integrates them** into Next.js app with API routes
3. **v0 refines based on feedback** (mobile responsive issues, dark mode bugs)
4. **Claude Code handles backend logic** (database, auth, file uploads)

### Handoff Format
When v0 generates a component, Claude Code should:
1. Create file in `components/ui/` directory
2. Import shadcn dependencies: `npx shadcn-ui@latest add [component]`
3. Wire up to API routes with React Query
4. Add to appropriate page

### Communication Protocol
- **v0 prompt** should specify: "Make this compatible with Next.js App Router, use TypeScript, export as default"
- **Claude Code** should provide v0 with: Current color palette, font choices, example data shape

---

## Environment Setup

### Required Tools
- Node.js 18+
- npm or yarn
- Neon account (free tier)
- Vercel account (free tier)
- Git

### Environment Variables (.env.local)
```
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
```

### Installation
```bash
npx create-next-app@latest canvas-mvp --typescript --tailwind --app
cd canvas-mvp
npm install drizzle-orm postgres @vercel/blob next-auth react-query zustand react-dropzone recharts
npm install -D drizzle-kit @types/node
npx shadcn-ui@latest init
```

---

## Final Pep Talk

**You are not rebuilding Canvas.** You are building a scalpel that cuts out the worst parts of the student/instructor experience. 

Canvas has 10 years of cruft, enterprise sales cycles, and legacy code. You have:
- Modern stack (Next.js, Neon, Vercel)
- Laser focus (one core loop done perfectly)
- Speed advantage (serverless scales, Canvas doesn't)

**Ship in 6 hours. Get it in front of 1 professor and 30 students. Iterate based on screams of joy or pain.**

This is not your final product. This is your proof that fragmentation and slowness are solvable problems.

Now go build it. 🚀

---

## Quick Start Checklist

- [ ] Clone repo, run `npm install`
- [ ] Create Neon database, copy connection string to `.env.local`
- [ ] Run `npm run db:push` to create tables
- [ ] Start dev server: `npm run dev`
- [ ] Create instructor account at `/signup`
- [ ] Create first course
- [ ] Test full flow: create assignment → join as student → submit → grade → view
- [ ] Deploy to Vercel
- [ ] Share with first users

**Time to ship: 6 hours. Time to impact: immediate.**
