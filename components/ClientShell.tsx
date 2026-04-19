'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import Loader from './Loader';
import Background from './Background';
import CursorGlow from './CursorGlow';
import Sidebar from './Sidebar';

type Theme = 'dark' | 'light';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('syntra_loaded')) {
      setLoading(false);
    }
    const savedTheme = localStorage.getItem('syntra_theme') as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const handleLoaderComplete = () => {
    sessionStorage.setItem('syntra_loaded', 'true');
    setLoading(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('syntra_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Background theme={theme} />
      <CursorGlow theme={theme} />
      {loading && <Loader onComplete={handleLoaderComplete} />}
      
      <div 
        style={{ 
          display: 'flex', 
          minHeight: '100vh', 
          opacity: loading ? 0 : 1, 
          transition: 'opacity 0.8s ease-in' 
        }}
      >
        <Sidebar />
        <main style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)',
          minHeight: '100vh',
          zIndex: 10,
          position: 'relative'
        }}>
          {children}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}
