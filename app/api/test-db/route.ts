import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { users } from '@/src/db/schema';

export async function GET() {
  try {
    const result = await db.select().from(users).limit(1);
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      userCount: result.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Make sure DATABASE_URL is set in .env.local and run `npm run db:push` to create tables'
    }, { status: 500 });
  }
}
