import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IlmPath — Learn Without Limits',
  description:
    'Browse expert-taught courses, pay once, and stream or watch offline. IlmPath — premium learning for Pakistan.',
};

const FEATURES = [
  {
    icon: '🔒',
    title: 'Secure Streaming',
    desc: 'Videos served via short-lived signed URLs. Nothing is ever permanently downloadable to your device.',
  },
  {
    icon: '📴',
    title: 'Offline Access',
    desc: 'Cache any video securely in your browser for offline viewing — no internet required after download.',
  },
  {
    icon: '🎓',
    title: 'Expert Courses',
    desc: 'Carefully crafted curriculum by experienced instructors. Learn at your own pace, any time.',
  },
  {
    icon: '📱',
    title: 'Any Device',
    desc: 'Installable PWA — works on Android, iOS, Windows, and desktop. No app store needed.',
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          minHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '700px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: '760px' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: 'var(--brand-400)',
              borderRadius: '9999px',
              padding: '0.3rem 1rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1.75rem',
            }}
          >
            Online Learning Platform
          </span>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}
          >
            Learn Without{' '}
            <span style={{ color: 'var(--brand-500)' }}>Limits</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              maxWidth: '560px',
              margin: '0 auto 2.5rem',
            }}
          >
            Expert-taught courses you can stream online or watch offline. Pay once, learn for a
            full year — on any device, anywhere in Pakistan.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/courses"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 2rem',
                background: 'var(--brand-500)',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '0.625rem',
                textDecoration: 'none',
                transition: 'background 0.15s, transform 0.15s',
              }}
            >
              Browse Courses →
            </Link>
            <Link
              href="/register"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.875rem 2rem',
                background: 'var(--surface-1)',
                border: '1px solid var(--surface-2)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '1rem',
                borderRadius: '0.625rem',
                textDecoration: 'none',
                transition: 'border-color 0.15s',
              }}
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          padding: '5rem 1.5rem',
          borderTop: '1px solid var(--surface-2)',
          background: 'var(--surface-1)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '0.75rem',
            }}
          >
            Everything you need to learn effectively
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginBottom: '3.5rem',
              fontSize: '1.05rem',
            }}
          >
            Built for Pakistan's internet conditions — low bandwidth, offline-first.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.05rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            Ready to start learning?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Register for free and browse courses. Pay when you&apos;re ready.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-flex',
              padding: '0.875rem 2.5rem',
              background: 'var(--brand-500)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '0.625rem',
              textDecoration: 'none',
            }}
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
