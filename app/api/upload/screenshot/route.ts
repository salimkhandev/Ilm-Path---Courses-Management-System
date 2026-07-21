import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getPresignedPutUrl, r2Key } from '@/lib/r2';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only allow if student is pending or rejected (needs to submit payment)
  if (token.role === 'student' && !['pending', 'rejected'].includes(token.status as string)) {
    return NextResponse.json({ error: 'Not eligible to submit payment.' }, { status: 403 });
  }

  // TODO: Add rate limit check (Batch 10)

  const { contentType } = (await req.json()) ?? {};
  if (!contentType?.startsWith('image/')) {
    return NextResponse.json({ error: 'Invalid file type. Must be an image.' }, { status: 400 });
  }

  const timestamp = Date.now();
  const key = r2Key(`screenshots/${token.id}-${timestamp}.jpg`);
  
  // URL expires in 10 minutes — plenty of time for client-side compression + upload
  const url = await getPresignedPutUrl(key, contentType, 600);

  return NextResponse.json({ url, key });
}
