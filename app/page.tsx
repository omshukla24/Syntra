'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './page.module.css';
import { getTasks, getDashboardStats, saveTasks, saveSchedule } from '@/lib/storage';
import { MOCK_TASKS, MOCK_SCHEDULE } from '@/lib/mock-data';
import { Task, DashboardStats, CATEGORY_COLORS, PRIORITY_COLORS } from '@/lib/types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    <motion.div 
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div>
          <h1 className={styles.title}>System State</h1>
          <p className={styles.subtitle}>Syntra is actively monitoring your routine</p>
        </div>
        <Link href="/replan" className={styles.replanBtn}>
          <div className={styles.btnGlow} />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ position: 'relative', zIndex: 2 }}><path d="M1 7h2l2-4 3 8 2-4h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ position: 'relative', zIndex: 2 }}>Replan Reality</span>
        </Link>
      </motion.header>

      <motion.div className={styles.statsGrid} variants={itemVariants}>
        <StatCard label="Total Nodes" value={stats.totalTasks} color="#1E293B" />
        <StatCard label="Completed" value={stats.completedTasks} color="var(--plasma-cyan)" />
        <StatCard label="Deep Work" value={`${Math.round(stats.focusMinutesToday / 60 * 10) / 10}h`} color="var(--plasma-purple)" />
        <StatCard label="Critical" value={stats.urgentTasks} color="var(--plasma-pink)" />
      </motion.div>

      <div className={styles.mainGrid}>
        <motion.div className={styles.taskList} variants={itemVariants}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Active Nodes</h2>
            <Link href="/tasks" className={styles.viewAll}>View all →</Link>
          </div>
          <motion.div className={styles.taskItems} layout>
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div 
                  key={task.id} 
                  className={styles.taskItem}
                  variants={itemVariants}
                  whileHover={{ x: 6, scale: 1.01, backgroundColor: 'var(--glass-hover-bg)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  layout
                >
                  <div className={styles.taskDot} style={{ backgroundColor: CATEGORY_COLORS[task.category], boxShadow: `0 0 8px ${CATEGORY_COLORS[task.category]}80` }} />
                  <div className={styles.taskInfo}>
                    <span className={styles.taskTitle}>{task.title}</span>
                    <span className={styles.taskMeta}>{task.category.replace('-', ' ')} • {task.estimatedMinutes}min</span>
                  </div>
                  <span className={styles.taskPriority} style={{ color: PRIORITY_COLORS[task.priority] }}>
                    {task.priority}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className={styles.rightPanel}>
          <motion.div variants={itemVariants} style={{ flex: 1, display: 'flex' }}>
            <Link href="/replan" className={styles.replanCard}>
              <div className={styles.replanGlow} />
              <h3 className={styles.replanTitle}>Structural Shift</h3>
              <p className={styles.replanDesc}>System load sub-optimal. Allow Syntra to restructure your timeline with peak efficiency.</p>
              <span className={styles.replanAction}>Initiate →</span>
            </Link>
          </motion.div>

          <motion.div className={styles.quickStats} variants={itemVariants}>
            <div className={styles.quickStat}>
              <span className={styles.quickValue}>{stats.streakDays}</span>
              <span className={styles.quickLabel}>Streak</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickValue} style={{ color: 'var(--plasma-cyan)' }}>{stats.weeklyFocusHours}h</span>
              <span className={styles.quickLabel}>Focus</span>
            </div>
            <div className={styles.quickStat}>
              <span className={styles.quickValue} style={{ color: 'var(--plasma-pink)' }}>{stats.completionPercent}%</span>
              <span className={styles.quickLabel}>Optimal</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <motion.div 
      className={styles.statCard}
      whileHover={{ y: -6, rotateX: 6, rotateY: -6, boxShadow: `0 20px 40px -10px ${color}20, inset 0 1px 0 rgba(15, 23, 42, 0.05)` }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 1000 }}
    >
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color, textShadow: `0 0 25px ${color}60` }}>{value}</span>
    </motion.div>
  );
}
