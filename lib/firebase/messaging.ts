import { getMessaging, getToken, onMessage, isSupported, type Messaging } from 'firebase/messaging';
import { app } from './config';

let messaging: Messaging | null = null;

/**
 * Initialize messaging (client-side only)
 */
async function getMessagingInstance(): Promise<Messaging | null> {
  if (messaging) return messaging;

  const supported = await isSupported();
  if (!supported) {
    console.warn('Firebase Messaging is not supported in this browser.');
    return null;
  }

  messaging = getMessaging(app);
  return messaging;
}

/**
 * Request notification permission and retrieve FCM token
 * ONLY call this after explicit user opt-in (Settings page)
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied.');
      return null;
    }

    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('VAPID key not configured. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local');
      return null;
    }

    const token = await getToken(messagingInstance, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    throw error;
  }
}

/**
 * Get current FCM token (if already granted)
 */
export async function getFCMToken(): Promise<string | null> {
  try {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) return null;

    const token = await getToken(messagingInstance, { vapidKey });
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Listen for foreground messages
 * Returns an unsubscribe function
 */
export function onMessageListener(callback: (payload: unknown) => void): (() => void) | null {
  // Lazy init — can't await in sync context, so check synchronously
  if (!messaging) {
    // Attempt async init then subscribe
    getMessagingInstance().then((instance) => {
      if (instance) {
        onMessage(instance, callback);
      }
    });
    // Return a no-op unsubscribe since we can't return the real one synchronously
    return () => {};
  }

  return onMessage(messaging, callback) as unknown as () => void;
}
