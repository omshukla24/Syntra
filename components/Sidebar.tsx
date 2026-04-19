'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Sidebar.module.css';
import { useTheme } from './ClientShell';

const NAV_ITEMS = [
  { href: '/', label: 'System State', icon: 'dashboard' },
  { href: '/tasks', label: 'Nodes', icon: 'tasks' },
  { href: '/plan', label: 'Matrix', icon: 'plan' },
  { href: '/focus', label: 'Deep Work', icon: 'focus' },
  { href: '/progress', label: 'Yield', icon: 'progress' },
  { href: '/replan', label: 'Shift', icon: 'replan' },
  { href: '/chat', label: 'Neural Link', icon: 'chat' },
  { href: '/voice', label: 'Acoustic', icon: 'voice' },
  { href: '/settings', label: 'Config', icon: 'settings' },
];

function NavIcon({ icon, active, theme }: { icon: string; active: boolean; theme: string }) {
  const color = active ? (theme === 'light' ? '#12121A' : '#fff') : 'var(--text-muted)';
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
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.logo}>
        <motion.div 
          className={styles.logoIcon}
          animate={{ boxShadow: ['0 0 20px rgba(255,46,159,0.2)', '0 0 40px rgba(124,92,255,0.4)', '0 0 20px rgba(255,46,159,0.2)'] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 1L18 6V14L10 19L2 14V6L10 1Z" stroke="#fff" strokeWidth="1.5" fill="none"/>
            <circle cx="10" cy="10" r="2.5" fill="#fff"/>
          </svg>
        </motion.div>
        {!collapsed && <span className={styles.logoText}>SYNTRA</span>}
      </div>

      <div className={styles.navList}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navItemWrapper}
            >
              <div className={`${styles.navItem} ${active ? styles.active : ''}`}>
                {active && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className={styles.activeGlow}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <NavIcon icon={item.icon} active={active} theme={theme} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.bottomControls}>
        <button
          className={styles.themeToggleBtn}
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.svg key="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </motion.svg>
            ) : (
              <motion.svg key="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.2 }}>
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </motion.svg>
            )}
          </AnimatePresence>
          {!collapsed && <span>{theme === 'dark' ? 'Void' : 'Glass'} Mode</span>}
        </button>

        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d={collapsed ? "M6 4l4 4-4 4" : "M10 4l-4 4 4 4"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </nav>
  );
}
