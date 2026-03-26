import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { apiFetch, formatShortDate } from '../lib/api';
import { getSocket } from '../lib/socket';
import { useToast } from './ui/Toast';

const normalizeNotification = (notification: any) => ({
  ...notification,
  id: notification?.id || notification?._id?.toString?.() || String(notification?._id || ''),
  is_read: notification?.is_read === true || notification?.is_read === 1,
});

const notificationKey = (notification: any) => {
  const timestamp = notification?.created_at ? new Date(notification.created_at).toISOString().slice(0, 16) : '';
  return `${notification?.type || ''}|${notification?.title || ''}|${notification?.body || ''}|${timestamp}`;
};

const dedupeNotifications = (items: any[]) => {
  const seen = new Set<string>();
  const deduped: any[] = [];
  for (const item of items) {
    const key = notificationKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications]
  );

  useEffect(() => {
    let active = true;

    apiFetch('/api/notifications')
      .then((data) => {
        if (!active) return;
        setNotifications(dedupeNotifications((data || []).map(normalizeNotification)));
      })
      .catch((error: any) => {
        if (!active) return;
        toast.push({ title: 'Unable to load notifications', description: error.error || '', variant: 'error' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const socket = getSocket();
    const handleNotification = (incoming: any) => {
      const normalized = normalizeNotification(incoming);
      setNotifications((prev) => {
        const existingById = prev.find((item) => item.id === normalized.id);
        if (existingById) {
          return prev.map((item) => (item.id === normalized.id ? normalized : item));
        }
        const key = notificationKey(normalized);
        if (prev.some((item) => notificationKey(item) === key)) {
          return prev;
        }
        return dedupeNotifications([normalized, ...prev]).slice(0, 20);
      });
    };

    socket.on('notification', handleNotification);

    return () => {
      active = false;
      socket.off('notification', handleNotification);
    };
  }, [toast]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id)
      .filter(Boolean);

    if (!unreadIds.length) return;

    setNotifications((prev) => prev.map((notification) => ({ ...notification, is_read: true })));
    apiFetch('/api/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ ids: unreadIds }),
    }).catch(() => undefined);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#F28C3A]/40 hover:text-[#F28C3A]"
        aria-label="Open notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-[1.35rem] rounded-full bg-[#F28C3A] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-[90] w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-base font-bold text-[#2A1B7A]">Notifications</h3>
              <p className="text-xs text-slate-500">Latest updates for your deliveries</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {loading ? (
              <div className="px-5 py-6 text-sm text-slate-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">No notifications yet.</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-slate-100 px-5 py-4 last:border-b-0 ${notification.is_read ? 'bg-white' : 'bg-[#F28C3A]/5'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                      {notification.body ? <p className="text-sm text-slate-500">{notification.body}</p> : null}
                    </div>
                    {!notification.is_read && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#F28C3A]" />}
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{formatShortDate(notification.created_at)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
