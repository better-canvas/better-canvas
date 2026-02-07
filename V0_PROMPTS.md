# v0 Component Generation Prompts

> **Usage**: Copy these prompts into v0.dev to generate UI components, then integrate into Next.js app

---

## Design System (Reference for All Prompts)

### Colors
```
Primary: Indigo-600 (#4F46E5)
Success: Green-500 (#10B981)
Warning: Yellow-500 (#EAB308)
Error: Red-500 (#EF4444)
Background (light): Gray-50 (#F9FAFB)
Background (dark): Gray-900 (#111827)
Card: White (light) / Gray-800 (dark)
Border: Gray-200 (light) / Gray-700 (dark)
```

### Typography
- Font: Inter
- Headings: 600 weight (semi-bold)
- Body: 400 weight (regular)
- Code: Fira Mono

### Spacing
- Card padding: 6 (1.5rem)
- Section gaps: 4 (1rem)
- Button padding: 3 (0.75rem) horizontal, 2 (0.5rem) vertical

---

## Prompt 1: Student Dashboard

```
Create a Next.js student dashboard using TypeScript, Tailwind CSS, and shadcn/ui.

Layout:
- Left sidebar (w-64) with course list and navigation
- Main content area showing upcoming assignments

Sidebar:
- Logo/app name at top
- Course list items with:
  - 4px colored left border (different color per course)
  - Course code in bold (e.g., "CS 61A")
  - Course name truncated below (e.g., "Structure and Interp...")
  - Semester in small gray text
- Active course has indigo background
- Dark mode toggle at bottom

Main Content:
- "Upcoming Assignments" heading (text-2xl font-semibold)
- Table with columns:
  - Course (with colored dot matching sidebar)
  - Assignment name
  - Due date (relative time, e.g., "in 2 days")
  - Status badge (red: "Not Submitted", yellow: "Submitted", green: "Graded")
  - Points (e.g., "100 pts")
- Hover effects on rows
- Mobile: Hamburger menu collapses sidebar

Sample Data:
- 3 courses: CS 61A (indigo), EECS 16A (green), Data 100 (purple)
- 5 assignments with mixed statuses

Use shadcn/ui components: Sidebar, Table, Badge, Button
Export as default component compatible with Next.js App Router
```

---

## Prompt 2: Assignment Submission Page

```
Create an assignment submission interface using Next.js, TypeScript, Tailwind, and shadcn/ui.

Structure:
- Assignment header:
  - Title (text-3xl font-bold)
  - Metadata row: Due date, Points possible, Status badge
  - Description (prose class for rich text)
- Submission section:
  - If no file: Large drag-and-drop zone
    - Dashed border (border-2 border-dashed)
    - Upload icon (lucide-react Upload)
    - "Drag and drop your file here" text
    - "or click to browse" link below
  - If file uploaded:
    - File preview card with name, size, X button to remove
- Submit button (full width, indigo, disabled if no file)

Drag-and-drop zone styling:
- Height: 64 (16rem)
- Background: Gray-50 (light) / Gray-800 (dark)
- Border color: Gray-300 (light) / Gray-600 (dark)
- Hover: Border changes to indigo-500

File preview card:
- Flex row with file icon, name, size, delete button
- Background: Indigo-50 (light) / Indigo-900/20 (dark)
- Border: 1px indigo-200

Sample Data:
- Title: "Homework 1: Recursion and Tree Recursion"
- Due: "February 10, 2025 at 11:59 PM"
- Points: 100
- Status: "Not Submitted" (red badge)

Use shadcn/ui: Card, Button, Badge
Use lucide-react: Upload, FileText, X icons
Export as default component
```

---

## Prompt 3: Instructor Grading Interface

```
Create an instructor grading interface using Next.js, TypeScript, Tailwind, shadcn/ui.

Layout:
- Two-column layout (sidebar + main)
- Left sidebar (w-80): Student list
  - Each row: Avatar, Name, Submission status icon
  - Status icons: Green checkmark (graded), Yellow clock (submitted), Red X (not submitted)
  - Active student has indigo background
  - Scrollable list
- Main area: Grading form for selected student
  - Student name (text-xl font-semibold)
  - Submission metadata: Date, Time, Late indicator if applicable
  - "View File" button (opens in new tab)
  - Points input: "__ / 100" (large text input for points earned)
  - Feedback textarea (h-32, placeholder: "Enter feedback for student...")
  - Auto-save indicator: Small green text "Saved 2 seconds ago"
  - Navigation: Previous/Next buttons at bottom

Student list item design:
- Padding: py-3 px-4
- Hover: bg-gray-50 (light) / bg-gray-800 (dark)
- Active: bg-indigo-50 border-l-4 border-indigo-600

Points input:
- Large text (text-4xl)
- Centered
- On focus: border-indigo-500

Sample Data:
- 5 students: Alice Chen (graded), Bob Smith (submitted), Carol Wu (not submitted), etc.
- Selected: Alice Chen
- File: "homework1.pdf"
- Points: 95/100
- Feedback: "Great work! Minor issue on problem 3."

Use shadcn/ui: Card, Input, Textarea, Button, Avatar
Use lucide-react: Check, Clock, X, FileText, ChevronLeft, ChevronRight
Export as default component
```

---

## Prompt 4: Course Card (Dashboard Component)

```
Create a draggable course card component for a dashboard grid using React, TypeScript, Tailwind.

Card design:
- Width: full (in grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Height: fit-content
- Padding: p-6
- Border radius: rounded-lg
- Shadow: shadow-md
- Top colored stripe: h-1 (different color per course)
- Hover: shadow-lg, slight translate up

Content:
- Course code (text-lg font-bold)
- Course name (text-sm text-gray-600 truncate)
- Semester (text-xs text-gray-500)
- Quick stats row:
  - "3 assignments due" with red dot
  - "12 students" with user icon
- Divider line before stats

Color variations (passed as prop):
- Indigo-500 (CS courses)
- Green-500 (EE courses)
- Purple-500 (Data courses)
- Amber-500 (Other)

Props interface:
```typescript
interface CourseCardProps {
  code: string;
  name: string;
  semester: string;
  color: string; // Tailwind color class
  assignmentsDue: number;
  studentCount: number;
}
```

Make draggable with react-beautiful-dnd or @dnd-kit
Use shadcn/ui: Card
Use lucide-react: Users, AlertCircle
Export as default component
```

---

## Prompt 5: Mobile-Responsive Header

```
Create a responsive header/navbar for a learning platform using Next.js, TypeScript, Tailwind, shadcn/ui.

Desktop (≥768px):
- Full width, height-16, border-bottom
- Left: App logo/name "Canvas Reimagined"
- Center: Search bar (w-96, placeholder: "Search courses, assignments...")
- Right: Dark mode toggle, Notifications bell (with badge count), User dropdown menu

Mobile (<768px):
- Hamburger menu icon (left)
- App name (center)
- User avatar (right)
- Search bar hidden (appears in sidebar)

User dropdown items:
- Profile
- Settings
- Log out

Notifications badge:
- Small red circle with count (absolute positioned)
- Only shows if count > 0

Dark mode toggle:
- Sun icon (light mode)
- Moon icon (dark mode)
- Smooth transition

Sample Data:
- User: "John Doe" with avatar
- Notifications: 3 unread

Use shadcn/ui: Button, DropdownMenu, Avatar, Input
Use lucide-react: Menu, Search, Bell, Sun, Moon, User, Settings, LogOut
Export as default component
```

---

## Prompt 6: Assignment Status Timeline

```
Create a visual timeline component showing assignment submission/grading status using React, TypeScript, Tailwind.

Timeline design:
- Vertical line on left (border-l-2)
- Nodes connected to line with horizontal connector
- Each node: Circle icon + label + timestamp

Statuses (in order):
1. Created (gray) - "Assignment created"
2. Submitted (yellow) - "Submitted by student" (if submitted)
3. Graded (green) - "Graded by instructor" (if graded)

Visual states:
- Completed: Solid colored circle with checkmark
- Current: Pulsing colored circle
- Future: Gray outline circle

Props:
```typescript
interface AssignmentTimelineProps {
  created: Date;
  submitted?: Date;
  graded?: Date;
}
```

Styling:
- Vertical line: h-full, border-gray-300 (light) / border-gray-600 (dark)
- Node circles: w-8 h-8
- Horizontal connectors: w-4, border-t-2
- Timestamps: text-sm text-gray-500

Use lucide-react: Check, Clock, FileText, Award
Export as default component
```

---

## Prompt 7: Grade Distribution Chart

```
Create a grade distribution histogram for instructors using React, TypeScript, Tailwind, Recharts.

Chart design:
- Bar chart with bins: 0-59 (F), 60-69 (D), 70-79 (C), 80-89 (B), 90-100 (A)
- X-axis: Letter grade
- Y-axis: Number of students
- Bars colored by grade: Red (F), Orange (D), Yellow (C), Blue (B), Green (A)
- Hover tooltip shows exact count
- Title: "Grade Distribution: [Assignment Name]"
- Subtitle: "Average: 85.3 | Median: 87 | Std Dev: 8.2"

Sample Data:
```typescript
const data = [
  { grade: 'F', count: 2, color: '#EF4444' },
  { grade: 'D', count: 3, color: '#F97316' },
  { grade: 'C', count: 8, color: '#EAB308' },
  { grade: 'B', count: 12, color: '#3B82F6' },
  { grade: 'A', count: 15, color: '#10B981' },
];
```

Styling:
- Card wrapper with padding
- Chart height: 300px
- Responsive width
- Dark mode: Grid lines adjust color

Use shadcn/ui: Card
Use recharts: BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
Export as default component
```

---

## Prompt 8: Announcement Post Card

```
Create an announcement card component for course home pages using React, TypeScript, Tailwind, shadcn/ui.

Card design:
- White/dark background with border
- Top row: Announcement icon + "Announcement" badge + timestamp
- Title (text-xl font-semibold)
- Content (prose class, supports markdown-like formatting)
- Bottom row: Posted by avatar + name
- Optional: Pin icon if pinned announcement

Props:
```typescript
interface AnnouncementProps {
  title: string;
  content: string;
  postedBy: {
    name: string;
    avatar?: string;
  };
  postedAt: Date;
  isPinned?: boolean;
}
```

Styling:
- Pinned announcements: bg-indigo-50 (light) / bg-indigo-900/20 (dark) with pin icon
- Regular: bg-white (light) / bg-gray-800 (dark)
- Border: 1px gray-200 (light) / gray-700 (dark)
- Padding: p-6

Sample Data:
- Title: "Homework 1 Due Date Extended"
- Content: "Due to the holiday, HW1 is now due Feb 12 instead of Feb 10."
- Posted by: "Prof. John DeNero" at "2 hours ago"
- isPinned: true

Use shadcn/ui: Card, Avatar, Badge
Use lucide-react: Pin, Megaphone
Export as default component
```

---

## Prompt 9: Quick Stats Dashboard Cards

```
Create a set of stat cards for instructor/student dashboards using React, TypeScript, Tailwind, shadcn/ui.

Card types (4 variants):
1. Pending Submissions
   - Icon: Clock (orange)
   - Number: Large count (text-4xl)
   - Label: "Pending Submissions"
   - Subtext: "Across 3 courses"

2. Upcoming Deadlines
   - Icon: Calendar (blue)
   - Number: Count
   - Label: "Upcoming Deadlines"
   - Subtext: "Next 7 days"

3. Current Average
   - Icon: TrendingUp (green)
   - Number: Percentage (e.g., "87.5%")
   - Label: "Current Average"
   - Subtext: "Across all courses"

4. Assignments Graded
   - Icon: CheckCircle (green)
   - Number: Fraction (e.g., "12/15")
   - Label: "Assignments Graded"
   - Subtext: "This week"

Card design:
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Each card: p-6, rounded-lg, shadow-md
- Icon: Top left in colored circle (p-3, rounded-full, bg-opacity-10)
- Number: Below icon (text-4xl font-bold)
- Label: text-sm text-gray-600
- Subtext: text-xs text-gray-500

Use shadcn/ui: Card
Use lucide-react: Clock, Calendar, TrendingUp, CheckCircle
Export as default component with all 4 variants
```

---

## Prompt 10: Course Settings Form

```
Create a course settings form for instructors using Next.js, TypeScript, Tailwind, shadcn/ui with react-hook-form.

Form sections:
1. Basic Information
   - Course code (e.g., "CS 61A")
   - Course name (e.g., "Structure and Interpretation...")
   - Semester (dropdown: Spring/Summer/Fall/Winter + Year)
   - Color picker (show 6 preset colors)

2. Enrollment
   - Course code to share with students (read-only, copy button)
   - Enrollment limit (number input, optional)
   - Allow self-enrollment (toggle)

3. Grading
   - Late submission policy (dropdown: Accept all / Deduct points / No late submissions)
   - Late penalty (number input, %, only if "Deduct points" selected)
   - Grade calculation (dropdown: Simple average / Weighted categories)

4. Visibility
   - Show grades to students (toggle, default on)
   - Hide student names from other students (toggle, default on)

Buttons:
- Save Changes (primary, indigo)
- Cancel (secondary, gray)

Layout:
- Each section in a Card with heading
- Vertical spacing between sections
- Labels on top of inputs
- Helper text in small gray

Use shadcn/ui: Card, Input, Label, Button, Switch, Select, Popover (for color picker)
Use react-hook-form: useForm, Controller
Use lucide-react: Copy, Check
Export as default component
```

---

## Integration Guide for Claude Code

### After v0 Generates a Component:

1. **Copy the component code** from v0
2. **Create file** in appropriate directory:
   - `/components/ui/` for reusable UI components
   - `/components/` for feature-specific components
3. **Install dependencies** if needed:
   ```bash
   npx shadcn-ui@latest add [component-name]
   ```
4. **Wire up data** from API routes using React Query:
   ```typescript
   const { data } = useQuery({
     queryKey: ['courses'],
     queryFn: () => fetch('/api/courses').then(r => r.json())
   });
   ```
5. **Add to page** in app router:
   ```typescript
   import CourseCard from '@/components/CourseCard';
   
   export default function Dashboard() {
     return <CourseCard {...props} />;
   }
   ```

### Common Adjustments Needed:

- **Remove mock data** and replace with props/API data
- **Add loading states** (use shadcn Skeleton)
- **Add error handling** (use toast notifications)
- **Adjust responsive breakpoints** if needed
- **Connect onClick handlers** to Next.js router or API calls

### Dark Mode Setup:

All v0 components assume `next-themes` is installed:
```bash
npm install next-themes
```

Wrap app in `app/layout.tsx`:
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

---

## Testing Each Component

### Quick Visual Test:
1. Create a `/test` page in Next.js
2. Import component with sample data
3. Toggle dark mode to verify styling
4. Resize browser to test responsive breakpoints
5. Test interactions (clicks, hovers, inputs)

### Sample Test Page:
```typescript
// app/test/page.tsx
import CourseCard from '@/components/CourseCard';

export default function TestPage() {
  return (
    <div className="p-8 grid grid-cols-3 gap-4">
      <CourseCard
        code="CS 61A"
        name="Structure and Interpretation of Computer Programs"
        semester="Spring 2025"
        color="indigo-500"
        assignmentsDue={3}
        studentCount={450}
      />
      {/* Add more test cases */}
    </div>
  );
}
```

---

## Color Palette Reference (For Quick Copy-Paste)

```javascript
const colors = {
  indigo: {
    50: '#EEF2FF',
    500: '#6366F1',
    600: '#4F46E5',
    900: '#312E81',
  },
  green: {
    50: '#F0FDF4',
    500: '#10B981',
    900: '#064E3B',
  },
  yellow: {
    50: '#FEFCE8',
    500: '#EAB308',
    900: '#713F12',
  },
  red: {
    50: '#FEF2F2',
    500: '#EF4444',
    900: '#7F1D1D',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};
```

---

**Remember**: v0 is for rapid prototyping. Claude Code handles the backend integration, state management, and API wiring. Together, you ship faster than either could alone. 🚀
