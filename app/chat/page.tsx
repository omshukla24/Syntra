'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';
import { getUserApiKey, getChatHistory, addChatMessage, clearChatHistory, generateId } from '@/lib/storage';
import { ChatMessage } from '@/lib/types';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMessages(getChatHistory());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    addChatMessage(userMsg);
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const userKey = getUserApiKey();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userKey) headers['x-user-api-key'] = userKey;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: userMsg.content, history: messages.slice(-10) }),
      });

      if (res.status === 429) {
        setShowKeyModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = { id: generateId(), role: 'assistant', content: data.response, timestamp: new Date().toISOString() };
      addChatMessage(assistantMsg);
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = { id: generateId(), role: 'assistant', content: 'Sorry, an error occurred. Please try again.', timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} onKeySubmitted={() => setShowKeyModal(false)} />

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>AI Chat</h1>
          <p className={styles.subtitle}>Your personal productivity assistant</p>
        </div>
        <button className={styles.clearBtn} onClick={handleClear}>Clear History</button>
      </header>

      <div className={styles.chatArea}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 6h20a2 2 0 012 2v14a2 2 0 01-2 2H10l-4 4V8a2 2 0 012-2z" stroke="#7C5CFF" strokeWidth="1.5"/></svg>
            </div>
            <h3>Start a conversation</h3>
            <p>Ask about your schedule, productivity tips, or how to manage your tasks better.</p>
            <div className={styles.quickPrompts}>
              {['How should I prioritize my tasks today?', 'I feel overwhelmed with exams', 'Tips for better focus sessions'].map(q => (
                <button key={q} className={styles.quickPrompt} onClick={() => setInput(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}>
            <div className={styles.msgAvatar}>
              {msg.role === 'user' ? 'You' : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#7C5CFF" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2" fill="#7C5CFF"/></svg>
              )}
            </div>
            <div className={styles.msgContent}>
              <span className={styles.msgRole}>{msg.role === 'user' ? 'You' : 'Syntra AI'}</span>
              <p className={styles.msgText}>{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistantMsg}`}>
            <div className={styles.msgAvatar}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#7C5CFF" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2" fill="#7C5CFF"/></svg>
            </div>
            <div className={styles.msgContent}>
              <span className={styles.msgRole}>Syntra AI</span>
              <div className={styles.typing}><span /><span /><span /></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.chatInput}
          placeholder="Ask Syntra anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button className={styles.sendBtn} onClick={sendMessage} disabled={!input.trim() || loading}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8l6-6v4h7v4H7v4L1 8z" fill="#fff"/></svg>
        </button>
      </div>
    </div>
  );
}
