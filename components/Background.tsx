'use client';

import { useEffect, useRef } from 'react';

const BLOBS = {
  dark: [
    { top: '-10%', left: '5%', size: 600, color: 'rgba(255,46,159,0.08)', blur: 80 },
    { top: '30%', left: '40%', size: 500, color: 'rgba(124,92,255,0.06)', blur: 100 },
    { bottom: '-5%', right: '10%', size: 500, color: 'rgba(0,240,255,0.05)', blur: 80 },
  ],
  light: [
    { top: '-10%', left: '5%', size: 600, color: 'rgba(224,26,132,0.06)', blur: 100 },
    { top: '30%', left: '40%', size: 500, color: 'rgba(106,75,224,0.05)', blur: 120 },
    { bottom: '-5%', right: '10%', size: 500, color: 'rgba(0,177,204,0.04)', blur: 100 },
  ],
};

export default function Background({ theme }: { theme: string }) {
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

  const blobs = theme === 'light' ? BLOBS.light : BLOBS.dark;

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            bottom: (blob as Record<string, unknown>).bottom as string | undefined,
            right: (blob as Record<string, unknown>).right as string | undefined,
            width: blob.size,
            height: blob.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 60%)`,
            filter: `blur(${blob.blur}px)`,
            transition: 'all 0.8s ease',
          }}
          className={i !== 1 ? 'animate-breathe' : undefined}
        />
      ))}
    </div>
  );
}
