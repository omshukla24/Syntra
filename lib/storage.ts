'use client';

import { Task, TimeBlock, ChatMessage, DashboardStats } from './types';

const KEYS = {
  tasks: 'syntra_tasks',
  schedule: 'syntra_schedule',
  chatHistory: 'syntra_chat_history',
  focusSessions: 'syntra_focus_sessions',
  userApiKey: 'syntra_user_api_key',
  settings: 'syntra_settings',
};

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ═══ Tasks ═══ */
export function getTasks(): Task[] {
  return get<Task[]>(KEYS.tasks, []);
}

export function saveTasks(tasks: Task[]): void {
  set(KEYS.tasks, tasks);
}

export function addTask(task: Task): void {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = getTasks().map(t => t.id === id ? { ...t, ...updates } : t);
  saveTasks(tasks);
}

export function deleteTask(id: string): void {
  saveTasks(getTasks().filter(t => t.id !== id));
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find(t => t.id === id);
}

/* ═══ Schedule ═══ */
export function getSchedule(): TimeBlock[] {
  return get<TimeBlock[]>(KEYS.schedule, []);
}

export function saveSchedule(schedule: TimeBlock[]): void {
  set(KEYS.schedule, schedule);
}

/* ═══ Chat History ═══ */
export function getChatHistory(): ChatMessage[] {
  return get<ChatMessage[]>(KEYS.chatHistory, []);
}

export function saveChatHistory(messages: ChatMessage[]): void {
  set(KEYS.chatHistory, messages);
}

export function addChatMessage(msg: ChatMessage): void {
  const history = getChatHistory();
  history.push(msg);
  saveChatHistory(history);
}

export function clearChatHistory(): void {
  set(KEYS.chatHistory, []);
}

/* ═══ Focus Sessions ═══ */
interface FocusSession {
  date: string;
  minutes: number;
}

export function getFocusSessions(): FocusSession[] {
  return get<FocusSession[]>(KEYS.focusSessions, []);
}

export function addFocusSession(minutes: number): void {
  const sessions = getFocusSessions();
  const today = new Date().toISOString().split('T')[0];
  const existing = sessions.find(s => s.date === today);
  if (existing) {
    existing.minutes += minutes;
  } else {
    sessions.push({ date: today, minutes });
  }
  set(KEYS.focusSessions, sessions);
}

/* ═══ API Key (BYOK) ═══ */
export function getUserApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.userApiKey) || null;
}

export function setUserApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.userApiKey, key);
}

export function clearUserApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.userApiKey);
}

/* ═══ Dashboard Stats ═══ */
export function getDashboardStats(): DashboardStats {
  const tasks = getTasks();
  const sessions = getFocusSessions();
  const today = new Date().toISOString().split('T')[0];
  const todaySession = sessions.find(s => s.date === today);
  
  const completed = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;

  // Calculate streak
  let streak = 0;
  const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  const now = new Date();
  for (let i = 0; i < sortedDates.length; i++) {
    const expected = new Date(now);
    expected.setDate(expected.getDate() - i);
    if (sortedDates[i] === expected.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }

  // Weekly focus hours
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyMinutes = sessions
    .filter(s => new Date(s.date) >= weekAgo)
    .reduce((sum, s) => sum + s.minutes, 0);

  return {
    totalTasks: total,
    completedTasks: completed,
    focusMinutesToday: todaySession?.minutes || 0,
    urgentTasks: tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length,
    streakDays: streak,
    weeklyFocusHours: Math.round((weeklyMinutes / 60) * 10) / 10,
    completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

/* ═══ Generate ID ═══ */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
