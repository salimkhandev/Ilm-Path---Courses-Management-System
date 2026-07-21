'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminNavbar() {
  const pathname = usePathname();

  const links = [
    { label: 'Payments & Approvals', href: '/admin' },
    { label: 'Course Manager', href: '/admin/courses' },
    { label: 'Student Management', href: '/admin/students' },
  ];

  return (
    <nav style={{ 
      background: 'var(--surface-1)', 
      borderBottom: '1px solid var(--surface-2)',
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="flex items-center gap-8">
        <Link href="/admin" className="text-xl font-bold" style={{ color: 'var(--brand-500)' }}>
          PashtoSkills <span style={{ color: 'var(--text-secondary)', fontSize: '0.85em', fontWeight: 500 }}>Admin</span>
        </Link>
        <div className="flex gap-4">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{ 
                  color: isActive ? 'var(--brand-400)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--brand-400)' : '2px solid transparent',
                  paddingBottom: '0.25rem'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="text-sm font-medium hover:underline"
        style={{ color: 'var(--text-secondary)' }}
      >
        Sign Out
      </button>
    </nav>
  );
}
