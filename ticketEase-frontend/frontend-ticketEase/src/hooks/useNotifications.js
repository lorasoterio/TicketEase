import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/useAuth";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notificationService";

/**
 * Hook that fetches and manages notifications for the authenticated user.
 *
 * Returns:
 *  - notifications: shaped notification objects
 *  - unreadCount: number of unread items
 *  - loading: boolean
 *  - handleMarkAsRead(id): marks one notification read locally + on server
 *  - handleMarkAllAsRead(): marks all read locally + on server
 *  - handleDelete(id): deletes a notification locally + on server
 *  - refetch(): manually re-fetches
 */
export default function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const refetch = useCallback(() => setFetchTrigger((n) => n + 1), []);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await getNotifications();
      if (cancelled) return;
      if (!error && data) {
        const seen = new Set();
        const shaped = data
          .filter((n) => String(n.channel || "").toLowerCase() === "inapp")
          .filter((n) => {
            const id = n.notificationId;
            if (id == null || seen.has(id)) return false;
            seen.add(id);
            return true;
          })
          .map((n) => ({
            id: n.notificationId,
            userId: n.userId,
            message: n.message,
            isRead: n.isRead,
            createdAt: n.createdAt,
            eventType: n.eventType,
            channel: n.channel,
            deliveryStatus: n.deliveryStatus,
            // human-readable relative time shown in the UI
            time: formatRelativeTime(n.createdAt),
          }));
        setNotifications(shaped);
      }
      setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [user, fetchTrigger]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    await markAsRead(id);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllAsRead();
  }, []);

  const handleDelete = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotification(id);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    refetch,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
