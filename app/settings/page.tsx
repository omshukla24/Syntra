'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { getUserApiKey, setUserApiKey, clearUserApiKey } from '@/lib/storage';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [existingKey, setExistingKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setExistingKey(getUserApiKey());
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setUserApiKey(apiKey.trim());
      setExistingKey(apiKey.trim());
      setApiKey('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    clearUserApiKey();
    setExistingKey(null);
    setApiKey('');
  };

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.subtitle}>Manage your Syntra configuration</p>

      {/* API Key Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13 6a3 3 0 00-6 0v2H5v8h8V8h-2V6zm-2 0v2H9V6a1 1 0 012 0z" fill="rgba(249, 250, 252,0.6)"/></svg>
          </div>
          <div>
            <h2 className={styles.sectionTitle}>Gemini API Key</h2>
            <p className={styles.sectionDesc}>Configure your own API key for unlimited AI access</p>
          </div>
        </div>

        <div className={styles.safetyBanner}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#4ADE80" strokeWidth="1.2"/><path d="M5 7l1.5 1.5L9.5 5" stroke="#4ADE80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Your API key is stored <strong>only in your browser&apos;s localStorage</strong>. It is never sent to any server, logged, or stored externally. 100% private.</span>
        </div>

        {existingKey ? (
          <div className={styles.existingKeyCard}>
            <div className={styles.keyStatus}>
              <div className={styles.statusDot} />
              <span>API Key Active</span>
            </div>
            <div className={styles.keyDisplay}>
              <span className={styles.keyMask}>••••••••••••{existingKey.slice(-6)}</span>
              <button className={styles.clearBtn} onClick={handleClear}>Remove Key</button>
            </div>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <label className={styles.label}>Gemini API Key</label>
            <div className={styles.inputRow}>
              <input
                type="password"
                className={styles.input}
                placeholder="AIza..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
              />
              <button
                className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
                onClick={handleSave}
                disabled={!apiKey.trim() || saved}
              >
                {saved ? '✓ Saved' : 'Save Key'}
              </button>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.getKeyLink}
            >
              Get a free API key from Google AI Studio →
            </a>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1L16 5.5V12.5L9 17L2 12.5V5.5L9 1Z" stroke="rgba(249, 250, 252,0.6)" strokeWidth="1.3" fill="none"/><circle cx="9" cy="9" r="2" fill="rgba(249, 250, 252,0.6)"/></svg>
          </div>
          <div>
            <h2 className={styles.sectionTitle}>About Syntra</h2>
            <p className={styles.sectionDesc}>From thought to system</p>
          </div>
        </div>
        <div className={styles.aboutCard}>
          <div className={styles.aboutRow}><span className={styles.aboutLabel}>Version</span><span className={styles.aboutValue}>1.0.0</span></div>
          <div className={styles.aboutRow}><span className={styles.aboutLabel}>AI Model</span><span className={styles.aboutValue}>Gemini 2.5 Flash</span></div>
          <div className={styles.aboutRow}><span className={styles.aboutLabel}>Storage</span><span className={styles.aboutValue}>Browser localStorage</span></div>
          <div className={styles.aboutRow}><span className={styles.aboutLabel}>Data Privacy</span><span className={styles.aboutValue}>100% client-side</span></div>
        </div>
      </div>
    </div>
  );
}
