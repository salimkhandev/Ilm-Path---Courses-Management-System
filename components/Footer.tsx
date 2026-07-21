import Link from 'next/link';

const LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/refund', label: 'Refund Policy' },
];

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--surface-2)',
        padding: '2.5rem 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <p style={{ fontWeight: 700, color: 'var(--brand-500)', fontSize: '1.1rem' }}>
            IlmPath
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Learn Without Limits
          </p>
        </div>

        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} IlmPath. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
