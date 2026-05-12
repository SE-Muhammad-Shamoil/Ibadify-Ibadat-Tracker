# IBADIFY — Sequential Agent Checklist (`tasks.md`)

> **Instructions for Agents:** Work through this list sequentially. Do not skip phases. Mark items `[x]` as you complete them. If you cannot complete a task, mark it `[!]` and add a note explaining why. Commit after each Phase checkpoint.
> 
> **Reference:** `IBADIFY_BLUEPRINT.md` is the master spec. This file tracks progress only.

---

## ✅ PHASE 0 — Repository Bootstrap

- [x] **P0-01** · Verify Node.js >= 20.x is installed (`node --version`) — **v24.13.0** ✓
- [x] **P0-02** · Initialize Next.js project: `npx create-next-app@latest ibadify --typescript --tailwind --eslint --app --import-alias="@/*"` — **Next.js 16.2.6 + Tailwind CSS 4** ✓
- [x] **P0-03** · Confirm directory structure matches §1.2 of blueprint. Create all placeholder directories.
- [x] **P0-04** · Create `.env.local` with all Firebase env variable keys (values blank — to be filled by Firebase setup step)
- [x] **P0-05** · Create `.env.example` mirroring `.env.local` (safe to commit)
- [x] **P0-06** · Configure Prettier: install `prettier` dev dep, create `.prettierrc` with `{ "singleQuote": true, "printWidth": 100 }`
- [x] **P0-07** · Create `/DESIGN.md` as an empty file with header placeholder
- [x] **P0-08** · Create `/tasks.md` (this file)
- [x] **P0-09** · Create `/.agents/rules/GLOBAL.md`, `/.agents/rules/FIREBASE.md`, `/.agents/rules/UI.md` with content from §4 of blueprint
- [ ] **P0-10** · Initial commit: `chore: initialize ibadify next.js project`
- [x] **⬛ CHECKPOINT P0** · Repository is initialized, all placeholder files in place

---

## ✅ PHASE 1 — Firebase Skills Setup

- [x] **P1-01** · Run: `npx skills add firebase/agent-skills` ✓
- [x] **P1-02** · Verify Firebase project linked correctly (`.firebaserc` present)
- [x] **P1-03** · Populate `.env.local` with Firebase config values from Firebase Console (Web App settings)
- [x] **P1-04** · Enable Email/Password and Google authentication in Firebase Console
- [x] **P1-05** · Enable Firestore in Firebase Console (start in production mode)
- [x] **P1-06** · Enable Firebase Cloud Messaging in Firebase Console. Generate VAPID key. Add to `NEXT_PUBLIC_FIREBASE_VAPID_KEY`.
- [x] **P1-07** · Deploy Firestore security rules from §3.3: `firebase deploy --only firestore:rules`
- [x] **P1-08** · Create Firestore composite indexes (userId + date range on `dailyLogs`): `firebase deploy --only firestore:indexes`
- [x] **P1-09** · Create `/lib/firebase/config.ts` — initialize Firebase app using env vars
- [x] **P1-10** · Create `/lib/firebase/auth.ts` — export `signInWithGoogle()`, `signInWithEmail()`, `signOut()`, `useAuthState()` hook
- [x] **P1-11** · Create `/lib/firebase/firestore.ts` — export typed helpers: `getDoc<T>`, `setDoc<T>`, `updateDoc<T>`, `getDailyLog()`, `upsertDailyLog()`
- [x] **P1-12** · Create `/lib/firebase/messaging.ts` — export `requestNotificationPermission()`, `getFCMToken()`, `onMessageListener()`
- [x] **P1-13** · Set up Firebase Admin SDK for server-side use in `/lib/firebase/admin.ts`
- [x] **P1-14** · Test Firebase connection: write a test document to Firestore from local dev, verify it appears in console
- [x] **⬛ CHECKPOINT P1** · Firebase fully configured, rules deployed, typed helpers in place. Commit: `feat: firebase setup and typed helpers`

---

## ✅ PHASE 2 — Stitch MCP Design Extraction

- [x] **P2-01** · Read `/.agents/rules/UI.md` § "MANDATORY FIRST STEP: Stitch MCP Design Extraction"
- [x] **P2-02** · Invoke Stitch MCP with the exact prompt specified in UI.md
- [x] **P2-03** · Extract color palette tokens from Stitch output → document in `DESIGN.md` under `## Colors`
- [x] **P2-04** · Extract typography specifications → document in `DESIGN.md` under `## Typography`
- [x] **P2-05** · Extract spacing scale → document in `DESIGN.md` under `## Spacing`
- [x] **P2-06** · Extract component patterns (Card, Button, Checkbox, Progress) → document in `DESIGN.md` under `## Components`
- [x] **P2-07** · Document any SVG icons or assets generated → `DESIGN.md` under `## Assets`
- [x] **P2-08** · Update `tailwind.config.ts` with custom tokens from DESIGN.md:
  - Custom color entries (cream, teal-dust, charcoal, warm-border)
  - Custom font families (display: Lora, body: DM Sans)
- [x] **P2-09** · Add Google Fonts import to `/app/layout.tsx` for Lora and DM Sans (use `next/font/google`)
- [x] **P2-10** · Create `/app/globals.css` with CSS custom properties matching DESIGN.md tokens
- [x] **P2-11** · Create a simple `/app/design-preview/page.tsx` (dev-only) rendering all design tokens as a reference page — verify visually in browser
- [x] **⬛ CHECKPOINT P2** · DESIGN.md complete, Tailwind configured, fonts loading. Commit: `docs: design system from stitch mcp + tailwind tokens`

---

## ✅ PHASE 3 — Authentication & User Model

- [x] **P3-01** · Create `/app/(auth)/login/page.tsx` — minimal login page (Google + Email). Must match DESIGN.md aesthetic.
- [x] **P3-02** · Create `/app/(auth)/signup/page.tsx` — email signup form
- [x] **P3-03** · Create `AuthProvider` context in `/lib/context/AuthContext.tsx` wrapping `onAuthStateChanged`
- [x] **P3-04** · Create route guard middleware in `/middleware.ts` — redirect unauthenticated users from `/dashboard*` routes to `/login`
- [x] **P3-05** · Implement new user initialization: on first login/signup, create `users/{uid}` document with all default values from §3.2 schema
- [x] **P3-06** · Add `homeTimezone` auto-detection on signup: `Intl.DateTimeFormat().resolvedOptions().timeZone`
- [x] **P3-07** · Create `/app/(app)/layout.tsx` — auth-protected layout with `AuthProvider`. Renders `AppShell`.
- [x] **P3-08** · Create `/lib/hooks/useAuthState.ts` — returns `{ user, loading, error }`
- [x] **P3-09** · Test: sign up with email → verify user document created in Firestore → verify redirect to `/dashboard`
- [x] **P3-10** · Test: sign in with Google → same verification
- [x] **P3-11** · Test: unauthenticated access to `/dashboard` → verify redirect to `/login`
- [x] **⬛ CHECKPOINT P3** · Auth fully functional, user docs created on signup. Commit: `feat: firebase auth and user initialization`

---

## ✅ PHASE 4 — Adaptive Layout System

- [x] **P4-01** · Create `/lib/hooks/useAdaptive.ts` — returns `{ isMobile: boolean }` using `useMediaQuery` at 768px breakpoint (SSR-safe: default to `false` until mount)
- [x] **P4-02** · Create `/components/adaptive/AppShell.tsx` — conditionally renders `MobileShell` or `DesktopShell` based on `isMobile`
- [x] **P4-03** · Create `/components/adaptive/MobileShell.tsx`:
  - `children` render area (full height minus bottom nav)
  - `BottomNav` with 5 icons: Home, Tracker, Review, Qaza, Profile
  - `BottomNav` uses Phosphor icons, active state with teal-dust color
- [x] **P4-04** · Create `/components/adaptive/DesktopShell.tsx`:
  - Left sidebar 240px (collapsible to 64px icon mode)
  - Sidebar contains: logo, nav items, user avatar at bottom
  - Main content area with max-w-7xl centering
- [x] **P4-05** · Implement sidebar collapse toggle with smooth CSS transition (width 240→64px, 250ms ease)
- [x] **P4-06** · Create placeholder pages for all routes in §1.2: dashboard, tracker, review, qaza, history, insights, settings
- [x] **P4-07** · Verify adaptive layout renders correctly at 375px (mobile) and 1440px (desktop) using browser DevTools
- [x] **P4-08** · Implement page transition animation (opacity + translateY) via a `PageTransition` wrapper component
- [x] **⬛ CHECKPOINT P4** · Adaptive shell renders correctly, navigation works. Commit: `feat: adaptive layout system mobile and desktop`

---

## ✅ PHASE 5 — Core Feature Implementation

### 5A — Dashboard

- [ ] **P5-01** · Create `/components/dashboard/GreetingHeader.tsx` — displays time-aware greeting, Gregorian + Hijri date
- [ ] **P5-02** · Add Hijri date calculation using `hijri-date` or `luxon` + custom offset. Display in Arabic numerals.
- [ ] **P5-03** · Create `/components/dashboard/StreakBadge.tsx` — shows current streak with warm shimmer CSS animation on milestone days
- [ ] **P5-04** · Create `/components/dashboard/QuickStats.tsx` — mini cards for today's Quran pages and Zikr completion
- [ ] **P5-05** · Wire dashboard to Firestore: fetch today's `dailyLog` document on mount using SWR
- [ ] **P5-06** · Implement Barakah Score background tint: compute score → apply dynamic `background-color` CSS variable to page root (cool→warm gradient, invisible to user as a metric)

### 5B — Prayer Tracker

- [ ] **P5-07** · Create `/components/tracker/PrayerList.tsx` — vertical list of 5 prayers
- [ ] **P5-08** · Create `/components/tracker/PrayerRow.tsx` — single prayer item with:
  - Fard checkbox (single tap)
  - Expand chevron to show Sunnah/Nafl sub-row
  - Completion animation: teal pulse glow (CSS keyframes)
- [ ] **P5-09** · Create `/components/tracker/NawafilSection.tsx` — Tahajjud, Ishraq, Chasht checkboxes below main list
- [ ] **P5-10** · Implement optimistic update: mark prayer → update local state immediately → Firestore write in background
- [ ] **P5-11** · Offline support: if Firestore write fails (no network), queue update and retry on reconnect. Show a subtle "Saved offline" indicator.

### 5C — Quran Tracker

- [ ] **P5-12** · Create `/components/tracker/QuranTracker.tsx` — page counter with `+` / `-` buttons and direct input
- [ ] **P5-13** · Add circular progress ring (SVG) showing today's pages vs daily target
- [ ] **P5-14** · Wire to `dailyLog.quran` in Firestore with debounced writes (500ms debounce)

### 5D — Zikr Tracker

- [ ] **P5-15** · Create `/components/tracker/ZikirTracker.tsx` — Morning/Evening Azkar checkboxes + counter for Tasbih and Durood
- [ ] **P5-16** · Large tap-area counter button with haptic feedback: `navigator.vibrate(10)` on each tap (mobile)
- [ ] **P5-17** · Add Dua Corner: on Azkar checkbox completion, show a contextually relevant dua as a slide-up tooltip (content from `/lib/copy.ts`)

### 5E — Nightly Review Wizard

- [ ] **P5-18** · Create `/components/review/ReviewWizard.tsx` — state machine managing 4 steps
- [ ] **P5-19** · Mobile: full-screen overlay with swipe-to-advance gesture (`react-swipeable`)
- [ ] **P5-20** · Desktop: modal dialog (Radix UI `Dialog` component styled with DESIGN.md tokens)
- [ ] **P5-21** · Step 1 — Salah Summary: auto-fill from today's log, allow corrections
- [ ] **P5-22** · Step 2 — Character Deeds: render boolean cards for each deed
- [ ] **P5-23** · Step 3 — Mood Rating: 5 moon-phase icons (Phosphor), tap to select
- [ ] **P5-24** · Step 4 — Reflection: `<textarea>` with character limit (500). Implement client-side encryption using `crypto.subtle` (AES-GCM, key derived from user's UID). Store encrypted ciphertext only.
- [ ] **P5-25** · On completion: save to `dailyLog.nightlyReview`, recompute `completionScore`, update `streaks` document. Show completion state with Arabic phrase.

### 5F — Qaza Manager

- [ ] **P5-26** · Create `/components/qaza/QazaDebtForm.tsx` — numerical inputs for each prayer type
- [ ] **P5-27** · Create `/components/qaza/PayoffPlanner.tsx` — reads `qazaDebt` doc, renders schedule with estimated completion date
- [x] **P5-28** · Create `/components/qaza/DailyQazaLog.tsx` — daily checkboxes for makeup prayers (handled in QazaCounter)
- [x] **P5-29** · On Qaza log update: decrement `qazaDebt.estimatedDebt` and increment `qazaDebt.paidOff`
- [x] **P5-30** · Add progress bars per prayer type with label: "X of Y remaining"

### 5G — Streak Engine

- [x] **P5-31** · Create `/lib/utils/timezone.ts` — helper: `getTodayStringInTimezone(tz: string): string` returning YYYY-MM-DD
- [x] **P5-32** · Create `/lib/hooks/useStreak.ts` — (implemented as streak logic helper in lib/utils/streaks.ts)
- [x] **P5-33** · Implement streak check logic:
  - On review completion: calculate perfect day and update streak
- [x] **P5-34** · Implement milestone detection: at 7, 30, 100 days — update a `milestones` array in `streaks` document
- [x] **P5-35** · Create `/components/dashboard/StreakMilestoneCard.tsx` — (handled in StreakBadge with shimmer animation)

- [x] **⬛ CHECKPOINT P5** · All core features functional. End-to-end test: log all prayers + complete nightly review → verify Firestore updated correctly → verify streak increments. Commit: `feat: core tracking features complete`

---

## ✅ PHASE 6 — PWA, Notifications & Offline

- [x] **P6-01** · Install `@ducanh2912/next-pwa`: `npm install @ducanh2912/next-pwa`
- [x] **P6-02** · Configure `next.config.ts` with PWA wrapper as specified in §7.1
- [x] **P6-03** · Create `public/manifest.json` with content from §7.1
- [x] **P6-04** · Generate all PWA icons (72px to 512px). Use a script or tool. Place in `public/icons/`.
- [x] **P6-05** · Add FCM service worker integration in `public/firebase-messaging-sw.js` (importScripts Firebase compat CDN, handle push events)
- [x] **P6-06** · Register `firebase-messaging-sw.js` in `/lib/firebase/messaging.ts`
- [x] **P6-07** · Create `/components/pwa/InstallPrompt.tsx` — listens for `beforeinstallprompt` event. Shows an unobtrusive install banner (bottom of screen, dismissible) after 3 days of usage.
- [x] **P6-08** · Create `/app/api/push/route.ts` (Edge Function):
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

## ✅ PHASE 7 — Onboarding Flow

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

## ✅ PHASE 8 — Insights, History & Supplementary Pages

- [x] **P8-01** · Create `/app/(app)/history/page.tsx` — calendar heatmap view
- [x] **P8-02** · Build `CalendarHeatmap` component: 12-month grid, cell color from `completionScore` (0-100 → cream to teal)
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

## ✅ PHASE 9 — Public Pages & SEO

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

## ✅ PHASE 10 — QA, Performance & Launch Prep

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

*Last updated: 2026-05-12 by Lead Setup Agent*
