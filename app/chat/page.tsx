'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import styles from './page.module.css';
import { getUserApiKey, getChatHistory, addChatMessage, clearChatHistory, generateId } from '@/lib/storage';
import { ChatMessage } from '@/lib/types';
import ApiKeyModal from '@/components/ApiKeyModal';

const messageVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
      const errorMsg: ChatMessage = { id: generateId(), role: 'assistant', content: 'Connection to Syntra core failed. Please retry.', timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    clearChatHistory();
    setMessages([]);
  };

  if (!mounted) return <div className={styles.container}><div className={styles.loading}>Connecting...</div></div>;

  return (
    <div className={styles.container}>
      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} onKeySubmitted={() => setShowKeyModal(false)} />

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Neural Link</h1>
          <p className={styles.subtitle}>Direct interface with Syntra</p>
        </div>
        <button className={styles.clearBtn} onClick={handleClear}>Purge History</button>
      </header>

      <div className={styles.chatArea}>
        {messages.length === 0 && (
          <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className={styles.emptyIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 6h20a2 2 0 012 2v14a2 2 0 01-2 2H10l-4 4V8a2 2 0 012-2z" stroke="var(--plasma-cyan)" strokeWidth="1.5"/></svg>
            </div>
            <h3>Establish Connection</h3>
            <p>Query your schedule, extract insights, or request architectural modifications to your routine.</p>
            <div className={styles.quickPrompts}>
              {['Analyze my current load', 'Identify overflow risks', 'Optimize structure'].map(q => (
                <button key={q} className={styles.quickPrompt} onClick={() => setInput(q)}>{q}</button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id} 
              className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.msgAvatar}>
                {msg.role === 'user' ? 'USR' : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#E8A634" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2" fill="#E8A634"/></svg>
                )}
              </div>
              <div className={styles.msgContent}>
                <span className={styles.msgRole}>{msg.role === 'user' ? 'Operator' : 'Syntra Core'}</span>
                <p className={styles.msgText}>{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div 
              key="loading"
              className={`${styles.message} ${styles.assistantMsg}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
            >
              <div className={styles.msgAvatar}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="#E8A634" strokeWidth="1.2" fill="none"/><circle cx="8" cy="8" r="2" fill="#E8A634"/></svg>
              </div>
              <div className={styles.msgContent}>
                <span className={styles.msgRole}>Syntra Core</span>
                <div className={styles.typing}>
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.chatInput}
          placeholder="Transmit query..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <motion.button 
          className={styles.sendBtn} 
          onClick={sendMessage} 
          disabled={!input.trim() || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8l6-6v4h7v4H7v4L1 8z" fill="#E8A634"/></svg>
        </motion.button>
      </div>
    </div>
  );
}
