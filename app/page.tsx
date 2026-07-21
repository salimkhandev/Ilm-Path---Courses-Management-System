import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Lock, Download, GraduationCap, Smartphone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PashtoSkills — Learn Online Skills in Pashto',
  description:
    'Browse expert-taught online skills courses in Pashto, pay once, and stream or watch offline.',
};

const FEATURES = [
  {
    icon: <Lock className="w-10 h-10 text-amber-500" />,
    title: 'Secure Streaming',
    desc: 'Videos served via short-lived signed URLs. Nothing is ever permanently downloadable to your device.',
  },
  {
    icon: <Download className="w-10 h-10 text-amber-500" />,
    title: 'Offline Access',
    desc: 'Cache any video securely in your browser for offline viewing — no internet required after download.',
  },
  {
    icon: <GraduationCap className="w-10 h-10 text-amber-500" />,
    title: 'Expert Courses',
    desc: 'Carefully crafted curriculum by experienced instructors. Learn at your own pace, any time.',
  },
  {
    icon: <Smartphone className="w-10 h-10 text-amber-500" />,
    title: 'Any Device',
    desc: 'Installable PWA — works on Android, iOS, Windows, and desktop. No app store needed.',
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 sm:px-8 lg:px-12 relative overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none"
        />

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full px-4 py-1 text-xs font-semibold tracking-widest uppercase mb-7">
            Pashto Learning Platform
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-100 mb-6">
            Learn Online Skills in{' '}
            <span className="text-amber-500">Pashto</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
            Master high-income skills with expert-taught courses in your native language. Stream online or watch offline — on any device.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-slate-950 font-bold text-base rounded-xl no-underline hover:bg-amber-600 transition-colors"
            >
              Browse Courses →
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-3.5 bg-slate-900 border border-slate-700 text-slate-100 font-semibold text-base rounded-xl no-underline hover:border-slate-600 transition-colors"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:px-8 lg:px-12 border-t border-slate-800 bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2">
            Everything you need to learn effectively
          </h2>
          <p className="text-center text-slate-400 mb-14 text-base sm:text-lg">
            Built for Pakistan's internet conditions — low bandwidth, offline-first.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-7">
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 sm:px-8 lg:px-12 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to start learning?
          </h2>
          <p className="text-slate-400 mb-8 text-base sm:text-lg">
            Register for free and browse courses. Pay when you&apos;re ready.
          </p>
          <Link
            href="/register"
            className="inline-flex px-10 py-3.5 bg-amber-500 text-slate-950 font-bold text-base rounded-xl no-underline hover:bg-amber-600 transition-colors"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
