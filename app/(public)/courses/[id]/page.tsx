import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Course from '@/lib/models/Course';
import { getPresignedGetUrl } from '@/lib/r2';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { title: 'Course Not Found' };
  await connectDB();
  const course = await Course.findById(id, { title: 1, description: 1 }).lean();
  if (!course) return { title: 'Course Not Found' };
  return { title: `${course.title} — IlmPath`, description: course.description };
}

export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  await connectDB();
  const course = await Course.findById(id).lean();
  if (!course) notFound();

  const thumbnailUrl = course.thumbnailKey
    ? await getPresignedGetUrl(course.thumbnailKey, 3600)
    : null;

  const videos = [...course.videos].sort((a, b) => a.order - b.order);
  const totalDuration = videos.reduce((a, v) => a + v.duration, 0);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Back link */}
      <Link
        href="/courses"
        style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginBottom: '2rem' }}
      >
        ← All courses
      </Link>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'start', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            {course.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {course.description}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            <span>📹 {videos.length} videos</span>
            <span>⏱ {formatDuration(totalDuration)} total</span>
          </div>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              padding: '0.75rem 1.75rem',
              background: 'var(--brand-500)',
              color: '#0f172a',
              fontWeight: 700,
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            Enroll — create free account
          </Link>
        </div>

        {thumbnailUrl && (
          <div style={{ width: '220px', flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={course.title}
              style={{ width: '100%', borderRadius: '0.75rem', border: '1px solid var(--surface-2)' }}
            />
          </div>
        )}
      </div>

      {/* Video list */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
        Course Content
      </h2>
      <div style={{ border: '1px solid var(--surface-2)', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {videos.map((video, i) => (
          <div
            key={video._id.toString()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              borderBottom: i < videos.length - 1 ? '1px solid var(--surface-2)' : 'none',
              background: 'var(--surface-1)',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--surface-2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                flexShrink: 0,
                fontWeight: 600,
              }}
            >
              {video.order}
            </span>
            <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {video.title}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
              {formatDuration(video.duration)}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>🔒</span>
          </div>
        ))}
      </div>
    </div>
  );
}
