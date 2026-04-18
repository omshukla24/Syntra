'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { getSchedule } from '@/lib/storage';
import { TimeBlock, CATEGORY_COLORS } from '@/lib/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function PlanPage() {
  const [schedule, setSchedule] = useState<TimeBlock[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSchedule(getSchedule());
  }, []);

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  // Group by day
  const weekStart = getMonday();
  const days = DAYS.map((label, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayNum = date.getDate();
    const isToday = dateStr === new Date().toISOString().split('T')[0];
    const blocks = schedule.filter(b => b.day === dateStr);
    return { label, dayNum, dateStr, blocks, isToday };
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Weekly Plan</h1>
          <p className={styles.subtitle}>{formatWeekRange(weekStart)}</p>
        </div>
      </header>

      <div className={styles.weekGrid}>
        {days.map(day => (
          <div key={day.dateStr} className={`${styles.dayColumn} ${day.isToday ? styles.today : ''}`}>
            <div className={`${styles.dayHeader} ${day.isToday ? styles.todayHeader : ''}`}>
              <span className={styles.dayLabel}>{day.label}</span>
              <span className={styles.dayNum}>{day.dayNum}</span>
              {day.isToday && <span className={styles.todayBadge}>Today</span>}
            </div>
            <div className={styles.blocks}>
              {day.blocks.map(block => (
                <div
                  key={block.id}
                  className={styles.block}
                  style={{ borderLeftColor: CATEGORY_COLORS[block.category], backgroundColor: `${CATEGORY_COLORS[block.category]}10` }}
                >
                  <span className={styles.blockTitle}>{block.title}</span>
                  <span className={styles.blockTime}>{block.startTime} — {block.durationMinutes}m</span>
                </div>
              ))}
              {day.blocks.length === 0 && <span className={styles.emptyDay}>No events</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatWeekRange(monday: Date) {
  const sun = new Date(monday);
  sun.setDate(sun.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return `${monday.toLocaleDateString('en-US', opts)} – ${sun.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}
