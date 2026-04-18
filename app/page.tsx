'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getTasks, getDashboardStats, saveTasks, saveSchedule } from '@/lib/storage';
import { MOCK_TASKS, MOCK_SCHEDULE } from '@/lib/mock-data';
import { Task, DashboardStats, CATEGORY_COLORS, PRIORITY_COLORS } from '@/lib/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let storedTasks = getTasks();
    if (storedTasks.length === 0) {
      saveTasks(MOCK_TASKS);
      saveSchedule(MOCK_SCHEDULE);
      storedTasks = MOCK_TASKS;
    }
    setTasks(storedTasks.filter(t => t.status !== 'done').slice(0, 5));
    setStats(getDashboardStats());
  }, []);

  if (!mounted || !stats) {
    return <div className={styles.container}><div className={styles.loading}>Loading Syntra...</div></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back. Here&apos;s your system status.</p>
        </div>
        <Link href="/replan" className={styles.replanBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h2l2-4 3 8 2-4h3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Replan My Life
        </Link>
      </header>

      <div className={styles.statsGrid}>
        <StatCard label="Total Tasks" value={stats.totalTasks} color="#E8E8F0" />
        <StatCard label="Completed" value={stats.completedTasks} color="#4ADE80" />
        <StatCard label="Focus Today" value={`${Math.round(stats.focusMinutesToday / 60 * 10) / 10}h`} color="#22D3EE" />
        <StatCard label="Urgent" value={stats.urgentTasks} color="#FF5C5C" />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.taskList}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Active Tasks</h2>
            <Link href="/tasks" className={styles.viewAll}>View all →</Link>
          </div>
          <div className={styles.taskItems}>
            {tasks.map(task => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskDot} style={{ backgroundColor: CATEGORY_COLORS[task.category] }} />
                <div className={styles.taskInfo}>
                  <span className={styles.taskTitle}>{task.title}</span>
                  <span className={styles.taskMeta}>{task.category.replace('-', ' ')} • {task.estimatedMinutes}min</span>
                </div>
                <span className={styles.taskPriority} style={{ color: PRIORITY_COLORS[task.priority] }}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <Link href="/replan" className={styles.replanCard}>
            <div className={styles.replanGlow} />
            <h3 className={styles.replanTitle}>Replan My Life</h3>
            <p className={styles.replanDesc}>Feeling overwhelmed? Let Syntra restructure your entire schedule using AI.</p>
            <span className={styles.replanAction}>Structure This →</span>
          </Link>

          <div className={styles.quickStats}>
            <div className={styles.quickStat}>
              <span className={styles.quickValue}>{stats.streakDays}</span>
              <span className={styles.quickLabel}>Day Streak</span>
            </div>
            <div className={styles.quickDivider} />
            <div className={styles.quickStat}>
              <span className={styles.quickValue} style={{ color: '#22D3EE' }}>{stats.weeklyFocusHours}h</span>
              <span className={styles.quickLabel}>Focus This Week</span>
            </div>
            <div className={styles.quickDivider} />
            <div className={styles.quickStat}>
              <span className={styles.quickValue} style={{ color: '#7C5CFF' }}>{stats.completionPercent}%</span>
              <span className={styles.quickLabel}>Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color }}>{value}</span>
    </div>
  );
}
