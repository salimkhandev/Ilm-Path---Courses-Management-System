import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // Find all students, optionally populate their enrolled courses if we want their titles
  const users = await User.find({ role: 'student' })
    .populate('enrolledCourseIds', 'title')
    .sort({ createdAt: -1 })
    .lean();

  const formattedUsers = users.map(u => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    status: u.status,
    enrolledCourses: (u.enrolledCourseIds as any[] || []).map(c => ({
      id: c._id.toString(),
      title: c.title
    })),
    createdAt: u.createdAt,
    accessExpiresAt: u.accessExpiresAt
  }));

  return NextResponse.json(formattedUsers);
}
