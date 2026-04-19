'use client';

import { useState, useEffect } from 'react';
import Loader from './Loader';
import Background from './Background';
import CursorGlow from './CursorGlow';
import Sidebar from './Sidebar';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('syntra_loaded')) {
      setLoading(false);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('syntra_loaded', 'true');
    setLoading(false);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <>
      <Background />
      <CursorGlow />
      {loading && <Loader onComplete={handleLoaderComplete} />}
      
      <div 
        style={{ 
          display: 'flex', 
          minHeight: '100vh', 
          opacity: loading ? 0 : 1, 
          transition: 'opacity 0.8s ease-in' 
        }}
      >
        <Sidebar />
        <main style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          zIndex: 10,
          position: 'relative'
        }}>
          {children}
        </main>
      </div>
    </>
  );
}
