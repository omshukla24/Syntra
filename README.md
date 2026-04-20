# ⚡️ Syntra

> **From Thought to System:** An AI-powered productivity platform that transforms messy human thoughts into structured, actionable systems.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)

Syntra is a state-of-the-art productivity hub designed to intelligently sort, prioritize, and structure your daily chaos. Utilizing modern web features and on-device storage, Syntra gives you full control over your data with zero lock-in and zero compromises.

## ✨ Key Features

### 🎯 Core Productivity Hub
- **Dynamic Dashboard:** Real-time stats, active tasks, and system overview at a glance.
- **Task Manager:** Full CRUD capabilities with advanced category and priority filtering.
- **Weekly Planner:** 7-day interactive calendar grid with color-coded time blocking.
- **Focus Mode:** Pomodoro-style timer with integrated task selection and session logging.
- **Progress Analytics:** Beautiful visual charts tracking completion rates, streaks, and focus metrics.

### 🧠 AI-Powered by Gemini 2.5 Flash
- **Replan My Life:** Brain-dump your chaos—Syntra automatically structures it into actionable tasks and a precise schedule.
- **AI Chat:** An context-aware productivity assistant with full conversation history.
- **Voice AI:** Natural speech-to-text interaction paired with text-to-speech responses for hands-free productivity.

### 🛡️ Ironclad Data Privacy
- **100% Client-Side Storage:** All your data safely resides within your browser's local storage.
- **BYOK (Bring-Your-Own-Key):** Use your personal Gemini API key. It's stored securely and *only* in your browser.
- **Zero Cloud Database:** No external databases. No telemetry. Your data is yours.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/omshukla24/Sybtra.git
   cd Sybtra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env.local` file in the root directory and add your key (optional, can also be configured via UI):
   ```bash
   echo "GEMINI_API_KEY=your_key_here" > .env.local
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ☁️ Deployment

Syntra is optimized for deployment on Google Cloud App Engine.

```bash
# Build and deploy directly to GCP
npm run deploy
```

## 🏗️ Project Architecture

### System Architecture Diagram

```mermaid
graph TB
    subgraph "🗣️ User Interface & Experience (Next.js 16)"
      direction TB
      subgraph "Layout & Global"
        Layout["App Layout<br/>app/layout.tsx"] 
        Sidebar["Navigation Sidebar<br/>components/Sidebar.tsx"]
        Glow["Cursor Glow FX<br/>components/CursorGlow.tsx"]
        Modal["API Key Modal<br/>components/ApiKeyModal.tsx"]
        Layout --- Sidebar
        Layout --- Glow
        Layout --- Modal
      end
      
      subgraph "Core Productivity Modules"
        Dash["Dashboard<br/>app/page.tsx"]
        Tasks["Task Manager<br/>app/tasks/page.tsx"]
        Plan["Weekly Planner<br/>app/plan/page.tsx"]
        Focus["Focus Timer<br/>app/focus/page.tsx"]
        Progress["Analytics<br/>app/progress/page.tsx"]
      end
      
      subgraph "AI Interaction Modules"
        ReplanUI["Replan My Life<br/>app/replan/page.tsx"]
        ChatUI["AI Chat<br/>app/chat/page.tsx"]
        VoiceUI["Voice Assistant<br/>app/voice/page.tsx"]
      end
    end

    subgraph "💾 Client-Side Data & Security Layer"
      direction TB
      StorageCore["Local Storage Wrapper<br/>lib/storage.ts"]
      Types["Type Definitions<br/>lib/types.ts"]
      BYOK["API Key Manager (BYOK)"]
      Mock["Mock Data Fallback<br/>lib/mock-data.ts"]
    end

    subgraph "⚙️ API Layer (Next.js Route Handlers)"
      direction TB
      ApiReplan["Replan Endpoint<br/>api/replan/route.ts"]
      ApiChat["Chat Endpoint<br/>api/chat/route.ts"]
      ApiVoice["Voice Endpoint<br/>api/voice/route.ts"]
      GeminiLib["Gemini Client Configuration<br/>lib/gemini.ts"]
      
      ApiReplan --> GeminiLib
      ApiChat --> GeminiLib
      ApiVoice --> GeminiLib
    end

    subgraph "☁️ External Cloud Services"
      direction TB
      GeminiAPI["Google Gemini 2.5 Flash API"]
      GCP["Google Cloud App Engine<br/>Deployment Target"]
    end

    %% Relationships
    Modal -->|Saves Key| BYOK
    BYOK -->|Injects Key| StorageCore
    StorageCore -->|Persists Data| Tasks
    StorageCore -->|Persists Data| Plan
    StorageCore -->|Reads Data| Progress
    StorageCore -.->|Uses| Types

    ReplanUI ==>|HTTP POST w/ Key| ApiReplan
    ChatUI ==>|HTTP POST w/ Key| ApiChat
    VoiceUI ==>|HTTP POST w/ Key| ApiVoice

    GeminiLib ==>|SDK Calls| GeminiAPI
    
    ApiReplan -.->|Returns Actionable Plan| ReplanUI
    ApiChat -.->|Returns Chat Response| ChatUI
    ApiVoice -.->|Returns Transcribed Voice| VoiceUI
    
    ReplanUI -.->|Saves New Tasks| StorageCore

    %% Styling
    classDef ui fill:#1e293b,stroke:#475569,stroke-width:1px,color:#f8fafc
    classDef data fill:#064e3b,stroke:#047857,stroke-width:1px,color:#ecfdf5
    classDef api fill:#4c1d95,stroke:#6d28d9,stroke-width:1px,color:#f5f3ff
    classDef ext fill:#7c2d12,stroke:#b45309,stroke-width:1px,color:#fff7ed
    
    class Layout,Sidebar,Glow,Modal,Dash,Tasks,Plan,Focus,Progress,ReplanUI,ChatUI,VoiceUI ui
    class StorageCore,Types,BYOK,Mock data
    class ApiReplan,ApiChat,ApiVoice,GeminiLib api
    class GeminiAPI,GCP ext
```

### Directory Structure

```plaintext
app/
├── api/              # Route handlers for AI, Chat, and Voice
├── chat/             # AI Assistant interface
├── focus/            # Deep-work Pomodoro timer
├── plan/             # Weekly blocking and scheduling
├── progress/         # Analytics and charts
├── replan/           # Chaos-to-system AI tool
├── settings/         # BYOK management
├── tasks/            # Core task management
└── voice/            # Voice-first AI interaction
components/           # Reusable UI elements, modals, and layouts
lib/                  # Core utilities (Gemini client, local storage wrapper, types)
```

## 🛠️ Built With

- **[Next.js](https://nextjs.org/)** — React Framework
- **[Google Gemini](https://ai.google.dev/)** — AI Model powering insights
- **[Google Cloud App Engine](https://cloud.google.com/appengine)** — Deployment target
- **[Framer Motion](https://www.framer.com/motion/)** — Fluid UI animations
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling

---

<p align="center">
  <b>Syntra</b> — Handcrafted to turn your thoughts into an unbreakable system.
</p>
