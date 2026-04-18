'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { getUserApiKey, saveTasks, saveSchedule } from '@/lib/storage';
import { ReplanResult } from '@/lib/types';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function ReplanPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReplanResult | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleReplan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const userKey = getUserApiKey();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userKey) headers['x-user-api-key'] = userKey;

      const res = await fetch('/api/replan', {
        method: 'POST',
        headers,
        body: JSON.stringify({ rawText: input }),
      });

      if (res.status === 429) {
        setShowKeyModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult(data);
      setIsMock(data.isMock || false);
    } catch {
      setShowKeyModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    if (result) {
      saveTasks(result.tasks);
      saveSchedule(result.schedule);
      setAccepted(true);
    }
  };

  const suggestions = [
    '"I have exams, gym, coding, and feel overwhelmed"',
    '"Plan my exam week efficiently"',
    '"Balance work and fitness routine"',
  ];

  return (
    <div className={styles.container}>
      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onKeySubmitted={() => { setShowKeyModal(false); handleReplan(); }}
      />

      {!result ? (
        <div className={styles.inputView}>
          <div className={styles.logoIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L20 7.5V16.5L12 22L4 16.5V7.5L12 2Z" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>
          </div>
          <h1 className={styles.heroTitle}>What&apos;s on your mind?</h1>
          <p className={styles.heroSubtitle}>Type your thoughts, worries, goals — anything. Syntra will structure it into an actionable system.</p>

          <div className={styles.inputCard}>
            <textarea
              className={styles.textarea}
              placeholder="I have exams coming up, I need to hit the gym, I want to code more, and I feel completely overwhelmed..."
              value={input}
              onChange={e => setInput(e.target.value)}
              rows={4}
            />
            <div className={styles.inputFooter}>
              <div className={styles.detectedTags}>
                {input.length > 10 && (
                  <>
                    <span className={styles.tagLabel}>Syntra detected:</span>
                    {input.toLowerCase().includes('exam') && <span className={styles.tag} style={{ backgroundColor: 'rgba(124,92,255,0.12)', color: '#7C5CFF' }}>goals</span>}
                    {(input.toLowerCase().includes('overwhelm') || input.toLowerCase().includes('stress')) && <span className={styles.tag} style={{ backgroundColor: 'rgba(255,92,92,0.12)', color: '#FF5C5C' }}>overwhelm signal</span>}
                    {input.toLowerCase().includes('week') && <span className={styles.tag} style={{ backgroundColor: 'rgba(34,211,238,0.12)', color: '#22D3EE' }}>time pressure</span>}
                  </>
                )}
              </div>
              <button className={styles.structureBtn} onClick={handleReplan} disabled={!input.trim() || loading}>
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h2l2-4 3 8 2-4h3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
                {loading ? 'Processing...' : 'Structure This'}
              </button>
            </div>
          </div>

          <div className={styles.suggestions}>
            <span className={styles.sugLabel}>or try</span>
            <div className={styles.sugList}>
              {suggestions.map(s => (
                <button key={s} className={styles.sugBtn} onClick={() => setInput(s.replace(/"/g, ''))}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.resultView}>
          <header className={styles.resultHeader}>
            <div>
              <div className={styles.resultTitleRow}>
                <h1 className={styles.title}>Replan My Life</h1>
                <span className={styles.aiBadge}>{isMock ? 'Mock Data' : 'AI-Powered'}</span>
              </div>
              <p className={styles.subtitle}>Syntra analyzed your input and restructured your schedule</p>
            </div>
            {!accepted ? (
              <button className={styles.acceptBtn} onClick={handleAccept}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7.5l3 3 5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Accept New Plan
              </button>
            ) : (
              <span className={styles.acceptedLabel}>✓ Plan Accepted</span>
            )}
          </header>

          <div className={styles.detectedSection}>
            <span className={styles.detectedLabel}>Detected Goals:</span>
            {result.detectedGoals?.map((g, i) => (
              <span key={i} className={styles.goalTag}>{g}</span>
            ))}
          </div>

          <div className={styles.insights}>
            <div className={styles.insightItem}>
              <span className={styles.insightLabel}>Productivity gain</span>
              <span className={styles.insightValue} style={{ color: '#4ADE80' }}>{result.insights?.productivityGain}</span>
            </div>
            <div className={styles.insightDivider} />
            <div className={styles.insightItem}>
              <span className={styles.insightLabel}>Deep work hours</span>
              <span className={styles.insightValue} style={{ color: '#22D3EE' }}>{result.insights?.deepWorkHours}</span>
            </div>
            <div className={styles.insightDivider} />
            <div className={styles.insightItem}>
              <span className={styles.insightLabel}>Burnout risk</span>
              <span className={styles.insightValue} style={{ color: '#FFBB33' }}>{result.insights?.burnoutRisk}</span>
            </div>
          </div>

          <div className={styles.taskPreview}>
            <h3 className={styles.sectionTitle}>Generated Tasks ({result.tasks?.length || 0})</h3>
            <div className={styles.taskGrid}>
              {result.tasks?.slice(0, 6).map((t, i) => (
                <div key={i} className={styles.taskCard}>
                  <span className={styles.taskTitle}>{t.title}</span>
                  <span className={styles.taskMeta}>{t.category} • {t.priority}</span>
                </div>
              ))}
            </div>
          </div>

          <button className={styles.resetBtn} onClick={() => { setResult(null); setAccepted(false); setInput(''); }}>
            ← Start Over
          </button>
        </div>
      )}
    </div>
  );
}
