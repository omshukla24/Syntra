'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#050507' }}
      initial={{ opacity: 1 }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (exiting) onComplete(); }}
    >
      {/* Energy Core */}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #FF2E9F, #7C5CFF, #00F0FF, transparent)',
            opacity: 0.3,
            filter: 'blur(20px)',
          }}
        />
        {/* Inner pulsing orb */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,46,159,0.5) 0%, rgba(124,92,255,0.3) 40%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
        {/* Core dot */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,46,159,0.3)',
          }}
        />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          marginTop: 60,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.4)',
          textTransform: 'uppercase',
        }}
      >
        Syntra is structuring reality
      </motion.p>

      {/* Particle dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, -100 - Math.random() * 100],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2 + Math.random() * 2,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: i % 2 === 0 ? '#FF2E9F' : '#00F0FF',
          }}
        />
      ))}

      {/* Auto-dismiss after 3s */}
      <motion.div
        onAnimationComplete={() => setExiting(true)}
        animate={{ opacity: 0 }}
        transition={{ delay: 2.8, duration: 0.01 }}
      />
    </motion.div>
  );
}
