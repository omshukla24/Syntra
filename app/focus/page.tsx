'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.focusWrap}>
        <div className={styles.badge}>
          <div className={styles.badgeDot} />
          <span>{isRunning ? 'Focus Mode Active' : 'Focus Mode Ready'}</span>
        </div>

        <h1 className={styles.title}>Deep Work</h1>
        <p className={styles.subtitle}>Distraction-free. One task at a time.</p>

        <div className={styles.timerCard}>
          <div className={styles.timer}>{formatTime(seconds)}</div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: selectedTask?.estimatedMinutes ? `${Math.min(100, (seconds / 60 / selectedTask.estimatedMinutes) * 100)}%` : '0%' }} />
          </div>

          {selectedTask ? (
            <div className={styles.taskInfo}>
              <span className={styles.taskName}>{selectedTask.title}</span>
              <span className={styles.taskMeta}>{selectedTask.description || selectedTask.category}</span>
            </div>
          ) : (
            <p className={styles.noTask}>No active tasks. Create one first.</p>
          )}

          <div className={styles.controls}>
            <button className={styles.controlBtn} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="5" y="4" width="3" height="12" rx="1" fill="#A0A0B8"/><rect x="12" y="4" width="3" height="12" rx="1" fill="#A0A0B8"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 4l10 6-10 6V4z" fill="#A0A0B8"/></svg>
              )}
            </button>
            <button className={styles.controlBtn} onClick={() => { setSeconds(0); setIsRunning(false); }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="4" y="4" width="12" height="12" rx="2" fill="#A0A0B8"/></svg>
            </button>
            <button className={styles.completeBtn} onClick={handleComplete} disabled={!selectedTask}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Mark Complete
            </button>
          </div>
        </div>

        {tasks.length > 1 && (
          <div className={styles.taskPicker}>
            <span className={styles.pickerLabel}>Switch task:</span>
            <div className={styles.pickerList}>
              {tasks.map(t => (
                <button
                  key={t.id}
                  className={`${styles.pickerItem} ${selectedTask?.id === t.id ? styles.pickerActive : ''}`}
                  onClick={() => { setSelectedTask(t); setSeconds(0); setIsRunning(false); }}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.quickStats}>
          <div className={styles.quickStat}>
            <span className={styles.quickValue}>{tasks.length}</span>
            <span className={styles.quickLabel}>Tasks Left</span>
          </div>
          <div className={styles.quickDivider} />
          <div className={styles.quickStat}>
            <span className={styles.quickValue} style={{ color: '#22D3EE' }}>{formatTime(seconds).slice(0, 5)}</span>
            <span className={styles.quickLabel}>This Session</span>
          </div>
        </div>
      </div>
    </div>
  );
}
