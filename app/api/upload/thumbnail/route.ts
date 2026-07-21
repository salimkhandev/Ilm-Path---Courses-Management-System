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
  if (!contentType?.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
  }

  // Clean filename for safety
  const safeName = filename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'thumb.jpg';
  const timestamp = Date.now();
  const key = r2Key(`thumbnails/${timestamp}-${safeName}`);
  
  const url = await getPresignedPutUrl(key, contentType, 600);

  return NextResponse.json({ url, key });
}
