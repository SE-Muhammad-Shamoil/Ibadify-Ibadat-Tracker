import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getMessaging } from 'firebase-admin/messaging';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // If admin credentials are not set, initialize without them
  // (works in Firebase-hosted environments with default credentials)
  if (!privateKey || !clientEmail) {
    return initializeApp({
      projectId,
    });
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      // Handle escaped newlines in the private key (common in env vars)
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const adminApp = getAdminApp();
const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminMessaging = getMessaging(adminApp);

export { adminApp, adminDb, adminAuth, adminMessaging };
