'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface PaymentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  screenshotUrl: string | null;
  adminNote?: string;
}

export default function AdminDashboard() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Note inputs per payment
  const [notes, setNotes] = useState<Record<string, string>>({});
  // Process states
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  async function fetchPayments() {
    try {
      const res = await fetch('/api/admin/payments');
      if (!res.ok) throw new Error('Failed to load payments.');
      const data = await res.json();
      setPayments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  async function handleReview(paymentId: string, status: 'approved' | 'rejected') {
    setProcessing(prev => ({ ...prev, [paymentId]: true }));
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          status,
          adminNote: notes[paymentId] || ''
        })
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update payment status');
      }

      await fetchPayments();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(prev => ({ ...prev, [paymentId]: false }));
    }
  }

  if (loading) return <div className="text-center py-10">Loading payments...</div>;
  if (error) return <div className="alert-error">{error}</div>;

  return (
    <div>
      {/* Admin Nav */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Admin Panel — Payment Approvals</h1>
        <Link
          href="/admin/courses"
          className="btn-primary text-sm px-4 py-2"
          style={{ textDecoration: 'none' }}
        >
          📚 Manage Courses
        </Link>
      </div>

      {payments.length === 0 ? (
        <p className="text-secondary">No payment submissions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {payments.map((p) => (
            <div key={p.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                
                {/* Text Info */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-base">{p.name}</h3>
                      <p className="text-xs text-muted">{p.email}</p>
                    </div>
                    <span 
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase`}
                      style={{ 
                        background: p.status === 'approved' ? 'rgba(34,197,94,0.1)' : p.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: p.status === 'approved' ? '#22c55e' : p.status === 'rejected' ? '#ef6868' : '#f59e0b'
                      }}
                    >
                      {p.status}
                    </span>
                  </div>

                  <div className="text-sm flex flex-col gap-1.5 text-secondary">
                    <div><strong>Method:</strong> {p.paymentMethod}</div>
                    <div><strong>TID:</strong> {p.transactionId}</div>
                    <div><strong>Amount:</strong> Rs. {p.amount}</div>
                    <div><strong>Phone:</strong> {p.phone}</div>
                    <div><strong>Submitted:</strong> {new Date(p.submittedAt).toLocaleString()}</div>
                  </div>

                  {/* Actions (if pending) */}
                  {p.status === 'pending' && (
                    <div className="mt-4 flex flex-col gap-2">
                      <input 
                        className="input text-sm"
                        placeholder="Admin note (e.g. rejection reason)" 
                        value={notes[p.id] || ''}
                        onChange={e => setNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <button 
                          className="btn-primary" 
                          style={{ flex: 1, background: '#22c55e', color: '#0f172a' }}
                          onClick={() => handleReview(p.id, 'approved')}
                          disabled={processing[p.id]}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-primary" 
                          style={{ flex: 1, background: '#ef4444', color: '#fff' }}
                          onClick={() => handleReview(p.id, 'rejected')}
                          disabled={processing[p.id]}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin note (if reviewed) */}
                  {p.status !== 'pending' && p.adminNote && (
                    <div className="mt-3 text-xs p-2.5 rounded bg-surface-2 text-muted">
                      <strong>Admin Note:</strong> {p.adminNote}
                    </div>
                  )}
                </div>

                {/* Screenshot view */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className="text-xs font-semibold text-secondary">Uploaded Screenshot:</span>
                  {p.screenshotUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={p.screenshotUrl} 
                      alt="Payment screenshot" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '280px', 
                        objectFit: 'contain', 
                        borderRadius: '0.5rem',
                        border: '1px solid var(--surface-2)' 
                      }} 
                    />
                  ) : (
                    <div className="text-xs text-muted p-4 bg-surface-2 rounded text-center">
                      No screenshot link or failed to load.
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
