'use client';

import { useState, useRef, useCallback } from 'react';
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
      setMessages(prev => [...prev, { id: generateId(), role: 'assistant', content: 'Voice AI is unavailable. Please try typing instead.' }]);
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

      <div className={styles.voiceWrap}>
        <div className={styles.badge}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1" width="4" height="7" rx="2" stroke="#22D3EE" strokeWidth="1.2"/><path d="M3 6a4 4 0 008 0M7 11v2" stroke="#22D3EE" strokeWidth="1.2" strokeLinecap="round"/></svg>
          Talk to Syntra
        </div>

        <h1 className={styles.title}>Voice Assistant</h1>
        <p className={styles.subtitle}>Speak naturally. Syntra listens and responds with voice.</p>

        <button
          className={`${styles.micBtn} ${isListening ? styles.micActive : ''}`}
          onClick={toggleListening}
          disabled={loading}
        >
          <div className={styles.micRing} />
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="12" y="4" width="8" height="14" rx="4" stroke={isListening ? '#22D3EE' : '#A0A0B8'} strokeWidth="1.8"/>
            <path d="M8 14a8 8 0 0016 0M16 24v4" stroke={isListening ? '#22D3EE' : '#A0A0B8'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {isListening && (
          <div className={styles.listeningWrap}>
            <div className={styles.waveform}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.wave} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <span className={styles.listeningText}>
              {transcript || 'Listening...'}
            </span>
          </div>
        )}

        {loading && <span className={styles.processingText}>Processing...</span>}

        <div className={styles.messages}>
          {messages.map(msg => (
            <div key={msg.id} className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.aiMsg}`}>
              <span className={styles.msgRole}>{msg.role === 'user' ? 'You' : 'Syntra'}</span>
              <p className={styles.msgText}>{msg.content}</p>
            </div>
          ))}
        </div>

        <div className={styles.textFallback}>
          <input
            className={styles.textInput}
            placeholder="Or type your message..."
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleTextSend()}
          />
          <button className={styles.textSendBtn} onClick={handleTextSend} disabled={!textInput.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
