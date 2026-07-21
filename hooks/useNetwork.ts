'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Set initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      
      // If we go offline, we shouldn't stay on network-dependent pages
      // However, we want to allow offline viewing on /downloads and /watch
      const allowedOfflinePaths = ['/downloads', '/about', '/privacy', '/terms', '/refund'];
      
      if (
        pathname !== '/' &&
        !allowedOfflinePaths.some(p => pathname?.startsWith(p)) && 
        !pathname?.startsWith('/watch/') // Allow watching offline videos
      ) {
        // Redirect to offline downloads page
        router.push('/downloads');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pathname, router]);

  return isOnline;
}
