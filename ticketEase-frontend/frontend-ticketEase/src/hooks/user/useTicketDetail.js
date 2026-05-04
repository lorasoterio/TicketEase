import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

export default function useTicketDetail(ticketId) {
  const { user } = useAuth();

  const [detail, setDetail]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [sending, setSending]   = useState(false);
  const [error, setError]       = useState("");

  const fetchAll = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    setError("");
    try {
      const [detailRes, msgsRes] = await Promise.all([
        client.get(`/tickets/${ticketId}`),
        client.get(`/tickets/${ticketId}/messages`),
      ]);
      setDetail(detailRes.data);
      setMessages(msgsRes.data);
    } catch (err) {
      setError(err.message || "Failed to load ticket details.");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    setSending(true);
    try {
      const { data } = await client.post(`/tickets/${ticketId}/messages`, {
        message: text,
      });
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          senderName: user?.fullName ?? user?.email ?? "You",
          senderRole: "Student",
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return { detail, messages, loading, sending, error, sendMessage, refetch: fetchAll };
}
