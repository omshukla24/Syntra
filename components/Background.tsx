'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function Background() {
  const bgRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 100,
        y: (e.clientY / window.innerHeight - 0.5) * 100,
      });
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
      {/* Cyan plasma blob — top left */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '5%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 208, 230, 0.12) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        className="animate-breathe"
      />
      {/* Lilac structure blob — center */}
      <motion.div
        animate={{ x: mousePos.x * -0.3, y: mousePos.y * 0.5 }}
        transition={{ type: 'spring', stiffness: 40, damping: 25 }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '40%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(159, 141, 235, 0.1) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Ice highlight — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5%',
          right: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(226, 232, 240, 0.4) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        className="animate-breathe"
      />
    </div>
  );
}
