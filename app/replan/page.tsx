'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './page.module.css';
import { getUserApiKey, saveTasks, saveSchedule } from '@/lib/storage';
import { ReplanResult } from '@/lib/types';
import ApiKeyModal from '@/components/ApiKeyModal';

const viewVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.4, ease: 'easeIn' } }
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function ReplanPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReplanResult | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleReplan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    // Trigger visual pulse effect on body
    const glowField = document.createElement('div');
    glowField.className = 'fixed inset-0 pointer-events-none z-50';
    glowField.style.background = 'radial-gradient(circle at center, rgba(159, 141, 235,0.3) 0%, transparent 70%)';
    glowField.style.animation = 'shockwave 1.5s ease-out forwards';
    document.body.appendChild(glowField);
    setTimeout(() => glowField.remove(), 1500);

    try {
      const userKey = getUserApiKey();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userKey) headers['x-user-api-key'] = userKey;

      const res = await fetch('/api/replan', {
        method: 'POST',
        headers,
        body: JSON.stringify({ rawText: input }),
      });

      if (res.status === 429) {
        setShowKeyModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
      setIsMock(data.isMock || false);
    } catch {
      setShowKeyModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      saveTasks(result.tasks);
      saveSchedule(result.schedule);
      setAccepted(true);
    }
  };

  const suggestions = [
    '"I have exams, gym, coding, and feel overwhelmed"',
    '"Plan my exam week efficiently"',
    '"Balance work and fitness routine"',
  ];

  return (
    <div className={styles.container}>
      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onKeySubmitted={() => { setShowKeyModal(false); handleReplan(); }}
      />

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div 
            key="input-view"
            className={styles.inputView}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div className={styles.logoIcon} variants={itemVariants} animate={loading ? { rotate: 360, boxShadow: '0 0 40px #9F8DEB' } : {}} transition={loading ? { repeat: Infinity, duration: 2, ease: "linear" } : {}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L20 7.5V16.5L12 22L4 16.5V7.5L12 2Z" stroke="#1E293B" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" fill="#1E293B"/></svg>
            </motion.div>
            <motion.h1 className={styles.heroTitle} variants={itemVariants}>Restructure Reality</motion.h1>
            <motion.p className={styles.heroSubtitle} variants={itemVariants}>Feed the system your thoughts. Syntra will align them.</motion.p>

            <motion.div className={styles.inputCard} variants={itemVariants}>
              <textarea
                className={styles.textarea}
                placeholder="I have exams coming up, I need to hit the gym, I want to code more, and I feel completely overwhelmed..."
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={5}
                disabled={loading}
              />
              <div className={styles.inputFooter}>
                <div className={styles.detectedTags}>
                  <AnimatePresence>
                    {input.length > 10 && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <span className={styles.tagLabel}>Syntra detected:</span>
                        {input.toLowerCase().includes('exam') && <span className={styles.tag} style={{ borderColor: 'var(--plasma-purple)', color: 'var(--plasma-purple)' }}>goals</span>}
                        {(input.toLowerCase().includes('overwhelm') || input.toLowerCase().includes('stress')) && <span className={styles.tag} style={{ borderColor: 'var(--plasma-pink)', color: 'var(--plasma-pink)' }}>system overload</span>}
                        {input.toLowerCase().includes('week') && <span className={styles.tag} style={{ borderColor: 'var(--plasma-cyan)', color: 'var(--plasma-cyan)' }}>timeline limit</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <motion.button 
                  className={styles.structureBtn} 
                  onClick={handleReplan} 
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(159, 141, 235,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h2l2-4 3 8 2-4h3" stroke="#1E293B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                  {loading ? 'Processing...' : 'Structure This'}
                </motion.button>
              </div>
            </motion.div>

            <motion.div className={styles.suggestions} variants={itemVariants}>
              <span className={styles.sugLabel}>System prompts:</span>
              <div className={styles.sugList}>
                {suggestions.map((s, i) => (
                  <motion.button 
                    key={s} 
                    className={styles.sugBtn} 
                    onClick={() => setInput(s.replace(/"/g, ''))}
                    whileHover={{ y: -2, backgroundColor: 'rgba(15, 23, 42, 0.05)' }}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="result-view"
            className={styles.resultView}
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.header className={styles.resultHeader} variants={itemVariants}>
              <div>
                <div className={styles.resultTitleRow}>
                  <h1 className={styles.title}>System Restructured</h1>
                  <span className={styles.aiBadge}>{isMock ? 'Mock Output' : 'AI-Aligned'}</span>
                </div>
                <p className={styles.subtitle}>Reality has been mapped. Awaiting your confirmation.</p>
              </div>
              {!accepted ? (
                <motion.button 
                  className={styles.acceptBtn} 
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 208, 230,0.3)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-5" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Commit Reality
                </motion.button>
              ) : (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className={styles.acceptedLabel}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-5" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Reality Committed
                </motion.span>
              )}
            </motion.header>

            <motion.div className={styles.detectedSection} variants={itemVariants}>
              <span className={styles.detectedLabel}>Core Objectives Detected:</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.detectedGoals?.map((g, i) => (
                  <motion.span key={i} className={styles.goalTag} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}>
                    {g}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div className={styles.insights} variants={itemVariants}>
              <div className={styles.insightItem}>
                <span className={styles.insightLabel}>Efficiency Gain</span>
                <span className={styles.insightValue} style={{ color: 'var(--plasma-cyan)', textShadow: '0 0 20px rgba(0, 208, 230,0.3)' }}>{result.insights?.productivityGain}</span>
              </div>
              <div className={styles.insightDivider} />
              <div className={styles.insightItem}>
                <span className={styles.insightLabel}>Deep Work Req.</span>
                <span className={styles.insightValue} style={{ color: 'var(--plasma-purple)', textShadow: '0 0 20px rgba(249, 250, 252,0.3)' }}>{result.insights?.deepWorkHours}</span>
              </div>
              <div className={styles.insightDivider} />
              <div className={styles.insightItem}>
                <span className={styles.insightLabel}>System Load (Risk)</span>
                <span className={styles.insightValue} style={{ color: 'var(--plasma-pink)', textShadow: '0 0 20px rgba(159, 141, 235,0.3)' }}>{result.insights?.burnoutRisk}</span>
              </div>
            </motion.div>

            <motion.div className={styles.taskPreview} variants={itemVariants}>
              <h3 className={styles.sectionTitle}>Generated Nodes ({result.tasks?.length || 0})</h3>
              <motion.div className={styles.taskGrid}>
                {result.tasks?.map((t, i) => (
                  <motion.div 
                    key={i} 
                    className={styles.taskCard}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(15, 23, 42, 0.05)' }}
                  >
                    <span className={styles.taskTitle}>{t.title}</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <span className={styles.taskMeta}>{t.category}</span>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t.priority} priority</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.button 
              className={styles.resetBtn} 
              onClick={() => { setResult(null); setAccepted(false); setInput(''); }}
              whileHover={{ x: -4 }}
            >
              ← Re-Initialize
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
