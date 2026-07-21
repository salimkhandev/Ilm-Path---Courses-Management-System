import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Course from '@/lib/models/Course';
import { getPresignedGetUrl } from '@/lib/r2';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses — IlmPath',
  description: 'Browse all courses available on IlmPath.',
};

// Always fetch fresh — course list changes when admin adds courses
export const dynamic = 'force-dynamic';

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default async function CoursesPage() {
  await connectDB();

  const courses = await Course.find({})
    .sort({ createdAt: -1 })
    .lean();

  const coursesWithUrls = await Promise.all(
    courses.map(async (c) => ({
      id: c._id.toString(),
      title: c.title,
      description: c.description,
      videoCount: c.videos.length,
      totalDuration: c.videos.reduce((acc, v) => acc + v.duration, 0),
      thumbnailUrl: c.thumbnailKey ? await getPresignedGetUrl(c.thumbnailKey, 3600) : null,
    }))
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '0.5rem' }}>
          All Courses
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {coursesWithUrls.length} course{coursesWithUrls.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {coursesWithUrls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          No courses available yet. Check back soon!
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {coursesWithUrls.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <article
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    height: '180px',
                    background: 'var(--surface-2)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {course.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        fontSize: '2.5rem',
                      }}
                    >
                      🎓
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {course.title}
                  </h2>
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <span>📹 {course.videoCount} videos</span>
                    <span>⏱ {formatDuration(course.totalDuration)}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
