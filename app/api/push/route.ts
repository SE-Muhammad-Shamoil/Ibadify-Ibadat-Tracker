import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminMessaging } from '@/lib/firebase/admin';

export const runtime = 'nodejs'; // Firebase Admin requires nodejs runtime, not edge

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await req.json();
    const { token, title, message, url } = body;

    if (!token) {
      return NextResponse.json({ error: 'FCM Token required' }, { status: 400 });
    }

    const payload = {
      token: token,
      notification: {
        title: title || 'Ibadify Reminder',
        body: message || 'Time for your spiritual check-in.',
      },
      data: {
        url: url || '/dashboard',
      },
      webpush: {
        fcmOptions: {
          link: url || '/dashboard',
        },
      },
    };

    const response = await adminMessaging.send(payload);
    return NextResponse.json({ success: true, messageId: response });
  } catch (error: any) {
    console.error('Push error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
