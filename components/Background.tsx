'use client';

import { useEffect, useRef } from 'react';

export default function Background() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (bgRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 12;
        const y = (e.clientY / window.innerHeight - 0.5) * 12;
        bgRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {/* Pink plasma blob — top left */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,46,159,0.08) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        className="animate-breathe"
      />
      {/* Purple structure blob — center */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,255,0.06) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Cyan highlight — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        className="animate-breathe"
      />
    </div>
  );
}
