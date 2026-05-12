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
