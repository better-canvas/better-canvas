// IMPORTANT: Load environment variables FIRST, before any other imports
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load from project root, not relative to this file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import database - it will have access to process.env.DATABASE_URL
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

  console.log('✅ Created instructor:', instructor.email);

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

  console.log('✅ Created students:', student1.email, student2.email);

  // Create course
  const [course] = await db.insert(courses).values({
    code: 'CS 61A',
    name: 'Structure and Interpretation of Computer Programs',
    semester: 'Spring 2025',
    color: '#4F46E5',
    instructorId: instructor.id,
    inviteCode: 'CS61A001',
  }).returning();

  console.log('✅ Created course:', course.code);

  // Enroll students
  await db.insert(enrollments).values([
    { userId: instructor.id, courseId: course.id, role: 'instructor' },
    { userId: student1.id, courseId: course.id, role: 'student' },
    { userId: student2.id, courseId: course.id, role: 'student' },
  ]);

  console.log('✅ Enrolled users in course');

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

  console.log('✅ Created assignments');
  console.log('\n📝 Login credentials:');
  console.log('  Instructor: instructor@example.com / password123');
  console.log('  Student 1: alice@example.com / password123');
  console.log('  Student 2: bob@example.com / password123');
  console.log('\n🚀 Seed completed successfully!');

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
