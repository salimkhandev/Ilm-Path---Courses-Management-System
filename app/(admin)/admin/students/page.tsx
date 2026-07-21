'use client';

import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  enrolledCourses: { id: string; title: string }[];
  createdAt: string;
  accessExpiresAt: string | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/students')
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setStudents(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleRevoke(studentId: string) {
    if (!confirm('Are you sure you want to revoke this student\\'s access?')) return;
    
    try {
      const res = await fetch(`/api/admin/students/${studentId}/revoke`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to revoke access');
      
      setStudents(prev => 
        prev.map(s => s.id === studentId ? { ...s, status: 'revoked' } : s)
      );
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <div className="text-center p-10"><span className="spinner" /></div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--surface-2)', textAlign: 'left', color: 'var(--text-secondary)' }}>
              <th className="pb-3 pr-4">Student Name</th>
              <th className="pb-3 pr-4">Email</th>
              <th className="pb-3 pr-4">Enrolled Courses</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Access Expiry</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-secondary">No students registered yet.</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--surface-2)' }}>
                  <td className="py-4 pr-4 font-medium">{s.name}</td>
                  <td className="py-4 pr-4 text-secondary">{s.email}</td>
                  <td className="py-4 pr-4 text-secondary">
                    {s.enrolledCourses.length > 0 ? (
                      s.enrolledCourses.map(c => c.title).join(', ')
                    ) : '-'}
                  </td>
                  <td className="py-4 pr-4">
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      background: 
                        s.status === 'paid' ? 'rgba(34, 197, 94, 0.15)' : 
                        s.status === 'revoked' || s.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 
                        'var(--surface-2)',
                      color: 
                        s.status === 'paid' ? '#16a34a' : 
                        s.status === 'revoked' || s.status === 'rejected' ? '#dc2626' : 
                        'var(--text-secondary)'
                    }}>
                      {s.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-secondary">
                    {s.accessExpiresAt ? new Date(s.accessExpiresAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="py-4">
                    {s.status === 'paid' && (
                      <button 
                        onClick={() => handleRevoke(s.id)}
                        className="text-xs font-medium px-3 py-1 rounded bg-surface-2 hover:bg-surface-3 transition-colors"
                        style={{ color: '#dc2626' }}
                      >
                        Revoke Access
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
