'use client';

import { useState } from 'react';
import styles from './ApiKeyModal.module.css';
import { setUserApiKey, clearUserApiKey, getUserApiKey } from '@/lib/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySubmitted: () => void;
}

export default function ApiKeyModal({ isOpen, onClose, onKeySubmitted }: ApiKeyModalProps) {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const existingKey = typeof window !== 'undefined' ? getUserApiKey() : null;

  if (!isOpen) return null;

  const handleSave = () => {
    if (key.trim()) {
      setUserApiKey(key.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onKeySubmitted();
        onClose();
      }, 1200);
    }
  };

  const handleClear = () => {
    clearUserApiKey();
    setKey('');
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 7a3 3 0 00-6 0v2H6v8h8V9h-2V7zm-2 0v2h-2V7a1 1 0 012 0z" fill="#F5E6C8"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>Enter Your API Key</h3>
            <p className={styles.subtitle}>Rate limit reached. Use your own Gemini API key to continue.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="#6E6E82" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.safetyNote}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#4ADE80" strokeWidth="1.2"/>
              <path d="M5 7l1.5 1.5L9.5 5" stroke="#4ADE80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Your API key is stored <strong>only in your browser&apos;s localStorage</strong>. It is never sent to any server, logged, or stored externally.</span>
          </div>

          <label className={styles.label}>Gemini API Key</label>
          <input
            type="password"
            className={styles.input}
            placeholder="AIza..."
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />

          {existingKey && (
            <p className={styles.existingNote}>
              You currently have a saved key (••••{existingKey.slice(-4)}).{' '}
              <button className={styles.clearLink} onClick={handleClear}>Clear it</button>
            </p>
          )}

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.getKeyLink}
          >
            Get a free API key from Google AI Studio →
          </a>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={`${styles.saveBtn} ${saved ? styles.saved : ''}`}
            onClick={handleSave}
            disabled={!key.trim() || saved}
          >
            {saved ? '✓ Saved' : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
}
