import {
  getFirestore,
  doc,
  getDoc as firestoreGetDoc,
  setDoc as firestoreSetDoc,
  updateDoc as firestoreUpdateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type DocumentReference,
  type SetOptions,
  type WithFieldValue,
} from 'firebase/firestore';
import { app } from './config';

// Initialize Firestore
const db = getFirestore(app);

// ─── Typed Helpers ───────────────────────────────────────────────────────────

/**
 * Get a typed document from Firestore
 */
export async function getDocument<T extends DocumentData>(
  path: string,
  ...pathSegments: string[]
): Promise<T | null> {
  const docRef = doc(db, path, ...pathSegments);
  const docSnap = await firestoreGetDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

/**
 * Set a typed document in Firestore (create or overwrite)
 */
export async function setDocument<T extends DocumentData>(
  data: WithFieldValue<T>,
  path: string,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments) as DocumentReference<T>;
  await firestoreSetDoc(docRef, data);
}

/**
 * Set a typed document with merge option
 */
export async function setDocumentMerge<T extends DocumentData>(
  data: Partial<WithFieldValue<T>>,
  path: string,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments) as DocumentReference<T>;
  await firestoreSetDoc(docRef, data as WithFieldValue<T>, { merge: true } as SetOptions);
}

/**
 * Update fields on an existing document
 */
export async function updateDocument(
  data: DocumentData,
  path: string,
  ...pathSegments: string[]
): Promise<void> {
  const docRef = doc(db, path, ...pathSegments);
  await firestoreUpdateDoc(docRef, data);
}

// ─── Daily Log Helpers ───────────────────────────────────────────────────────

/**
 * Get a user's daily log for a specific date
 * @param userId - Firebase Auth UID
 * @param dateString - YYYY-MM-DD in user's home timezone
 */
export async function getDailyLog(userId: string, dateString: string) {
  return getDocument('dailyLogs', userId, 'logs', dateString);
}

/**
 * Create or update a user's daily log (upsert with merge)
 * @param userId - Firebase Auth UID
 * @param dateString - YYYY-MM-DD in user's home timezone
 * @param data - Partial daily log data to merge
 */
export async function upsertDailyLog(
  userId: string,
  dateString: string,
  data: DocumentData,
): Promise<void> {
  const docRef = doc(db, 'dailyLogs', userId, 'logs', dateString);
  await firestoreSetDoc(
    docRef,
    {
      ...data,
      userId,
      date: dateString,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Get daily logs for a date range
 */
export async function getDailyLogs(userId: string, startDate: string, endDate: string) {
  const logsRef = collection(db, 'dailyLogs', userId, 'logs');
  const q = query(logsRef, where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── User Document Helpers ───────────────────────────────────────────────────

/**
 * Get user profile document
 */
export async function getUserProfile(userId: string) {
  return getDocument('users', userId);
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(userId: string, data: DocumentData): Promise<void> {
  const docRef = doc(db, 'users', userId);
  await firestoreSetDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Initialize a new user if they don't exist
 */
export async function initializeUser(user: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }): Promise<void> {
  const existingUser = await getUserProfile(user.uid);
  if (!existingUser) {
    const homeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = new Date().toLocaleDateString('en-CA', { timeZone: homeTimezone }); // YYYY-MM-DD
    
    await firestoreSetDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Spiritual Seeker',
      photoURL: user.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      homeTimezone,
      madhab: 'hanafi',
      prayerCalcMethod: 'MWL',
      barakahScore: 0,
      streakGraceEnabled: true,
      quietHoursEnabled: true,
      onboardingComplete: false,
      lastActiveDate: today,
    });
    
    // Also initialize streaks
    await updateStreak(user.uid, {
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: '',
      streakType: 'fard_only',
      graceUsedToday: false,
      streakHistory: {}
    });
    
    // Also initialize qazaDebt
    await updateQazaDebt(user.uid, {
      estimatedDebt: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 },
      paidOff: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 },
      dailyPayoffTarget: 0,
      payoffStartDate: today,
      estimatedCompletionDate: ''
    });
  }
}

// ─── Streak Helpers ──────────────────────────────────────────────────────────

/**
 * Get user's streak document
 */
export async function getStreak(userId: string) {
  return getDocument('streaks', userId);
}

/**
 * Update user's streak document
 */
export async function updateStreak(userId: string, data: DocumentData): Promise<void> {
  const docRef = doc(db, 'streaks', userId);
  await firestoreSetDoc(
    docRef,
    {
      ...data,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

// ─── Qaza Helpers ────────────────────────────────────────────────────────────

/**
 * Get user's Qaza debt document
 */
export async function getQazaDebt(userId: string) {
  return getDocument('qazaDebt', userId);
}

/**
 * Update user's Qaza debt
 */
export async function updateQazaDebt(userId: string, data: DocumentData): Promise<void> {
  const docRef = doc(db, 'qazaDebt', userId);
  await firestoreSetDoc(
    docRef,
    {
      ...data,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export { db, serverTimestamp };
