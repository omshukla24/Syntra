/* ─── Task Types ─── */
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'exam-prep' | 'coding' | 'fitness' | 'personal';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'done';
  dueDate?: string;
  estimatedMinutes?: number;
  createdAt: string;
  completedAt?: string;
}

/* ─── Schedule Types ─── */
export interface TimeBlock {
  id: string;
  taskId?: string;
  title: string;
  category: Task['category'];
  day: string; // ISO date
  startTime: string; // HH:mm
  durationMinutes: number;
}

/* ─── Replan Types ─── */
export interface ReplanInput {
  rawText: string;
}

export interface ReplanResult {
  tasks: Task[];
  schedule: TimeBlock[];
  insights: {
    productivityGain: string;
    deepWorkHours: string;
    burnoutRisk: string;
  };
  detectedGoals: string[];
  detectedSignals: string[];
}

/* ─── Chat Types ─── */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

/* ─── Stats ─── */
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  focusMinutesToday: number;
  urgentTasks: number;
  streakDays: number;
  weeklyFocusHours: number;
  completionPercent: number;
}

/* ─── API Key ─── */
export interface ApiKeyState {
  userKey: string | null;
  isRateLimited: boolean;
  showKeyModal: boolean;
}

/* ─── Category Colors ─── */
export const CATEGORY_COLORS: Record<Task['category'], string> = {
  'exam-prep': '#7C5CFF',
  'coding': '#4DA6FF',
  'fitness': '#4ADE80',
  'personal': '#FFBB33',
};

export const CATEGORY_LABELS: Record<Task['category'], string> = {
  'exam-prep': 'Exam Prep',
  'coding': 'Coding',
  'fitness': 'Fitness',
  'personal': 'Personal',
};

export const PRIORITY_COLORS: Record<Task['priority'], string> = {
  'critical': '#FF5C5C',
  'high': '#FFBB33',
  'medium': '#4DA6FF',
  'low': '#6E6E82',
};

export const STATUS_COLORS: Record<Task['status'], string> = {
  'active': '#4ADE80',
  'pending': '#FFBB33',
  'done': '#6E6E82',
};
