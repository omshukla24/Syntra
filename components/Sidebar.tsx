'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/tasks', label: 'Tasks', icon: 'tasks' },
  { href: '/plan', label: 'Plan', icon: 'plan' },
  { href: '/focus', label: 'Focus', icon: 'focus' },
  { href: '/progress', label: 'Progress', icon: 'progress' },
  { href: '/replan', label: 'Replan', icon: 'replan' },
  { href: '/chat', label: 'AI Chat', icon: 'chat' },
  { href: '/voice', label: 'Talk to AI', icon: 'voice' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  const color = active ? '#7C5CFF' : '#6E6E82';
  switch (icon) {
    case 'dashboard':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.3"/><rect x="11" y="1" width="6" height="3.5" rx="1.5" stroke={color} strokeWidth="1.3"/><rect x="1" y="11" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.3"/><rect x="11" y="7.5" width="6" height="9.5" rx="1.5" stroke={color} strokeWidth="1.3"/></svg>;
    case 'tasks':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.3"/><path d="M6 9l2 2 4-4" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'plan':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="2" width="14" height="14" rx="2" stroke={color} strokeWidth="1.3"/><path d="M2 7h14" stroke={color} strokeWidth="1.3"/><path d="M6 2v3M12 2v3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
    case 'focus':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke={color} strokeWidth="1.3"/><circle cx="9" cy="9" r="3" stroke={color} strokeWidth="1.3"/></svg>;
    case 'progress':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 14l4-4 3 3 4-6 5 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'replan':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 9h3l2-5 3 10 2-5h6" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'chat':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3h12a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V4a1 1 0 011-1z" stroke={color} strokeWidth="1.3"/></svg>;
    case 'voice':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="7" y="1" width="4" height="9" rx="2" stroke={color} strokeWidth="1.3"/><path d="M4 8a5 5 0 0010 0M9 14v3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
    case 'settings':
      return <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.5" stroke={color} strokeWidth="1.3"/><path d="M9 1v2.5M9 14.5V17M1 9h2.5M14.5 9H17M3.3 3.3l1.8 1.8M12.9 12.9l1.8 1.8M3.3 14.7l1.8-1.8M12.9 5.1l1.8-1.8" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1L18 6V14L10 19L2 14V6L10 1Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <circle cx="10" cy="10" r="2.5" fill="#fff"/>
          </svg>
        </div>
        {!collapsed && <span className={styles.logoText}>Syntra</span>}
      </div>

      <div className={styles.navList}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${active ? styles.active : ''}`}
            >
              <NavIcon icon={item.icon} active={active} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d={collapsed ? "M6 4l4 4-4 4" : "M10 4l-4 4 4 4"} stroke="#6E6E82" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </nav>
  );
}
