# IBADIFY — Master Implementation Blueprint
### Mission Control Document for Antigravity AI Agents
> **Status:** Active | **Version:** 1.0 | **Director:** Project Owner
> This document is the single source of truth. Agents must read it in full before executing any task.

---

## TABLE OF CONTENTS
1. [Architecture Overview](#1-architecture-overview)
2. [Design System Philosophy](#2-design-system-philosophy)
3. [Database Schema — Firestore](#3-database-schema--firestore)
4. [Agent Directives](#4-agent-directives-agentsrules)
5. [Feature Specification](#5-feature-specification)
6. [Adaptive UI/UX Spec](#6-adaptive-uiux-spec)
7. [PWA & SEO Specification](#7-pwa--seo-specification)
8. [tasks.md — Sequential Agent Checklist](#8-tasksmd--sequential-agent-checklist)

---

## 1. ARCHITECTURE OVERVIEW

### 1.1 System Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                         IBADIFY SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌──────────────┐    CI/CD     ┌──────────────┐               │
│   │    GitHub    │─────────────▶│    Vercel    │               │
│   │   (Source)   │              │  (Hosting)   │               │
│   └──────────────┘              └──────┬───────┘               │
│                                        │                        │
│              ┌─────────────────────────▼──────────────────┐    │
│              │           NEXT.JS APP (App Router)          │    │
│              │                                             │    │
│              │  ┌──────────────┐   ┌──────────────────┐   │    │
│              │  │  Public Pages│   │  Protected App   │   │    │
│              │  │  (SSR/SEO)   │   │  (Client Shell)  │   │    │
│              │  │  /landing    │   │  /dashboard      │   │    │
│              │  │  /about      │   │  /tracker        │   │    │
│              │  │  /privacy    │   │  /review         │   │    │
│              │  └──────────────┘   └──────────────────┘   │    │
│              │                                             │    │
│              │  ┌─────────────────────────────────────┐   │    │
│              │  │        Service Worker (PWA)         │   │    │
│              │  │  Offline Cache | Push Notifications │   │    │
│              │  └─────────────────────────────────────┘   │    │
│              └────────────────────────┬────────────────────┘    │
│                                       │                         │
│              ┌────────────────────────▼────────────────────┐    │
│              │              FIREBASE BACKEND               │    │
│              │                                             │    │
│              │  ┌──────────────┐   ┌──────────────────┐   │    │
│              │  │ Firebase Auth│   │    Firestore DB   │   │    │
│              │  │ Google/Email │   │  (Collections)   │   │    │
│              │  └──────────────┘   └──────────────────┘   │    │
│              │                                             │    │
│              │  ┌──────────────────────────────────────┐  │    │
│              │  │     Firebase Cloud Messaging (FCM)   │  │    │
│              │  │     (Web Push Notifications)         │  │    │
│              │  └──────────────────────────────────────┘  │    │
│              └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Next.js App Router Structure

```
ibadify/
├── app/
│   ├── (public)/                   # Public routes — SSR for SEO
│   │   ├── page.tsx                # Landing page
│   │   ├── about/page.tsx
│   │   └── privacy/page.tsx
│   ├── (app)/                      # Protected app shell
│   │   ├── layout.tsx              # Auth guard + adaptive layout wrapper
│   │   ├── dashboard/page.tsx      # Home overview
│   │   ├── tracker/page.tsx        # Daily tracker
│   │   ├── review/page.tsx         # Nightly review wizard
│   │   ├── qaza/page.tsx           # Qaza prayer manager
│   │   ├── history/page.tsx        # Calendar history view
│   │   ├── insights/page.tsx       # Streak analytics (desktop-rich)
│   │   └── settings/page.tsx       # User preferences & notifications
│   ├── api/
│   │   └── push/route.ts           # Push notification trigger endpoint
│   ├── layout.tsx                  # Root layout (fonts, metadata, PWA head)
│   └── globals.css
├── components/
│   ├── adaptive/                   # Layout-aware wrappers
│   │   ├── AppShell.tsx            # Renders MobileShell or DesktopShell
│   │   ├── MobileShell.tsx         # Bottom nav + swipe-area
│   │   └── DesktopShell.tsx        # Sidebar + main content area
│   ├── tracker/                    # Salah, Quran, Zikr tracking widgets
│   ├── review/                     # Nightly Review wizard steps
│   ├── ui/                         # Design system primitives (from DESIGN.md)
│   └── pwa/                        # Install prompt, notification consent
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── messaging.ts
│   ├── hooks/
│   │   ├── useAdaptive.ts          # useMediaQuery hook for responsive logic
│   │   ├── useStreak.ts
│   │   └── useNightlyReview.ts
│   └── utils/
│       ├── timezone.ts             # Home timezone streak logic
│       └── prayerTimes.ts          # Salah time calculations (Adhan.js)
├── public/
│   ├── manifest.json
│   ├── sw.js                       # Service worker (built by next-pwa)
│   └── icons/                      # PWA icon set
├── .agents/
│   └── rules/
│       ├── GLOBAL.md
│       ├── FIREBASE.md
│       └── UI.md
├── DESIGN.md                       # Generated by Stitch MCP (Phase 2)
├── tasks.md                        # This checklist (agents track progress here)
└── next.config.ts
```

### 1.3 Rendering Strategy

| Route | Strategy | Reason |
|---|---|---|
| `/` (Landing) | SSR + ISR (24h) | SEO, social sharing |
| `/about`, `/privacy` | Static Generation | Rarely changes |
| `/dashboard` | Client-side (auth-gated) | Real-time Firestore |
| `/tracker` | Client-side | Live updates, offline-first |
| `/review` | Client-side | Wizard state machine |
| `/api/push` | Edge Function | Low latency notification delivery |

---

## 2. DESIGN SYSTEM PHILOSOPHY

> **Vibe:** "Sacred Minimalism" — The UI should feel like a clean journal or a quiet prayer room. No noise. No gamification gimmicks. Just calm intentionality.

### 2.1 Aesthetic Direction (Stitch MCP Prompt Guide)

When agents invoke Stitch MCP, use these as the design brief inputs:

- **Mood:** Serene, focused, contemplative. Think: cream paper, soft morning light, ink.
- **Color Palette:** Warm off-whites and creams as primary surfaces. A single muted jewel-tone accent (dusty teal `#4A7C6F` or faded indigo `#5C6BC0`). Charcoal for text, never pure black.
- **Typography:** A refined serif for headings (e.g., `Lora` or `Playfair Display`). A clean humanist sans-serif for body (e.g., `DM Sans` or `Nunito`). Never Inter, Roboto, or system-ui defaults.
- **Spacing:** Generous. 8pt baseline grid. Sections breathe. Cards are borderless or have hairline borders, no heavy shadows.
- **Iconography:** Thin-line icons only (Phosphor Icons or Lucide). No filled/chunky icons.
- **Motion:** Subtle. Fade-ins, gentle slides (200-300ms). Prayer completion: a soft pulse glow, not a confetti explosion.

### 2.2 Improvised Features (Architect's Additions)

The following features are recommended beyond the core spec and should be included:

1. **"Quiet Hours" Mode** — A setting that dims the UI to a dark warm sepia theme after Isha prayer automatically, prompting the Nightly Review.
2. **Streak Grace Period** — If a user misses logging before midnight in their *home timezone*, they get a 2-hour grace window (until 2 AM) before the streak breaks.
3. **Barakah Score™** — A private, internal metric (0–100) computed from completeness of daily acts. Never shown as a number; instead reflected as a subtle background gradient warmth (cooler on low days, warmer on high days). This is the "invisible motivator."
4. **Whisper Notifications** — Push notification copy uses gentle, non-guilt-inducing language: *"Your evening reflection awaits"* rather than *"You haven't logged today!"*
5. **Qaza Debt Payoff Planner** — In the Qaza section, users enter their estimated missed prayers; the app generates a gentle daily payoff schedule.
6. **Anonymous Streak Leaderboard** — Opt-in only. Shows only rank and initials. No public profiles.
7. **Dua Corner** — A static, curated section of short duas relevant to each tracked act (shown as a gentle tooltip/card on completion).
8. **Reflection Journal** — One optional free-text field in the Nightly Review for a private note. Stored encrypted client-side (never sent to server as plaintext).

---

## 3. DATABASE SCHEMA — FIRESTORE

### 3.1 Collection Structure

```
firestore-root/
├── users/{userId}
├── dailyLogs/{userId}/logs/{dateString}          # YYYY-MM-DD in home TZ
├── qazaDebt/{userId}
├── streaks/{userId}
├── habits/{userId}/customHabits/{habitId}
└── notifications/{userId}
```

### 3.2 Document Schemas

#### `users/{userId}`
```typescript
{
  uid: string;                          // Firebase Auth UID
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  homeTimezone: string;                 // IANA TZ string, e.g. "Asia/Karachi"
  madhab: "hanafi" | "shafi" | "maliki" | "hanbali";  // Affects Asr time calc
  prayerCalcMethod: string;             // e.g. "MWL", "ISNA", "Karachi"
  barakahScore: number;                 // 0-100, recomputed daily
  streakGraceEnabled: boolean;          // 2hr grace window toggle
  quietHoursEnabled: boolean;
  onboardingComplete: boolean;
  notificationToken?: string;           // FCM token
  notificationTime?: string;            // HH:mm, e.g. "21:30"
  lastActiveDate: string;               // YYYY-MM-DD for streak checks
}
```

#### `dailyLogs/{userId}/logs/{dateString}`
```typescript
{
  date: string;                         // YYYY-MM-DD (in homeTimezone)
  userId: string;
  
  // Salah Tracking
  salah: {
    fajr:   { fard: boolean; sunnah: boolean; nafl: boolean };
    dhuhr:  { fard: boolean; sunnah: boolean; nafl: boolean };
    asr:    { fard: boolean; sunnah: boolean; nafl: boolean };
    maghrib:{ fard: boolean; sunnah: boolean; nafl: boolean };
    isha:   { fard: boolean; sunnah: boolean; nafl: boolean; witr: boolean };
    tahajjud: boolean;
    ishraq: boolean;
    chasht: boolean;
  };
  
  // Quran
  quran: {
    pages: number;                      // Pages read today
    ayahs: number;                      // Optional granularity
    targetMet: boolean;                 // vs user's daily target
  };
  
  // Zikr
  zikr: {
    morningAzkar: boolean;
    eveningAzkar: boolean;
    tasbihCount: number;                // SubhanAllah/Alhamdulillah/Allahu Akbar
    duroodCount: number;
    customZikr?: { label: string; count: number }[];
  };
  
  // Nightly Review
  nightlyReview: {
    completed: boolean;
    completedAt?: Timestamp;
    characterDeeds: {                   // User reflects on their day
      wasPatient: boolean | null;
      wasGenerous: boolean | null;
      avoidedGhiba: boolean | null;     // Avoided backbiting
      wasKindToFamily: boolean | null;
      customDeeds?: { label: string; done: boolean }[];
    };
    reflection?: string;               // Encrypted client-side before storage
    moodRating: 1 | 2 | 3 | 4 | 5;   // 1=difficult, 5=spiritually elevated
  };
  
  // Custom Habits
  customHabitsLog: {
    [habitId: string]: boolean | number;
  };
  
  // Computed Fields
  completionScore: number;             // 0-100, Barakah Score for this day
  isComplete: boolean;                 // All fard prayers done
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `qazaDebt/{userId}`
```typescript
{
  userId: string;
  estimatedDebt: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
    witr: number;
  };
  paidOff: {                           // Incremented as user makes up prayers
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
    witr: number;
  };
  dailyPayoffTarget: number;           // Auto-calculated or user-set
  payoffStartDate: string;
  estimatedCompletionDate: string;     // Re-calculated on each update
  updatedAt: Timestamp;
}
```

#### `streaks/{userId}`
```typescript
{
  userId: string;
  currentStreak: number;              // Days
  longestStreak: number;
  lastLogDate: string;                // YYYY-MM-DD (homeTimezone)
  streakType: "fard_only" | "full";   // What counts: fard prayers OR everything
  graceUsedToday: boolean;
  streakHistory: {                    // Lightweight; full history in dailyLogs
    [month: string]: number;          // "2025-06": 28 (days completed)
  };
  updatedAt: Timestamp;
}
```

#### `habits/{userId}/customHabits/{habitId}`
```typescript
{
  habitId: string;
  label: string;                       // e.g., "Morning walk", "Sadaqah"
  type: "boolean" | "count";
  countTarget?: number;                // If type === "count"
  category: "ibadah" | "health" | "character" | "learning" | "other";
  icon?: string;                       // Phosphor icon name
  active: boolean;
  createdAt: Timestamp;
}
```

#### `notifications/{userId}`
```typescript
{
  userId: string;
  token: string;                       // FCM token
  enabled: boolean;
  nightlyReminderTime: string;         // HH:mm
  prayerReminders: {
    fajr: boolean;
    dhuhr: boolean;
    asr: boolean;
    maghrib: boolean;
    isha: boolean;
  };
  timezone: string;
  updatedAt: Timestamp;
}
```

### 3.3 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Daily logs — user-scoped subcollection
    match /dailyLogs/{userId}/logs/{logId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Qaza debt — private
    match /qazaDebt/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Streaks — private
    match /streaks/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Custom habits
    match /habits/{userId}/customHabits/{habitId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Notifications config
    match /notifications/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 4. AGENT DIRECTIVES (`.agents/rules/`)

### 4.1 `GLOBAL.md` — Universal Agent Rules

```markdown
# GLOBAL AGENT RULES — IBADIFY

## Identity
You are an Antigravity AI Agent building the Ibadify application.
Always refer to IBADIFY_BLUEPRINT.md and tasks.md as your source of truth.
Mark tasks complete in tasks.md as you finish them.

## Code Style
- Language: TypeScript everywhere. No `.js` files in /app or /components.
- Formatting: Prettier with single quotes, 2-space indent, 100-char line width.
- Linting: ESLint with Next.js recommended config.
- Naming: PascalCase for components, camelCase for functions/vars, SCREAMING_SNAKE for constants.
- No `any` types. Use proper interfaces. Keep types in `/types/` or co-located.
- Components must be small and single-responsibility. Max 150 lines per file.
- Extract all Firestore queries into `/lib/firebase/firestore.ts`. No inline Firestore calls in components.
- All user-facing strings must be stored in `/lib/copy.ts` for easy future i18n.

## Error Handling
- All Firebase calls wrapped in try/catch. Surface errors via a global toast system.
- Never expose Firebase error codes to users. Map to friendly messages in `/lib/errors.ts`.

## Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Commit after each completed task phase checkpoint.

## Do NOT
- Do not hardcode Firebase config values. Use environment variables.
- Do not use `useEffect` for data fetching. Use React Query or SWR.
- Do not install unnecessary packages. Check if a utility already exists in the codebase.
- Do not write CSS in `style={{}}`. Use Tailwind classes exclusively.
- Do not skip Firestore security rules. They are mandatory before any write operation.
```

### 4.2 `FIREBASE.md` — Firebase Agent Directives

```markdown
# FIREBASE AGENT DIRECTIVES — IBADIFY

## Setup Requirement
FIRST ACTION: Run the following to bootstrap Firebase capabilities:
  npx skills add firebase/agent-skills

This command configures:
  - Firebase project linking via .firebaserc
  - Environment variable injection for NEXT_PUBLIC_FIREBASE_* keys
  - Firestore emulator configuration for local development
  - Firebase Admin SDK setup for server-side operations (push notifications API route)

## Authentication
- Enable providers: Email/Password + Google Sign-In in Firebase Console.
- Auth state managed via a React Context (`/lib/firebase/auth.ts`) wrapping `onAuthStateChanged`.
- Use `getServerSession` equivalent pattern: server components check auth via Firebase Admin SDK.
- On first login, create the `users/{uid}` document with default values and `onboardingComplete: false`.

## Firestore
- Always use the typed Firestore helpers. Define a generic `getDoc<T>` wrapper.
- Subcollection path for daily logs: `dailyLogs/{userId}/logs/{YYYY-MM-DD}`.
- Date strings MUST be calculated in the user's `homeTimezone` (from their profile), not UTC.
- Use `serverTimestamp()` for all `createdAt` / `updatedAt` fields.
- Implement optimistic UI updates: update local state immediately, then Firestore in background.
- Set up Firestore composite indexes for: (userId + date range queries on dailyLogs).

## Cloud Messaging (FCM)
- Request notification permission ONLY after user explicitly opts in on the Settings page.
- Store FCM token in `notifications/{userId}` document on permission grant.
- Token refresh: implement `onMessage` handler in service worker to refresh tokens.
- The `/api/push/route.ts` Edge Function uses Firebase Admin SDK to send messages.
  - It validates the request is from an authenticated user before sending.
  - Payload structure: `{ title: string, body: string, data: { url: string } }`

## Environment Variables Required
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  NEXT_PUBLIC_FIREBASE_APP_ID
  NEXT_PUBLIC_FIREBASE_VAPID_KEY
  FIREBASE_ADMIN_PRIVATE_KEY          # Server-only
  FIREBASE_ADMIN_CLIENT_EMAIL         # Server-only
```

### 4.3 `UI.md` — UI/UX Agent Directives

```markdown
# UI AGENT DIRECTIVES — IBADIFY

## MANDATORY FIRST STEP: Stitch MCP Design Extraction
Before writing a single React component, you MUST:

1. Invoke Stitch MCP with the following prompt:
   "Generate a minimalistic, sacred-minimalism UI design system for a spiritual habit tracking
    app called Ibadify. The vibe is: serene, contemplative, like a clean journal in morning light.
    Color palette: warm cream surfaces (#FAF8F5), dusty teal accent (#4A7C6F), charcoal text
    (#2D2D2D), soft warm border (#E8E3DC). Typography: Lora for headings, DM Sans for body.
    Design the following screens: Dashboard overview, Daily tracker card, Nightly review wizard
    step, Settings page. Apply generous whitespace, thin-line icons (Lucide), hairline card
    borders. No gradients on interactive elements. Subtle box-shadow only."

2. Extract from Stitch MCP output:
   - Color tokens (hex values for all palette entries)
   - Typography scale (font sizes, weights, line heights)
   - Spacing scale
   - Component patterns (cards, buttons, checkboxes, progress indicators)
   - Any generated SVG assets or icons

3. Save all extracted design tokens and component specs to `/DESIGN.md`.
   This file becomes the UI source of truth. All subsequent component development references DESIGN.md.

## Tailwind Configuration
After DESIGN.md is created, extend `tailwind.config.ts` with custom tokens:
  - colors.cream, colors.teal-dust, colors.charcoal, etc.
  - fontFamily.display (Lora), fontFamily.body (DM Sans)
  - Custom spacing scale if needed

## Adaptive Layout Rules
- Use the `useAdaptive()` hook to get `isMobile: boolean`.
- Mobile breakpoint: < 768px (md in Tailwind).
- The `AppShell` component renders either `MobileShell` or `DesktopShell` based on this hook.
- NEVER use CSS display:none to hide desktop nav on mobile. Use conditional rendering.

### Mobile Interface Rules:
  - Bottom navigation bar: 5 items max (Dashboard, Tracker, Review, Qaza, Profile)
  - Nightly Review must be a full-screen swipeable wizard (use `react-swipeable`)
  - All tap targets: minimum 44x44px
  - Cards are full-width with rounded-2xl corners
  - No hover states on primary interactive elements (touch-first)

### Desktop Interface Rules:
  - Persistent left sidebar: 240px wide, collapsible to 64px (icon-only mode)
  - Main content: max-width 1200px, centered
  - Multi-column dashboard: 3-column grid (tracker | insights | qaza planner)
  - Nightly Review: modal dialog (not full-screen takeover)
  - All data tables sortable
  - Keyboard navigation support (tab, enter, escape)

## Animation Standards
- Page transitions: `opacity 0→1` + `translateY 8px→0`, duration 200ms, ease-out
- Prayer checkbox completion: soft pulse glow (scale 1→1.05→1, 300ms)
- Streak milestone: confetti is FORBIDDEN. Use a single warm golden shimmer on the streak badge.
- Skeleton loaders for all async data (not spinners)
- Respect `prefers-reduced-motion` media query — disable all animations if set

## Accessibility
- All interactive elements must have `aria-label`
- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Focus rings: visible, using the teal accent color
- Screen reader announcements for prayer completion actions
```

---

## 5. FEATURE SPECIFICATION

### 5.1 Core Features

#### F1: Prayer Tracker (Daily Tracker Page)
- **Display:** 5 Fard prayers in a vertical list, each with expandable sub-row for Sunnah/Nafl
- **Interaction:** Single tap to mark Fard complete. Expand icon for Sunnah/Nafl breakdown
- **State:** Persists optimistically to Firestore. Works offline (cached)
- **Visual Feedback:** Completed prayers get a subtle teal checkmark + line-through on label
- **Tahajjud/Ishraq/Chasht:** Separate "Nawafil" section below main 5 prayers

#### F2: Quran Tracker
- **Input:** Numeric page counter. Tap `+` to increment by 1, or type a number
- **Daily target:** Set in settings (default: 2 pages). Progress shown as a thin arc/ring
- **Weekly summary:** Sparkline chart of pages per day (desktop sidebar widget)

#### F3: Zikr Counter
- **Morning Azkar & Evening Azkar:** Boolean checkboxes
- **Tasbih counter:** Large tap area with count display. Haptic feedback on mobile (via `navigator.vibrate`)
- **Durood counter:** Same as Tasbih
- **Custom Zikr:** User-defined entries with label + count target

#### F4: Nightly Review (Wizard)
- **Step 1 — Salah Summary:** Auto-populated from today's log. User confirms or adjusts
- **Step 2 — Character Deeds:** 4 default boolean questions + up to 5 custom ones
- **Step 3 — Mood Rating:** 5-point scale using subtle icons (no emojis — use Phosphor moon phases)
- **Step 4 — Reflection Journal:** Optional free text. Client-side encryption before storage
- **Completion:** Soft animation. Barakah score updated. No fanfare — a single Arabic phrase appears: "جزاكم الله خيرًا" (May Allah reward you with goodness)

#### F5: Qaza Manager
- **Debt Input:** Onboarding flow asks for estimated missed prayers per type
- **Payoff Planner:** Generates schedule (e.g., "2 extra Fajr per day for 45 days")
- **Daily Qaza Log:** User marks which makeup prayers they completed today
- **Progress visualization:** Thin progress bars per prayer type

#### F6: Streak Engine
- **Home Timezone Logic:** All date calculations use `homeTimezone` from user profile
- **Grace Period:** 2-hour post-midnight window before streak breaks
- **Streak Types:** User chooses between "Fard prayers only" or "Full daily log"
- **Milestone Badges:** Private. At 7, 30, 100 days. Shown in profile only
- **Travel Mode:** User can toggle "I'm traveling" — uses device timezone temporarily

### 5.2 Supplementary Features

#### F7: Insights (Desktop-Rich)
- Calendar heatmap (GitHub-style, warm cream→teal color scale)
- Streak history chart
- Prayer completion rate per prayer (last 30 days)
- Best and worst days

#### F8: Settings
- Home timezone selector (searchable dropdown)
- Nightly review notification time picker
- Prayer reminder toggles per Salah
- Daily Quran page target
- Madhab/calculation method (affects prayer time display)
- Quiet Hours toggle
- Data export (JSON of all logs)
- Account deletion (with Firestore cleanup)

#### F9: Onboarding Flow (First-time users)
- Step 1: Welcome + value proposition (3 slides, skippable)
- Step 2: Set Home Timezone
- Step 3: Set Madhab preference
- Step 4: Qaza debt estimation (skippable)
- Step 5: Enable notifications (opt-in prompt)
- Step 6: Set Quran daily target
- After: `onboardingComplete = true` in Firestore

---

## 6. ADAPTIVE UI/UX SPEC

### 6.1 Mobile Layout Wireframe

```
┌────────────────────────────┐
│ [Status Bar]               │
│                            │
│  Good morning, Abdullah    │
│  Tuesday · 13 Dhul-Hijjah  │  ← Arabic & Gregorian date
│                            │
│ ┌────────────────────────┐ │
│ │  🔥 12-day streak      │ │  ← Streak badge (warm shimmer)
│ └────────────────────────┘ │
│                            │
│ ┌────────────────────────┐ │
│ │  PRAYER TRACKER        │ │
│ │  ● Fajr      ✓         │ │
│ │  ○ Dhuhr               │ │
│ │  ○ Asr                 │ │
│ │  ○ Maghrib             │ │
│ │  ○ Isha                │ │
│ └────────────────────────┘ │
│                            │
│ ┌──────────┐ ┌──────────┐ │
│ │  Quran   │ │   Zikr   │ │  ← 2-column widget row
│ │  3 / 5 pg│ │  ◐ done  │ │
│ └──────────┘ └──────────┘ │
│                            │
│ ════════════════════════   │
│ 🏠  📿  🌙  📖  👤       │  ← Bottom Nav
└────────────────────────────┘
```

### 6.2 Desktop Layout Wireframe

```
┌──────────────────────────────────────────────────────────────────┐
│ [SIDEBAR 240px] │ [MAIN CONTENT - 3 columns]                     │
│                 │                                                 │
│ Ibadify         │ Good morning, Abdullah ─────── Streak: 🔥 12  │
│ ─────────       │ Tuesday · 13 Dhul-Hijjah                       │
│ Dashboard       │                                                 │
│ Tracker    ←●   │ ┌─PRAYERS──────┐ ┌─QURAN+ZIKR──┐ ┌─INSIGHTS─┐│
│ Review          │ │ Fajr    ✓    │ │ Pages: 3/5  │ │ Heatmap  ││
│ Qaza            │ │ Dhuhr   ○    │ │ ▓▓▓░░░░░░  │ │          ││
│ History         │ │ Asr     ○    │ ├─────────────┤ │ M T W T F││
│ Insights        │ │ Maghrib ○    │ │ Morning Azk ✓│ │ ● ● ○ ● ●││
│ ─────────       │ │ Isha    ○    │ │ Evening Azk ○│ │          ││
│ Settings        │ │              │ │ Tasbih: 33  │ └──────────┘│
│                 │ │ Nawafil ▾    │ │ Durood:  11 │             │
│ [User Avatar]   │ └──────────────┘ └─────────────┘             │
│ Abdullah        │                                                 │
│                 │ [Nightly Review Button — if after Isha time]   │
└─────────────────┴─────────────────────────────────────────────────┘
```

---

## 7. PWA & SEO SPECIFICATION

### 7.1 PWA Configuration

**Package:** `next-pwa` (maintained fork: `@ducanh2912/next-pwa`)

**`next.config.ts` setup:**
```typescript
import withPWA from "@ducanh2912/next-pwa";

const nextConfig = withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
})({
  // your normal Next.js config
});

export default nextConfig;
```

**`public/manifest.json`:**
```json
{
  "name": "Ibadify — Daily Spiritual Tracker",
  "short_name": "Ibadify",
  "description": "Track your prayers, Quran reading, Zikr, and character growth daily.",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#FAF8F5",
  "theme_color": "#4A7C6F",
  "categories": ["lifestyle", "health", "religion"],
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96", "type": "image/png" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128", "type": "image/png" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144", "type": "image/png" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ],
  "screenshots": [
    {
      "src": "/screenshots/mobile-dashboard.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

**Service Worker FCM Integration:**
- Import Firebase Messaging in `sw.js` using `importScripts` with the Firebase compat CDN
- Handle `push` events to display notifications with proper icon and badge
- Handle `notificationclick` to open the app at the relevant URL

### 7.2 SEO Configuration

**Root `app/layout.tsx` metadata:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://ibadify.app"),
  title: {
    default: "Ibadify — Daily Spiritual Companion",
    template: "%s | Ibadify",
  },
  description: "A minimalist daily tracker for prayers, Quran reading, Zikr, and character growth. Build lifelong spiritual discipline.",
  keywords: ["prayer tracker", "salah tracker", "Muslim habit tracker", "Quran tracker", "Islamic app", "ibadah"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ibadify.app",
    siteName: "Ibadify",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  themeColor: "#4A7C6F",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ibadify",
  },
};
```

---

## 8. `tasks.md` — SEQUENTIAL AGENT CHECKLIST

> **Instructions for Agents:** Work through this list sequentially. Do not skip phases. Mark items `[x]` as you complete them. If you cannot complete a task, mark it `[!]` and add a note explaining why. Commit after each Phase checkpoint.

---

### ✅ PHASE 0 — Repository Bootstrap

- [ ] **P0-01** · Verify Node.js >= 20.x is installed (`node --version`)
- [ ] **P0-02** · Initialize Next.js project: `npx create-next-app@latest ibadify --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*"`
- [ ] **P0-03** · Confirm directory structure matches §1.2 of blueprint. Create all placeholder directories.
- [ ] **P0-04** · Create `.env.local` with all Firebase env variable keys (values blank — to be filled by Firebase setup step)
- [ ] **P0-05** · Create `.env.example` mirroring `.env.local` (safe to commit)
- [ ] **P0-06** · Configure Prettier: install `prettier` dev dep, create `.prettierrc` with `{ "singleQuote": true, "printWidth": 100 }`
- [ ] **P0-07** · Create `/DESIGN.md` as an empty file with header placeholder
- [ ] **P0-08** · Create `/tasks.md` (this file — already exists if reading this)
- [ ] **P0-09** · Create `/.agents/rules/GLOBAL.md`, `/.agents/rules/FIREBASE.md`, `/.agents/rules/UI.md` with content from §4 of blueprint
- [ ] **P0-10** · Initial commit: `chore: initialize ibadify next.js project`
- [ ] **⬛ CHECKPOINT P0** · Repository is initialized, all placeholder files in place

---

### ✅ PHASE 1 — Firebase Skills Setup

- [ ] **P1-01** · Run: `npx skills add firebase/agent-skills`
- [ ] **P1-02** · Verify Firebase project linked correctly (`.firebaserc` present)
- [ ] **P1-03** · Populate `.env.local` with Firebase config values from Firebase Console (Web App settings)
- [ ] **P1-04** · Enable Email/Password and Google authentication in Firebase Console
- [ ] **P1-05** · Enable Firestore in Firebase Console (start in production mode)
- [ ] **P1-06** · Enable Firebase Cloud Messaging in Firebase Console. Generate VAPID key. Add to `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
- [ ] **P1-07** · Deploy Firestore security rules from §3.3: `firebase deploy --only firestore:rules`
- [ ] **P1-08** · Create Firestore composite indexes (userId + date range on `dailyLogs`): `firebase deploy --only firestore:indexes`
- [ ] **P1-09** · Create `/lib/firebase/config.ts` — initialize Firebase app using env vars
- [ ] **P1-10** · Create `/lib/firebase/auth.ts` — export `signInWithGoogle()`, `signInWithEmail()`, `signOut()`, `useAuthState()` hook
- [ ] **P1-11** · Create `/lib/firebase/firestore.ts` — export typed helpers: `getDoc<T>`, `setDoc<T>`, `updateDoc<T>`, `getDailyLog()`, `upsertDailyLog()`
- [ ] **P1-12** · Create `/lib/firebase/messaging.ts` — export `requestNotificationPermission()`, `getFCMToken()`, `onMessageListener()`
- [ ] **P1-13** · Set up Firebase Admin SDK for server-side use in `/lib/firebase/admin.ts`
- [ ] **P1-14** · Test Firebase connection: write a test document to Firestore from local dev, verify it appears in console
- [ ] **⬛ CHECKPOINT P1** · Firebase fully configured, rules deployed, typed helpers in place. Commit: `feat: firebase setup and typed helpers`

---

### ✅ PHASE 2 — Stitch MCP Design Extraction

- [ ] **P2-01** · Read `/.agents/rules/UI.md` § "MANDATORY FIRST STEP: Stitch MCP Design Extraction"
- [ ] **P2-02** · Invoke Stitch MCP with the exact prompt specified in UI.md
- [ ] **P2-03** · Extract color palette tokens from Stitch output → document in `DESIGN.md` under `## Colors`
- [ ] **P2-04** · Extract typography specifications → document in `DESIGN.md` under `## Typography`
- [ ] **P2-05** · Extract spacing scale → document in `DESIGN.md` under `## Spacing`
- [ ] **P2-06** · Extract component patterns (Card, Button, Checkbox, Progress) → document in `DESIGN.md` under `## Components`
- [ ] **P2-07** · Document any SVG icons or assets generated → `DESIGN.md` under `## Assets`
- [ ] **P2-08** · Update `tailwind.config.ts` with custom tokens from DESIGN.md:
  - Custom color entries (cream, teal-dust, charcoal, warm-border)
  - Custom font families (display: Lora, body: DM Sans)
- [ ] **P2-09** · Add Google Fonts import to `/app/layout.tsx` for Lora and DM Sans (use `next/font/google`)
- [ ] **P2-10** · Create `/app/globals.css` with CSS custom properties matching DESIGN.md tokens
- [ ] **P2-11** · Create a simple `/app/design-preview/page.tsx` (dev-only) rendering all design tokens as a reference page — verify visually in browser
- [ ] **⬛ CHECKPOINT P2** · DESIGN.md complete, Tailwind configured, fonts loading. Commit: `docs: design system from stitch mcp + tailwind tokens`

---

### ✅ PHASE 3 — Authentication & User Model

- [ ] **P3-01** · Create `/app/(auth)/login/page.tsx` — minimal login page (Google + Email). Must match DESIGN.md aesthetic.
- [ ] **P3-02** · Create `/app/(auth)/signup/page.tsx` — email signup form
- [ ] **P3-03** · Create `AuthProvider` context in `/lib/context/AuthContext.tsx` wrapping `onAuthStateChanged`
- [ ] **P3-04** · Create route guard middleware in `/middleware.ts` — redirect unauthenticated users from `/dashboard*` routes to `/login`
- [ ] **P3-05** · Implement new user initialization: on first login/signup, create `users/{uid}` document with all default values from §3.2 schema
- [ ] **P3-06** · Add `homeTimezone` auto-detection on signup: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- [ ] **P3-07** · Create `/app/(app)/layout.tsx` — auth-protected layout with `AuthProvider`. Renders `AppShell`.
- [ ] **P3-08** · Create `/lib/hooks/useAuthState.ts` — returns `{ user, loading, error }`
- [ ] **P3-09** · Test: sign up with email → verify user document created in Firestore → verify redirect to `/dashboard`
- [ ] **P3-10** · Test: sign in with Google → same verification
- [ ] **P3-11** · Test: unauthenticated access to `/dashboard` → verify redirect to `/login`
- [ ] **⬛ CHECKPOINT P3** · Auth fully functional, user docs created on signup. Commit: `feat: firebase auth and user initialization`

---

### ✅ PHASE 4 — Adaptive Layout System

- [ ] **P4-01** · Create `/lib/hooks/useAdaptive.ts` — returns `{ isMobile: boolean }` using `useMediaQuery` at 768px breakpoint (SSR-safe: default to `false` until mount)
- [ ] **P4-02** · Create `/components/adaptive/AppShell.tsx` — conditionally renders `MobileShell` or `DesktopShell` based on `isMobile`
- [ ] **P4-03** · Create `/components/adaptive/MobileShell.tsx`:
  - `children` render area (full height minus bottom nav)
  - `BottomNav` with 5 icons: Home, Tracker, Review, Qaza, Profile
  - `BottomNav` uses Phosphor icons, active state with teal-dust color
- [ ] **P4-04** · Create `/components/adaptive/DesktopShell.tsx`:
  - Left sidebar 240px (collapsible to 64px icon mode)
  - Sidebar contains: logo, nav items, user avatar at bottom
  - Main content area with max-w-7xl centering
- [ ] **P4-05** · Implement sidebar collapse toggle with smooth CSS transition (width 240→64px, 250ms ease)
- [ ] **P4-06** · Create placeholder pages for all routes in §1.2: dashboard, tracker, review, qaza, history, insights, settings
- [ ] **P4-07** · Verify adaptive layout renders correctly at 375px (mobile) and 1440px (desktop) using browser DevTools
- [ ] **P4-08** · Implement page transition animation (opacity + translateY) via a `PageTransition` wrapper component
- [ ] **⬛ CHECKPOINT P4** · Adaptive shell renders correctly, navigation works. Commit: `feat: adaptive layout system mobile and desktop`

---

### ✅ PHASE 5 — Core Feature Implementation

#### 5A — Dashboard

- [ ] **P5-01** · Create `/components/dashboard/GreetingHeader.tsx` — displays time-aware greeting, Gregorian + Hijri date
- [ ] **P5-02** · Add Hijri date calculation using `hijri-date` or `luxon` + custom offset. Display in Arabic numerals.
- [ ] **P5-03** · Create `/components/dashboard/StreakBadge.tsx` — shows current streak with warm shimmer CSS animation on milestone days
- [ ] **P5-04** · Create `/components/dashboard/QuickStats.tsx` — mini cards for today's Quran pages and Zikr completion
- [ ] **P5-05** · Wire dashboard to Firestore: fetch today's `dailyLog` document on mount using SWR
- [ ] **P5-06** · Implement Barakah Score background tint: compute score → apply dynamic `background-color` CSS variable to page root (cool→warm gradient, invisible to user as a metric)

#### 5B — Prayer Tracker

- [ ] **P5-07** · Create `/components/tracker/PrayerList.tsx` — vertical list of 5 prayers
- [ ] **P5-08** · Create `/components/tracker/PrayerRow.tsx` — single prayer item with:
  - Fard checkbox (single tap)
  - Expand chevron to show Sunnah/Nafl sub-row
  - Completion animation: teal pulse glow (CSS keyframes)
- [ ] **P5-09** · Create `/components/tracker/NawafilSection.tsx` — Tahajjud, Ishraq, Chasht checkboxes below main list
- [ ] **P5-10** · Implement optimistic update: mark prayer → update local state immediately → Firestore write in background
- [ ] **P5-11** · Offline support: if Firestore write fails (no network), queue update and retry on reconnect. Show a subtle "Saved offline" indicator.

#### 5C — Quran Tracker

- [ ] **P5-12** · Create `/components/tracker/QuranTracker.tsx` — page counter with `+` / `-` buttons and direct input
- [ ] **P5-13** · Add circular progress ring (SVG) showing today's pages vs daily target
- [ ] **P5-14** · Wire to `dailyLog.quran` in Firestore with debounced writes (500ms debounce)

#### 5D — Zikr Tracker

- [ ] **P5-15** · Create `/components/tracker/ZikirTracker.tsx` — Morning/Evening Azkar checkboxes + counter for Tasbih and Durood
- [ ] **P5-16** · Large tap-area counter button with haptic feedback: `navigator.vibrate(10)` on each tap (mobile)
- [ ] **P5-17** · Add Dua Corner: on Azkar checkbox completion, show a contextually relevant dua as a slide-up tooltip (content from `/lib/copy.ts`)

#### 5E — Nightly Review Wizard

- [ ] **P5-18** · Create `/components/review/ReviewWizard.tsx` — state machine managing 4 steps
- [ ] **P5-19** · Mobile: full-screen overlay with swipe-to-advance gesture (`react-swipeable`)
- [ ] **P5-20** · Desktop: modal dialog (Radix UI `Dialog` component styled with DESIGN.md tokens)
- [ ] **P5-21** · Step 1 — Salah Summary: auto-fill from today's log, allow corrections
- [ ] **P5-22** · Step 2 — Character Deeds: render boolean cards for each deed
- [ ] **P5-23** · Step 3 — Mood Rating: 5 moon-phase icons (Phosphor), tap to select
- [ ] **P5-24** · Step 4 — Reflection: `<textarea>` with character limit (500). Implement client-side encryption using `crypto.subtle` (AES-GCM, key derived from user's UID). Store encrypted ciphertext only.
- [ ] **P5-25** · On completion: save to `dailyLog.nightlyReview`, recompute `completionScore`, update `streaks` document. Show completion state with Arabic phrase.

#### 5F — Qaza Manager

- [ ] **P5-26** · Create `/components/qaza/QazaDebtForm.tsx` — numerical inputs for each prayer type
- [ ] **P5-27** · Create `/components/qaza/PayoffPlanner.tsx` — reads `qazaDebt` doc, renders schedule with estimated completion date
- [ ] **P5-28** · Create `/components/qaza/DailyQazaLog.tsx` — daily checkboxes for makeup prayers (stored in `dailyLog`)
- [ ] **P5-29** · On Qaza log update: decrement `qazaDebt.estimatedDebt` and increment `qazaDebt.paidOff`
- [ ] **P5-30** · Add progress bars per prayer type with label: "X of Y remaining"

#### 5G — Streak Engine

- [ ] **P5-31** · Create `/lib/utils/timezone.ts` — helper: `getTodayStringInTimezone(tz: string): string` returning YYYY-MM-DD
- [ ] **P5-32** · Create `/lib/hooks/useStreak.ts` — fetches `streaks/{userId}`, computes `isActiveToday`
- [ ] **P5-33** · Implement streak check logic in a server-side Cloud Function (or API route):
  - On daily log update: compare `lastLogDate` to today in homeTimezone
  - If consecutive: `currentStreak++`
  - If grace period (< 2am and yesterday not logged): allow update, set `graceUsedToday: true`
  - If broken: reset `currentStreak = 1`
- [ ] **P5-34** · Implement milestone detection: at 7, 30, 100 days — update a `milestones` array in `streaks` document
- [ ] **P5-35** · Create `/components/dashboard/StreakMilestoneCard.tsx` — appears only on milestone days, shows private achievement

- [ ] **⬛ CHECKPOINT P5** · All core features functional. End-to-end test: log all prayers + complete nightly review → verify Firestore updated correctly → verify streak increments. Commit: `feat: core tracking features complete`

---

### ✅ PHASE 6 — PWA, Notifications & Offline

- [ ] **P6-01** · Install `@ducanh2912/next-pwa`: `npm install @ducanh2912/next-pwa`
- [ ] **P6-02** · Configure `next.config.ts` with PWA wrapper as specified in §7.1
- [ ] **P6-03** · Create `public/manifest.json` with content from §7.1
- [ ] **P6-04** · Generate all PWA icons (72px to 512px). Use a script or tool. Place in `public/icons/`.
- [ ] **P6-05** · Add FCM service worker integration in `public/firebase-messaging-sw.js` (importScripts Firebase compat CDN, handle push events)
- [ ] **P6-06** · Register `firebase-messaging-sw.js` in `/lib/firebase/messaging.ts`
- [ ] **P6-07** · Create `/components/pwa/InstallPrompt.tsx` — listens for `beforeinstallprompt` event. Shows an unobtrusive install banner (bottom of screen, dismissible) after 3 days of usage.
- [ ] **P6-08** · Create `/app/api/push/route.ts` (Edge Function):
  - Validates auth token in request header
  - Uses Firebase Admin SDK to send FCM notification to user's token
  - Payload: `{ title, body, data: { url } }`
- [ ] **P6-09** · Create `/app/settings/page.tsx` notification section:
  - Toggle to enable/disable nightly reminder
  - Time picker for reminder time
  - On enable: call `requestNotificationPermission()` → save token to `notifications/{userId}`
- [ ] **P6-10** · Implement notification scheduling: use a Vercel Cron Job (`vercel.json`) that runs every 5 minutes, queries Firestore for users whose notification time matches current UTC time (converted from their homeTimezone), and calls `/api/push`
- [ ] **P6-11** · Test offline mode: enable airplane mode → attempt to log a prayer → verify it queues → re-enable network → verify sync
- [ ] **P6-12** · Test push notification end-to-end: set notification time to 2 minutes from now → verify notification arrives on device
- [ ] **P6-13** · Verify PWA installability using Chrome DevTools Lighthouse PWA audit (target score: 100)
- [ ] **⬛ CHECKPOINT P6** · PWA installable, notifications working, offline sync functional. Commit: `feat: pwa setup, push notifications, offline caching`

---

### ✅ PHASE 7 — Onboarding Flow

- [ ] **P7-01** · Create `/app/(app)/onboarding/page.tsx` — multi-step wizard
- [ ] **P7-02** · Step 1: Welcome slides (3 screens, skip button). Use `Framer Motion` for slide transitions.
- [ ] **P7-03** · Step 2: Timezone selector — searchable dropdown of IANA timezones. Pre-fill with detected timezone.
- [ ] **P7-04** · Step 3: Madhab selector — 4 option cards with brief explanation of Asr prayer timing difference
- [ ] **P7-05** · Step 4: Qaza debt estimation form (skippable with "I'll do this later")
- [ ] **P7-06** · Step 5: Notification opt-in with explanation of "Whisper Notifications" tone
- [ ] **P7-07** · Step 6: Quran daily page target selector (default: 2 pages)
- [ ] **P7-08** · On completion: set `onboardingComplete: true` in Firestore → redirect to `/dashboard`
- [ ] **P7-09** · Add route guard: if `onboardingComplete === false`, redirect to `/onboarding` before any other app page
- [ ] **⬛ CHECKPOINT P7** · Onboarding complete. New user test: sign up → go through onboarding → land on dashboard. Commit: `feat: onboarding wizard`

---

### ✅ PHASE 8 — Insights, History & Supplementary Pages

- [ ] **P8-01** · Create `/app/(app)/history/page.tsx` — calendar heatmap view
- [ ] **P8-02** · Build `CalendarHeatmap` component: 12-month grid, cell color from `completionScore` (0-100 → cream to teal)
- [ ] **P8-03** · On cell click: show day summary drawer/modal
- [ ] **P8-04** · Create `/app/(app)/insights/page.tsx` — desktop-rich analytics
- [ ] **P8-05** · Implement prayer completion rate bars (last 30 days per prayer)
- [ ] **P8-06** · Implement Quran reading sparkline chart (recharts or visx)
- [ ] **P8-07** · Implement streak history line chart
- [ ] **P8-08** · Create `/app/(app)/settings/page.tsx` — full settings implementation:
  - Timezone selector
  - Notification settings
  - Quran target
  - Madhab/calculation method
  - Quiet Hours toggle
  - Data export (JSON download)
  - Account deletion (with confirmation dialog + Firestore cleanup)
- [ ] **P8-09** · Implement data export: query all `dailyLogs` for user → compile to JSON → trigger browser download
- [ ] **P8-10** · Implement account deletion: delete all Firestore documents for user → delete Auth account → redirect to landing
- [ ] **⬛ CHECKPOINT P8** · All pages implemented. Commit: `feat: insights, history, settings complete`

---

### ✅ PHASE 9 — Public Pages & SEO

- [ ] **P9-01** · Create `/app/(public)/page.tsx` — landing page (SSR). Must include:
  - Hero: headline, subheadline, "Get Started" CTA → `/signup`
  - Feature highlights (3 cards: Prayers, Quran, Nightly Review)
  - Testimonials placeholder section
  - Footer with links
- [ ] **P9-02** · Apply DESIGN.md aesthetic to landing page (can be slightly more expressive than app interior)
- [ ] **P9-03** · Create `/app/(public)/about/page.tsx`
- [ ] **P9-04** · Create `/app/(public)/privacy/page.tsx` — privacy policy
- [ ] **P9-05** · Add all metadata to root `app/layout.tsx` as specified in §7.2
- [ ] **P9-06** · Add page-level metadata overrides for landing, about, privacy
- [ ] **P9-07** · Create `public/og-image.png` (1200×630px) — branded Open Graph image
- [ ] **P9-08** · Create `app/robots.txt/route.ts` — allow all public pages, disallow `/dashboard*`, `/api/*`
- [ ] **P9-09** · Create `app/sitemap.ts` — include public pages with correct `changeFrequency` and `priority`
- [ ] **P9-10** · Add `<link rel="canonical">` tags to public pages
- [ ] **P9-11** · Run Lighthouse SEO audit → target score: 100. Fix any issues.
- [ ] **⬛ CHECKPOINT P9** · Public pages live, SEO perfect. Commit: `feat: public pages, seo, metadata`

---

### ✅ PHASE 10 — QA, Performance & Launch Prep

- [ ] **P10-01** · Run Lighthouse audit on all key pages. Targets: Performance ≥ 90, Accessibility ≥ 95, SEO = 100, PWA = 100.
- [ ] **P10-02** · Fix any Lighthouse accessibility failures (color contrast, missing aria-labels, etc.)
- [ ] **P10-03** · Test on physical mobile device (iOS Safari + Android Chrome) — verify all interactions, PWA install, push notifications
- [ ] **P10-04** · Test Firestore security rules using Firebase Emulator Suite — attempt unauthorized reads/writes, verify all are rejected
- [ ] **P10-05** · Test streak grace period: simulate logging at 1:30 AM (within grace), verify streak preserved
- [ ] **P10-06** · Test Travel Mode: toggle on → verify timezone changes temporarily → verify streak unaffected
- [ ] **P10-07** · Test offline → online sync for prayer logging
- [ ] **P10-08** · Verify `prefers-reduced-motion` disables all animations
- [ ] **P10-09** · Bundle size audit: `next build` → check `.next/analyze` — ensure no unnecessary packages. Use `@next/bundle-analyzer`.
- [ ] **P10-10** · Add `loading.tsx` skeleton screens for all app routes
- [ ] **P10-11** · Add `error.tsx` and `not-found.tsx` pages (styled with DESIGN.md)
- [ ] **P10-12** · Review all Firestore queries — add missing indexes if any query fails
- [ ] **P10-13** · Set Firestore and FCM production configuration (not emulator) in Vercel environment variables
- [ ] **P10-14** · Deploy to Vercel: `git push origin main` → verify Vercel CI/CD triggers → verify production build passes
- [ ] **P10-15** · Smoke test production: sign up → full onboarding → log all prayers → complete nightly review → verify streak → receive push notification
- [ ] **⬛ CHECKPOINT P10 — LAUNCH READY** · All audits pass, production deployed, smoke test successful. Commit: `chore: production ready v1.0`

---

## APPENDIX A — Package Reference

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "firebase": "^11.0.0",
    "firebase-admin": "^13.0.0",
    "@ducanh2912/next-pwa": "^10.0.0",
    "swr": "^2.0.0",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-checkbox": "latest",
    "react-swipeable": "^7.0.0",
    "framer-motion": "^12.0.0",
    "adhan": "^4.4.3",
    "recharts": "^2.0.0",
    "phosphor-react": "^1.4.1",
    "luxon": "^3.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0",
    "@next/bundle-analyzer": "latest"
  }
}
```

## APPENDIX B — Environment Variables Checklist

| Variable | Required In | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client + Server | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client + Server | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | FCM Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Firebase App ID |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Client | FCM VAPID Key for web push |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Server only | Admin SDK private key (newlines escaped) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Server only | Admin SDK client email |

---

*Document Version 1.0 — Generated by Anthropic Claude (Claude Sonnet 4.6) on behalf of the Project Director. Last updated: 2026-05-12. All agents must treat this as immutable spec unless the Project Director issues a revision.*
