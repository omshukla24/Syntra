'use client';

import { useEffect, useRef, ReactNode } from 'react';

export default function CursorGlow({ children }: { children: ReactNode }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124, 92, 255, 0.04), rgba(77, 166, 255, 0.02), transparent 60%)`;
      }
      // Subtle parallax on content
      if (contentRef.current) {
        const x = (e.clientX / window.innerWidth - 0.5) * 4;
        const y = (e.clientY / window.innerHeight - 0.5) * 4;
        contentRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Cursor-reactive glow layer */}
      <div
        ref={glowRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'background 0.3s ease',
        }}
      />
      {/* Static ambient orbs */}
      <div style={{
        position: 'fixed',
        top: '-120px',
        left: '15%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 92, 255, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-80px',
        right: '10%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34, 211, 238, 0.04) 0%, transparent 60%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Content with parallax */}
      <div ref={contentRef} style={{ position: 'relative', zIndex: 1, transition: 'transform 0.15s ease-out' }}>
        {children}
      </div>
    </div>
  );
}
