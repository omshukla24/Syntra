'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [exiting, setExiting] = useState(false);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#F4F7FB' }}
      initial={{ opacity: 1 }}
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      onAnimationComplete={() => { if (exiting) onComplete(); }}
    >
      {/* Energy Core */}
      <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
        
        {/* Outer ambient blur */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #00D0E6, #9F8DEB, #F9FAFC, transparent)',
            opacity: 0.15,
            filter: 'blur(20px)',
          }}
        />

        {/* Energy Ring */}
        <motion.svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D0E6" />
              <stop offset="100%" stopColor="#9F8DEB" />
            </linearGradient>
          </defs>
          <motion.circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: 0, rotate: 360 }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
        </motion.svg>

        {/* Central Orb */}
        <motion.div
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(0, 208, 230, 0.4), inset 0 0 10px rgba(159, 141, 235, 0.2)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      {/* Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        style={{
          marginTop: 60,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.25em',
          color: '#64748B',
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
            background: i % 2 === 0 ? '#00D0E6' : '#9F8DEB',
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
