import client from "../api/client";

/**
 * Fetches all notifications for the authenticated user.
 * Admins receive all notifications; others receive only their own.
 * @returns {Promise<{data: Array, error: any}>}
 */
export const getNotifications = async () => {
  try {
    const response = await client.get("/notifications");
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Fetches the count of unread notifications for the authenticated user.
 * @returns {Promise<{count: number|null, error: any}>}
 */
export const getUnreadCount = async () => {
  try {
    const response = await client.get("/notifications/unread-count");
    return { count: response.data.unreadCount, error: null };
  } catch (error) {
    return { count: null, error: error.response?.data || error.message };
  }
};

/**
 * Marks a single notification as read.
 * @param {number} id - Notification ID.
 * @returns {Promise<{error: any}>}
 */
export const markAsRead = async (id) => {
  try {
    await client.patch(`/notifications/${id}/read`);
    return { error: null };
  } catch (error) {
    return { error: error.response?.data || error.message };
  }
};

/**
 * Marks all notifications as read for the authenticated user.
 * @returns {Promise<{error: any}>}
 */
export const markAllAsRead = async () => {
  try {
    await client.patch("/notifications/read-all");
    return { error: null };
  } catch (error) {
    return { error: error.response?.data || error.message };
  }
};

/**
 * Deletes a notification (owner or admin only).
 * @param {number} id - Notification ID.
 * @returns {Promise<{error: any}>}
 */
export const deleteNotification = async (id) => {
  try {
    await client.delete(`/notifications/${id}`);
    return { error: null };
  } catch (error) {
    return { error: error.response?.data || error.message };
  }
};
