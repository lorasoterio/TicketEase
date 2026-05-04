import { useState, useEffect, useCallback } from "react";
import client from "../../api/client";

export default function useAdminTicketMessages(ticketId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = useCallback(async () => {
    if (!ticketId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await client.get(`/tickets/${ticketId}/messages`);
      setMessages(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || !ticketId) return { error: null };
    setSending(true);
    setError("");
    try {
      await client.post(`/tickets/${ticketId}/messages`, { message: text });
      const { data } = await client.get(`/tickets/${ticketId}/messages`);
      setMessages(data);
      return { error: null };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send message.";
      setError(msg);
      return { error: msg };
    } finally {
      setSending(false);
    }
  }, [ticketId]);

  return { messages, loading, sending, error, sendMessage, refetch: fetchMessages };
}
