'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { getTasks, addFocusSession, updateTask } from '@/lib/storage';
import { Task } from '@/lib/types';

export default function FocusPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    const activeTasks = getTasks().filter(t => t.status !== 'done');
    setTasks(activeTasks);
    if (activeTasks.length > 0) setSelectedTask(activeTasks[0]);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const handleComplete = useCallback(() => {
    if (selectedTask) {
      updateTask(selectedTask.id, { status: 'done', completedAt: new Date().toISOString() });
      addFocusSession(Math.floor(seconds / 60));
      const remaining = tasks.filter(t => t.id !== selectedTask.id);
      setTasks(remaining);
      setSelectedTask(remaining[0] || null);
      setSeconds(0);
      setIsRunning(false);
    }
  }, [selectedTask, seconds, tasks]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Connecting Time Core...</div></div>;

  const progressPct = selectedTask?.estimatedMinutes ? Math.min(100, (seconds / 60 / selectedTask.estimatedMinutes) * 100) : 0;

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.focusWrap}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <motion.div className={styles.badge} animate={isRunning ? { boxShadow: '0 0 20px rgba(194, 123, 58,0.3)', borderColor: 'rgba(194, 123, 58,0.5)', color: 'var(--plasma-pink)' } : {}}>
          <div className={styles.badgeDot} style={{ backgroundColor: isRunning ? 'var(--plasma-pink)' : 'var(--plasma-cyan)' }} />
          <span>{isRunning ? 'Temporal Lock Active' : 'System Ready'}</span>
        </motion.div>

        <div>
          <h1 className={styles.title}>Deep Work</h1>
          <p className={styles.subtitle}>Isolate. Execute. Prevail.</p>
        </div>

        <motion.div className={styles.timerCard} animate={isRunning ? { boxShadow: '0 0 80px rgba(245, 230, 200,0.08), inset 0 0 40px rgba(245, 230, 200,0.03)' } : {}}>
          {isRunning && (
            <motion.div 
              className={styles.timerGlow}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            />
          )}

          <div className={styles.timer}>
            <AnimatePresence mode="popLayout">
              {formatTime(seconds).split('').map((char, i) => (
                <motion.span
                  key={`${i}-${char}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'inline-block', width: char === ':' ? '20px' : '48px', textAlign: 'center', color: isRunning ? '#fff' : 'var(--text-primary)' }}
                >
                  {char}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <div className={styles.progressBar}>
            <motion.div 
              className={styles.progressFill} 
              animate={{ width: `${progressPct}%` }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </div>

          {selectedTask ? (
            <div className={styles.taskInfo}>
              <span className={styles.taskName}>{selectedTask.title}</span>
              <span className={styles.taskMeta}>{selectedTask.description || selectedTask.category}</span>
            </div>
          ) : (
            <p className={styles.noTask}>No active nodes allocated.</p>
          )}

          <div className={styles.controls}>
            <motion.button 
              className={styles.controlBtn} 
              onClick={() => setIsRunning(!isRunning)}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isRunning ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="4" width="3" height="12" rx="1" fill="#fff"/><rect x="12" y="4" width="3" height="12" rx="1" fill="#fff"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4l10 6-10 6V4z" fill="#fff"/></svg>
              )}
            </motion.button>
            <motion.button 
              className={styles.controlBtn} 
              onClick={() => { setSeconds(0); setIsRunning(false); }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="var(--text-secondary)"/></svg>
            </motion.button>
            <motion.button 
              className={styles.completeBtn} 
              onClick={handleComplete} 
              disabled={!selectedTask}
              whileHover={selectedTask ? { scale: 1.05, boxShadow: '0 0 20px rgba(232, 166, 52,0.3)' } : {}}
              whileTap={selectedTask ? { scale: 0.95 } : {}}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Finalize Node
            </motion.button>
          </div>
        </motion.div>

        {tasks.length > 1 && (
          <div className={styles.taskPicker}>
            <span className={styles.pickerLabel}>Available Nodes:</span>
            <div className={styles.pickerList}>
              {tasks.map(t => (
                <motion.button
                  key={t.id}
                  className={`${styles.pickerItem} ${selectedTask?.id === t.id ? styles.pickerActive : ''}`}
                  onClick={() => { setSelectedTask(t); setSeconds(0); setIsRunning(false); }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.title}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickValue}>{tasks.length}</span>
            <span className={styles.quickLabel}>Nodes Left</span>
          </div>
          <div className={styles.quickDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickValue} style={{ color: 'var(--plasma-cyan)', textShadow: '0 0 20px rgba(232, 166, 52,0.4)' }}>{formatTime(seconds).slice(0, 5)}</span>
            <span className={styles.quickLabel}>Session Yield</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
