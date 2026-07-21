'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <header
      style={{
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--surface-2)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: '1.25rem',
            color: 'var(--brand-500)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          IlmPath
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.9rem',
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive(link.href) ? 'var(--brand-400)' : 'var(--text-secondary)',
                background: isActive(link.href) ? 'rgba(245,158,11,0.08)' : 'transparent',
                transition: 'color 0.15s, background 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth actions */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
          {session ? (
            <>
              <Link
                href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                }}
              >
                {session.user.role === 'admin' ? 'Admin Panel' : 'My Learning'}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.375rem 0.75rem',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  background: 'var(--brand-500)',
                  textDecoration: 'none',
                  padding: '0.4375rem 1rem',
                  borderRadius: '0.5rem',
                  transition: 'background 0.15s',
                }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
