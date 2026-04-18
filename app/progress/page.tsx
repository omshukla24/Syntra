'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getDashboardStats, getTasks } from '@/lib/storage';
import { DashboardStats, Task, CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types';

export default function ProgressPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStats(getDashboardStats());
    setTasks(getTasks());
  }, []);

  if (!mounted || !stats) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  // Category breakdown
  const categories = (['exam-prep', 'coding', 'fitness', 'personal'] as const).map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const done = catTasks.filter(t => t.status === 'done').length;
    const total = catTasks.length;
    return { category: cat, done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weekData = [60, 85, 72, 96, 45, 108, 36]; // mock daily activity

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Progress</h1>
          <p className={styles.subtitle}>Your weekly performance at a glance</p>
        </div>
      </header>

      <div className={styles.topCards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Overall Completion</span>
          <div className={styles.ringWrap}>
            <svg width="120" height="120" viewBox="0 0 120 120" className={styles.ring}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="#1A1A24" strokeWidth="8"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#progressGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${stats.completionPercent * 3.14} 314`} transform="rotate(-90 60 60)"/>
              <defs><linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7C5CFF"/><stop offset="100%" stopColor="#22D3EE"/></linearGradient></defs>
            </svg>
            <span className={styles.ringValue}>{stats.completionPercent}%</span>
          </div>
          <span className={styles.cardHint} style={{ color: '#4ADE80' }}>+12% from last week</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Daily Streak</span>
          <span className={styles.bigValue}>{stats.streakDays || 12}</span>
          <span className={styles.cardHint}>Consecutive productive days</span>
          <div className={styles.streakDots}>
            {[0.3, 0.5, 0.7, 1, 0.5, 0.8, 1].map((opacity, i) => (
              <div key={i} className={styles.streakDot} style={{ opacity, background: i >= 5 ? 'linear-gradient(135deg, #7C5CFF, #22D3EE)' : '#7C5CFF' }} />
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Focus Hours</span>
          <span className={styles.bigValue}>{stats.weeklyFocusHours || 28.5}h</span>
          <span className={styles.cardHint} style={{ color: '#22D3EE' }}>Best week this month</span>
          <div className={styles.miniChart}>
            {[18, 28, 22, 38, 32, 48, 30].map((h, i) => (
              <div key={i} className={styles.miniBar} style={{ height: `${h}px`, opacity: i === 5 ? 1 : 0.5 }} />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomCards}>
        <div className={styles.card}>
          <span className={styles.cardTitle}>Category Breakdown</span>
          <div className={styles.categoryList}>
            {categories.map(c => (
              <div key={c.category} className={styles.categoryRow}>
                <div className={styles.catDot} style={{ backgroundColor: CATEGORY_COLORS[c.category] }} />
                <span className={styles.catName}>{CATEGORY_LABELS[c.category]}</span>
                <div className={styles.catBar}>
                  <div className={styles.catFill} style={{ width: `${c.pct}%`, backgroundColor: CATEGORY_COLORS[c.category] }} />
                </div>
                <span className={styles.catPct}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.cardTitle}>Weekly Activity</span>
          <div className={styles.activityChart}>
            {weekDays.map((day, i) => (
              <div key={i} className={styles.activityCol}>
                <div className={styles.activityBar} style={{ height: `${weekData[i]}px`, background: i === 5 ? 'linear-gradient(180deg, #7C5CFF, rgba(124,92,255,0.2))' : `linear-gradient(180deg, rgba(124,92,255,${weekData[i]/200 + 0.2}), rgba(124,92,255,0.08))` }} />
                <span className={styles.activityDay} style={{ color: i === 5 ? '#7C5CFF' : undefined }}>{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
