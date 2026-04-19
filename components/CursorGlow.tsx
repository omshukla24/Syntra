'use client';

import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.08;
      pos.current.y += (target.current.y - pos.current.y) * 0.08;

      if (glowRef.current) {
        glowRef.current.style.left = `${pos.current.x - 150}px`;
        glowRef.current.style.top = `${pos.current.y - 150}px`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none"
      style={{
        zIndex: 1,
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(255,46,159,0.12) 0%, rgba(124,92,255,0.04) 40%, transparent 70%)',
        filter: 'blur(40px)',
        willChange: 'left, top',
      }}
    />
  );
}
