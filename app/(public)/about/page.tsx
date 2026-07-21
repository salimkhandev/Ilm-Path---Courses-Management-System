import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — PashtoSkills',
  description: 'Learn about PashtoSkills and how to contact us.',
};

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? 'support@pashtoskills.com';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div className="mb-4">
        <Link href="/" className="text-xs text-muted hover:underline">
          ← Back to Home
        </Link>
      </div>
      <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
        About PashtoSkills
      </h1>

      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
        PashtoSkills (<em>Ilm</em> — Arabic for knowledge) is a Pakistani online learning platform
        dedicated to making high-quality education accessible and affordable.
      </p>

      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
        Our courses are taught by experienced instructors and designed to work even on slow
        connections. Videos can be cached offline so you can keep learning even without internet.
      </p>

      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
        Access is unlocked for one full year after payment verification. No subscriptions,
        no hidden fees.
      </p>

      <div className="card">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>
          Contact Us
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          For support, payment queries, or any other questions:
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          style={{ color: 'var(--brand-400)', textDecoration: 'none', fontWeight: 600 }}
        >
          {SUPPORT_EMAIL}
        </a>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.75rem' }}>
          We typically respond within 24 hours (business days).
        </p>
      </div>
    </div>
  );
}
