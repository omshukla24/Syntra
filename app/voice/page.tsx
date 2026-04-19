'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './page.module.css';
import { getUserApiKey, generateId } from '@/lib/storage';
import ApiKeyModal from '@/components/ApiKeyModal';

interface VoiceMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function VoicePage() {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [textInput, setTextInput] = useState('');
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const sendToVoiceAI = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: generateId(), role: 'user', content: text }]);
    setLoading(true);

    try {
      const userKey = getUserApiKey();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (userKey) headers['x-user-api-key'] = userKey;

      const res = await fetch('/api/voice', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text }),
      });

      if (res.status === 429) {
        setShowKeyModal(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const reply = data.response;
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: reply }]);

      // Speak the response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        synthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: 'Connection fragmented. Fall back to manual input.' }]);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.results[event.results.length - 1];
      setTranscript(current[0].transcript);
      if (current.isFinal) {
        sendToVoiceAI(current[0].transcript);
        setTranscript('');
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const handleTextSend = () => {
    if (textInput.trim()) {
      sendToVoiceAI(textInput.trim());
      setTextInput('');
    }
  };

  return (
    <div className={styles.container}>
      <ApiKeyModal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} onKeySubmitted={() => setShowKeyModal(false)} />

      <motion.div 
        className={styles.voiceWrap}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div className={styles.badge} animate={isListening ? { boxShadow: '0 0 20px rgba(0, 208, 230,0.4)', borderColor: 'rgba(0, 208, 230,0.8)' } : {}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1" width="4" height="7" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M3 6a4 4 0 008 0M7 11v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          {isListening ? 'Acoustic Link Active' : 'Establishing Acoustic Link'}
        </motion.div>

        <div>
          <h1 className={styles.title}>Vocal Interface</h1>
          <p className={styles.subtitle}>Relay your directives verbally to the Syntra Core</p>
        </div>

        <motion.button
          className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
          onClick={toggleListening}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { boxShadow: '0 0 60px rgba(0, 208, 230,0.3)', borderColor: '#00D0E6' } : {}}
        >
          {isListening && (
            <motion.div 
              className={styles.micRing} 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          )}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ position: 'relative', zIndex: 2 }}>
            <rect x="12" y="4" width="8" height="14" rx="4" stroke={isListening ? '#1E293B' : 'rgba(255, 255, 255, 0.6)'} strokeWidth="1.8"/>
            <path d="M8 14a8 8 0 0016 0M16 24v4" stroke={isListening ? '#1E293B' : 'rgba(255, 255, 255, 0.6)'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.button>

        <AnimatePresence mode="wait">
          {isListening && (
            <motion.div 
              className={styles.listeningWrap}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.waveform}>
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className={styles.wave} 
                    animate={{ scaleY: [0.5, 1.5, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1, ease: 'easeInOut' }}
                  />
                ))}
              </div>
              <span className={styles.listeningText}>
                {transcript || 'Awaiting input...'}
              </span>
            </motion.div>
          )}

          {loading && (
            <motion.span 
              className={styles.processingText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Processing vocal data...
            </motion.span>
          )}
        </AnimatePresence>

        <div className={styles.messages}>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                key={msg.id} 
                className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 }}
                layout
              >
                <span className={styles.msgRole}>{msg.role === 'user' ? 'Operator' : 'Syntra'}</span>
                <p className={styles.msgText}>{msg.content}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className={styles.textFallback}>
          <input
            className={styles.textInput}
            placeholder="Manual input fallback..."
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTextSend()}
          />
          <button className={styles.textSendBtn} onClick={handleTextSend} disabled={!textInput.trim()}>
            Execute
          </button>
        </div>
      </motion.div>
    </div>
  );
}
