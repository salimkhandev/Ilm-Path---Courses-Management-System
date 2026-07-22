import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDriveFileStream } from '@/lib/gdrive';

export async function GET(
  req: NextRequest,
  ctx: RouteContext<'/api/admin/payments/receipt/[fileId]'>
) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { fileId } = await ctx.params;

  try {
    const { stream, status, headers } = await getDriveFileStream(fileId, null);

    const webStream = new ReadableStream({
      async pull(controller) {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      },
      cancel() {
        stream.destroy();
      }
    });

    return new NextResponse(webStream, {
      status,
      headers: {
        'Content-Type': headers['content-type'] || 'image/jpeg',
        ...(headers['content-length'] && { 'Content-Length': headers['content-length'] }),
        // Cache control to avoid re-fetching on every scroll in admin panel
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Drive stream error for receipt:', error);
    return NextResponse.json({ error: 'Failed to fetch receipt.' }, { status: 500 });
  }
}
