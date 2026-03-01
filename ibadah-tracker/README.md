# 🕌 Ibadah Tracker

> A private, reflective web app to track your daily acts of worship (ibadah).

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

---

## 📖 Project Overview

Ibadah Tracker helps Muslims track their daily acts of worship with a focus on **self-improvement**, **consistency**, and **private reflection** — not social comparison.

---

## ✅ Build Log

### Session 1 — 2026-02-22

- ✅ Read & analyzed requirements document (`Ibadah Tracher Req Document.docx`)
- ✅ Scaffolded Next.js 16 project with TypeScript + Tailwind CSS
- ✅ Installed dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `date-fns`, `recharts`, `lucide-react`, `zustand`
- ✅ Set execution policy for npm scripts (`RemoteSigned`)

### Session 2 — 2026-03-01

- ✅ Set up Supabase project (`awvkpeleskqomidxxuev`, region: `ap-south-1`)
- ✅ Applied initial database migration with full schema:
  - `profiles` (auto-created on Google OAuth)
  - `ibadah_logs` (daily tracking: prayers, quran, zikr, character, good deeds)
  - `custom_ibadah` + `custom_ibadah_logs`
  - `streaks` + `badges`
  - Row Level Security enabled on all tables
  - Auto-profile trigger on user signup
  - Performance indexes
- ✅ Built Supabase client/server/middleware helpers
- ✅ Built Next.js middleware for session management & route protection
- ✅ Built all TypeScript types and constants

### Pages Built

| Page           | Route                 | Status                                                                     |
| -------------- | --------------------- | -------------------------------------------------------------------------- |
| Landing Page   | `/`                   | ✅ Stars background, hero, feature grid                                    |
| Login          | `/auth/login`         | ✅ Google OAuth                                                            |
| OAuth Callback | `/auth/callback`      | ✅                                                                         |
| Dashboard      | `/dashboard`          | ✅ Prayer status, stats, weekly bars, badges                               |
| Daily Log      | `/dashboard/log`      | ✅ Full log form (prayers, quran, zikr, character, good deeds, reflection) |
| Progress       | `/dashboard/progress` | ✅ Line chart, bar chart, heatmap (recharts)                               |
| Badges         | `/dashboard/badges`   | ✅ Earned/locked badge grid                                                |
| Settings       | `/dashboard/settings` | ✅ Profile edit, sign out                                                  |

### Components Built

- ✅ `Sidebar` — responsive with mobile hamburger, active routes, user avatar
- ✅ `DashboardClient` — overview stats, 7-day prayer visualization
- ✅ `LogClient` — prayer cycle tap (3-state), count incrementers, toggles
- ✅ `ProgressClient` — recharts line/bar charts + heatmap grid
- ✅ `SettingsClient` — profile editing

### Design System

- ✅ Dark theme (`#0f172a` background)
- ✅ Glassmorphism cards with `backdrop-filter: blur`
- ✅ Gradient text (indigo/purple)
- ✅ Micro-animations (fadeIn, slideIn, pulse-glow)
- ✅ Prayer status visual states (done, jamāʿah, empty)

---

## 🛠️ Tech Stack

| Layer              | Technology                   |
| ------------------ | ---------------------------- |
| Frontend Framework | Next.js 16 (App Router)      |
| Language           | TypeScript                   |
| Styling            | Tailwind CSS v4 + Custom CSS |
| Backend            | Supabase (PostgreSQL)        |
| Authentication     | Google OAuth via Supabase    |
| Charts             | Recharts                     |
| Date handling      | date-fns                     |
| Deployment         | Vercel (recommended)         |

---

## 🗄️ Database Schema

```
auth.users (Supabase managed)
├── profiles (auto-created on signup)
├── ibadah_logs (daily ibadah tracking)
├── custom_ibadah (user-defined items)
├── custom_ibadah_logs
├── streaks
└── badges
```

All tables have **Row Level Security (RLS)** — users can only access their own data.

---

## 🚀 Running Locally

```bash
cd "ibadah-tracker"
npm run dev
# → http://localhost:3000
```

## 🌐 Deploying to Vercel

```bash
npx vercel --prod
```

Add environment variables in Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then in Supabase → Authentication → URL Configuration:

- Site URL: your Vercel URL
- Redirect URL: `https://your-app.vercel.app/auth/callback`

---

## 📅 Next Steps (Planned)

- [ ] Vercel deployment + Supabase redirect URL config
- [ ] Custom ibadah tracking UI
- [ ] Streak calculation logic (cron/edge function)
- [ ] Push notification reminders
- [ ] Ramadan special mode
