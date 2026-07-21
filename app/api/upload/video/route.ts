import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPresignedPutUrl, r2Key } from '@/lib/r2';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // TODO: Add rate limit check (Batch 10)

  const { contentType, filename } = (await req.json()) ?? {};
  if (!contentType?.startsWith('video/')) {
    return NextResponse.json({ error: 'Invalid file type. Must be a video.' }, { status: 400 });
  }

  // Clean filename for safety
  const safeName = filename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'video.mp4';
  const timestamp = Date.now();
  
  // No course ID in path for simplicity — the admin course form just uploads the video
  // and gets the key back to save with the course document.
  const key = r2Key(`videos/${timestamp}-${safeName}`);
  
  // Video uploads can take a while — give 1 hour expiry
  const url = await getPresignedPutUrl(key, contentType, 3600);

  return NextResponse.json({ url, key });
}
