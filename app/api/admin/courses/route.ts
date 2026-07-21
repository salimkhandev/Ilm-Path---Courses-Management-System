import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { connectDB } from '@/lib/db';
import Course from '@/lib/models/Course';

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const courses = await Course.find({}).sort({ createdAt: -1 }).lean();
  
  const mapped = courses.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    description: c.description,
    thumbnailKey: c.thumbnailKey,
    videoCount: c.videos.length,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, thumbnailKey } = await req.json();
  if (!title || !description || !thumbnailKey) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  await connectDB();

  const course = await Course.create({
    title,
    description,
    thumbnailKey,
    videos: [],
  });

  return NextResponse.json({ id: course._id.toString() });
}
