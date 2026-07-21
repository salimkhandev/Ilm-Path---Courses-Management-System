'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getOfflineVideos, getOfflineVideoUrl, deleteOfflineVideo } from '@/lib/opfs';

interface OfflineVideoItem {
  videoId: string;
  courseId: string;
  courseTitle: string;
  videoTitle: string;
  filename: string;
  sizeBytes: number;
  downloadedAt: Date;
  localUrl?: string;
}

export default function OfflineDownloadsPage() {
  const [downloads, setDownloads] = useState<OfflineVideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);

  async function loadDownloads() {
    const list = getOfflineVideos() as any[];
    // Resolve local file urls so they can be played back from memory directly
    const resolved = await Promise.all(
      list.map(async (v) => {
        let localUrl = '';
        try {
          localUrl = await getOfflineVideoUrl(v.videoId);
        } catch (err) {
          console.error('Failed to resolve OPFS URL for', v.videoId, err);
        }
        return {
          ...v,
          localUrl,
        };
      })
    );
    setDownloads(resolved);
  }

  useEffect(() => {
    loadDownloads();
  }, []);

  async function handleDelete(videoId: string) {
    if (!confirm('Delete this download from your offline storage?')) return;
    await deleteOfflineVideo(videoId);
    if (activeVideo && downloads.find((d) => d.videoId === videoId)?.localUrl === activeVideo.url) {
      setActiveVideo(null);
    }
    loadDownloads();
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/dashboard" className="text-xs text-muted hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Offline Downloads</h1>
          <p className="text-xs text-muted mt-1">Videos stored securely in your browser's private storage</p>
        </div>
        <Link href="/dashboard" className="text-sm px-4 py-2 border rounded hover:bg-surface-2 transition-colors" style={{ color: 'var(--text-secondary)', borderColor: 'var(--surface-2)', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
      </div>

      {downloads.length === 0 ? (
        <div className="card text-center py-12 text-secondary">
          No offline downloads found. 
          Navigate to a course video and click &quot;Download for Offline&quot; to save videos here.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: activeVideo ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>
          
          {/* Offline playlist */}
          <div className="flex flex-col gap-3">
            {downloads.map((d) => (
              <div 
                key={d.videoId}
                className="card flex justify-between items-center"
                style={{ 
                  padding: '1rem', 
                  border: activeVideo?.url === d.localUrl ? '1px solid var(--brand-500)' : '1px solid var(--surface-2)',
                  background: activeVideo?.url === d.localUrl ? 'rgba(245,158,11,0.04)' : 'var(--surface-1)'
                }}
              >
                <div className="min-w-0 flex-1 mr-4">
                  <span className="text-xs text-brand-400 font-semibold uppercase">{d.courseTitle}</span>
                  <h4 className="font-semibold text-sm mt-0.5 mb-1 truncate">{d.videoTitle}</h4>
                  <p className="text-xs text-muted">
                    💾 {(d.sizeBytes / 1024 / 1024).toFixed(1)} MB &nbsp;|&nbsp; Saved: {new Date(d.downloadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {d.localUrl && (
                    <button 
                      className="btn-primary text-xs px-3 py-1.5"
                      onClick={() => setActiveVideo({ title: d.videoTitle, url: d.localUrl! })}
                    >
                      Play Offline
                    </button>
                  )}
                  <button 
                    className="text-xs px-3 py-1.5 border rounded hover:bg-opacity-20 hover:bg-red-500 text-red"
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                    onClick={() => handleDelete(d.videoId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Active Offline Player */}
          {activeVideo && (
            <div className="card flex flex-col gap-3" style={{ padding: '1.25rem' }}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-sm truncate max-w-xs">{activeVideo.title}</h3>
                <button 
                  className="text-xs text-muted hover:underline"
                  onClick={() => setActiveVideo(null)}
                >
                  Close Player
                </button>
              </div>
              
              <div style={{ background: '#000', borderRadius: '0.5rem', overflow: 'hidden', aspectRatio: '16/9' }}>
                <video 
                  src={activeVideo.url} 
                  controls 
                  controlsList="nodownload"
                  onContextMenu={e => e.preventDefault()}
                  style={{ width: '100%', height: '100%' }}
                  autoPlay
                />
              </div>
              <p className="text-xs text-muted">
                ⚠️ Playing from secure browser sandbox. Screen recording is disabled by policy.
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
