import { useAuth } from '@/lib/context/AuthContext';
import { signOut } from '@/lib/firebase/auth';
import { requestNotificationPermission } from '@/lib/firebase/messaging';
import { Bell, SignOut } from '@phosphor-icons/react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isNotifEnabled, setIsNotifEnabled] = React.useState(false);

  const handleToggleNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      setIsNotifEnabled(true);
      // In a real app, you'd save this token to Firestore notifications/{uid}
      console.log('FCM Token:', token);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full pb-20 pt-6">
      <h1 className="text-[32px] font-medium font-[family-name:var(--font-lora)] text-charcoal">Settings</h1>
      
      {/* Profile Section */}
      <div className="bg-white p-8 rounded-[32px] border border-border-warm shadow-sm">
        <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-6">Profile</h2>
        <div className="flex items-center gap-6 mb-8">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-2 border-teal-dust/10" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-teal-dust/5 flex items-center justify-center text-teal-dust text-3xl font-medium">
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
          )}
          <div className="space-y-1">
            <p className="font-semibold text-xl text-charcoal">{user?.displayName || 'Spiritual Seeker'}</p>
            <p className="text-charcoal/50 text-sm">{user?.email}</p>
          </div>
        </div>

        <button 
          onClick={() => signOut()}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 rounded-2xl transition-all font-medium text-sm"
        >
          <SignOut weight="bold" />
          Sign out
        </button>
      </div>

      {/* Notifications Section */}
      <div className="bg-white p-8 rounded-[32px] border border-border-warm shadow-sm">
        <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-6">Notifications</h2>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-dust/5 flex items-center justify-center text-teal-dust">
              <Bell weight="duotone" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-medium text-charcoal">Daily Reminders</p>
              <p className="text-xs text-charcoal/40">Get notified for nightly reviews and prayers.</p>
            </div>
          </div>
          <button 
            onClick={handleToggleNotifications}
            className={`relative w-12 h-6 rounded-full transition-colors ${isNotifEnabled ? 'bg-teal-dust' : 'bg-charcoal/10'}`}
          >
            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${isNotifEnabled ? 'translate-x-6' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-border-warm shadow-sm">
        <h2 className="text-[13px] font-bold text-charcoal/30 uppercase tracking-[0.2em] mb-6">Preferences</h2>
        <p className="text-charcoal/40 text-sm">Additional settings for Madhab and Calculation Method will be available soon.</p>
      </div>
    </div>
  );
}
