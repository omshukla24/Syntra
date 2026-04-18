import { Task, TimeBlock, ReplanResult, ChatMessage } from './types';

/* ═══════════════════════════════════════════
   Mock Data — Always-available fallback
   Used for testing and when no API key is present
   ═══════════════════════════════════════════ */

export const MOCK_TASKS: Task[] = [
  {
    id: 'mock-1',
    title: 'Complete Data Structures assignment',
    description: 'Chapters 12-14 — Binary Trees and Graphs',
    category: 'exam-prep',
    priority: 'critical',
    status: 'active',
    dueDate: new Date(Date.now() + 3 * 3600000).toISOString(),
    estimatedMinutes: 120,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Build React portfolio components',
    description: 'Hero section, project cards, contact form',
    category: 'coding',
    priority: 'high',
    status: 'active',
    estimatedMinutes: 180,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Gym — Upper Body',
    description: 'Bench press, overhead press, rows',
    category: 'fitness',
    priority: 'medium',
    status: 'pending',
    estimatedMinutes: 45,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-4',
    title: 'Study Linear Algebra',
    description: 'Eigenvalues and eigenvectors — Chapter 7',
    category: 'exam-prep',
    priority: 'high',
    status: 'active',
    dueDate: new Date(Date.now() + 48 * 3600000).toISOString(),
    estimatedMinutes: 150,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 'mock-5',
    title: 'Meal prep for the week',
    description: 'Cook chicken, rice, and veggies',
    category: 'personal',
    priority: 'low',
    status: 'pending',
    estimatedMinutes: 60,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'mock-6',
    title: 'Review OS lecture notes',
    description: 'Process scheduling and memory management',
    category: 'exam-prep',
    priority: 'medium',
    status: 'done',
    estimatedMinutes: 90,
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    completedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'mock-7',
    title: 'Run 5K',
    description: 'Evening run in the park',
    category: 'fitness',
    priority: 'low',
    status: 'done',
    estimatedMinutes: 30,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'mock-8',
    title: 'Deploy API project to Vercel',
    description: 'Final testing and production deployment',
    category: 'coding',
    priority: 'high',
    status: 'active',
    estimatedMinutes: 60,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_SCHEDULE: TimeBlock[] = [
  { id: 'sched-1', title: 'Study DS', category: 'exam-prep', day: getWeekDay(0), startTime: '09:00', durationMinutes: 120 },
  { id: 'sched-2', title: 'Gym', category: 'fitness', day: getWeekDay(0), startTime: '17:00', durationMinutes: 45 },
  { id: 'sched-3', title: 'Code React', category: 'coding', day: getWeekDay(0), startTime: '19:00', durationMinutes: 120 },
  { id: 'sched-4', title: 'Linear Alg', category: 'exam-prep', day: getWeekDay(1), startTime: '10:00', durationMinutes: 180 },
  { id: 'sched-5', title: 'API project', category: 'coding', day: getWeekDay(1), startTime: '15:00', durationMinutes: 120 },
  { id: 'sched-6', title: 'Gym — Legs', category: 'fitness', day: getWeekDay(2), startTime: '07:00', durationMinutes: 60 },
  { id: 'sched-7', title: 'Study OS', category: 'exam-prep', day: getWeekDay(2), startTime: '11:00', durationMinutes: 120 },
  { id: 'sched-8', title: 'Meal prep', category: 'personal', day: getWeekDay(2), startTime: '18:00', durationMinutes: 60 },
  { id: 'sched-9', title: 'Portfolio', category: 'coding', day: getWeekDay(3), startTime: '09:00', durationMinutes: 180 },
  { id: 'sched-10', title: 'Revision', category: 'exam-prep', day: getWeekDay(3), startTime: '14:00', durationMinutes: 120 },
  { id: 'sched-11', title: 'DS Exam', category: 'exam-prep', day: getWeekDay(4), startTime: '10:00', durationMinutes: 180 },
  { id: 'sched-12', title: 'Run 5K', category: 'fitness', day: getWeekDay(4), startTime: '17:00', durationMinutes: 40 },
  { id: 'sched-13', title: 'DS Assign', category: 'exam-prep', day: getWeekDay(5), startTime: '09:00', durationMinutes: 120 },
  { id: 'sched-14', title: 'Gym — UB', category: 'fitness', day: getWeekDay(5), startTime: '17:00', durationMinutes: 45 },
  { id: 'sched-15', title: 'React comp', category: 'coding', day: getWeekDay(5), startTime: '19:00', durationMinutes: 120 },
  { id: 'sched-16', title: 'Rest day', category: 'personal', day: getWeekDay(6), startTime: '10:00', durationMinutes: 60 },
  { id: 'sched-17', title: 'Light review', category: 'exam-prep', day: getWeekDay(6), startTime: '16:00', durationMinutes: 60 },
];

function getWeekDay(offset: number): string {
  const d = new Date();
  const dayOfWeek = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset);
  return monday.toISOString().split('T')[0];
}

export const MOCK_REPLAN_RESULT: ReplanResult = {
  tasks: MOCK_TASKS.slice(0, 5),
  schedule: MOCK_SCHEDULE.slice(0, 6),
  insights: {
    productivityGain: '+34%',
    deepWorkHours: '2h → 4.5h',
    burnoutRisk: 'High → Low',
  },
  detectedGoals: ['Exam preparation', 'Fitness routine', 'Portfolio building', 'Personal organization'],
  detectedSignals: ['overwhelm signal', 'time pressure', 'multiple competing goals'],
};

export const MOCK_CHAT_RESPONSES: string[] = [
  "Based on your current schedule, I'd recommend starting with your Data Structures assignment since it's due soon. Block out a 2-hour focused session in the morning when your cognitive energy is highest.",
  "I notice you have 3 tasks marked as high priority. Let's triage: the DS assignment is critical (due in 3 hours), followed by the Linear Algebra study session. I'd move the portfolio work to tomorrow afternoon.",
  "Great progress! You've completed 71% of your tasks this week. To maintain momentum, try the Pomodoro technique: 25 minutes focused work, 5 minutes break. Your gym session at 5 PM will serve as a natural energy reset.",
  "Your focus time has been trending up — 28.5 hours this week, your best yet! One suggestion: your coding sessions after 8 PM show lower completion rates. Consider shifting them to afternoon slots.",
  "I see you're feeling overwhelmed. That's completely normal with exams approaching. Let me help restructure: prioritize by deadline, batch similar tasks together, and don't forget to schedule recovery time.",
];

export function getMockChatResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes('overwhelm') || lower.includes('stress') || lower.includes('anxious')) {
    return MOCK_CHAT_RESPONSES[4];
  }
  if (lower.includes('schedule') || lower.includes('plan') || lower.includes('when')) {
    return MOCK_CHAT_RESPONSES[0];
  }
  if (lower.includes('priority') || lower.includes('important') || lower.includes('urgent')) {
    return MOCK_CHAT_RESPONSES[1];
  }
  if (lower.includes('progress') || lower.includes('how am i') || lower.includes('doing')) {
    return MOCK_CHAT_RESPONSES[2];
  }
  // Random fallback
  return MOCK_CHAT_RESPONSES[Math.floor(Math.random() * MOCK_CHAT_RESPONSES.length)];
}
