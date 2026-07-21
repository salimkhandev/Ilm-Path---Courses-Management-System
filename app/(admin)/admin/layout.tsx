import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--surface-0)' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
