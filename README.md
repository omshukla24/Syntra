# Syntra — From Thought to System

> AI-powered productivity platform that transforms messy human thoughts into structured, actionable systems.

## Features

### Core Productivity
- **Dashboard** — Real-time stats, active tasks, system overview
- **Task Manager** — Full CRUD with category/priority filtering
- **Weekly Plan** — 7-day calendar grid with color-coded time blocks
- **Focus Mode** — Pomodoro-style timer with task selection and session logging
- **Progress Analytics** — Completion rates, streak tracking, focus charts

### AI-Powered (Gemini 2.5 Flash)
- **Replan My Life** — Brain-dump your chaos → Syntra structures it into tasks + schedule
- **AI Chat** — Productivity assistant with conversation history
- **Voice AI** — Speech-to-text interaction with text-to-speech responses

### Data Privacy
- **100% Client-Side Storage** — All data in browser localStorage
- **BYOK (Bring-Your-Own-Key)** — Enter your own API key, stored only in your browser
- **Zero Cloud Database** — No external data storage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, TypeScript) |
| AI | Google Gemini 2.5 Flash via `@google/genai` |
| Styling | CSS Modules + Custom Design System |
| Storage | Browser localStorage |
| Deployment | Google Cloud App Engine |

## Getting Started

```bash
# Install dependencies
npm install

# Set API key
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to GCP

```bash
npm run deploy
```

## Project Structure

```
app/
├── page.tsx                # Dashboard
├── tasks/page.tsx          # Task Manager
├── plan/page.tsx           # Weekly Plan
├── focus/page.tsx          # Focus Mode
├── progress/page.tsx       # Progress Analytics
├── replan/page.tsx         # AI Replan
├── chat/page.tsx           # AI Chat
├── voice/page.tsx          # Voice AI
├── settings/page.tsx       # API Key Management
├── api/replan/route.ts     # Replan API
├── api/chat/route.ts       # Chat API
└── api/voice/route.ts      # Voice API
components/
├── Sidebar.tsx             # Navigation
├── CursorGlow.tsx          # Cursor-reactive effects
└── ApiKeyModal.tsx         # BYOK popup
lib/
├── types.ts                # TypeScript interfaces
├── storage.ts              # localStorage wrapper
├── mock-data.ts            # Testing fallback data
└── gemini.ts               # Gemini client + prompts
```

## Built With

- [Next.js](https://nextjs.org/) — React Framework
- [Google Gemini](https://ai.google.dev/) — AI/ML
- [Google Cloud App Engine](https://cloud.google.com/appengine) — Hosting

---

**Syntra** — From thought to system.
