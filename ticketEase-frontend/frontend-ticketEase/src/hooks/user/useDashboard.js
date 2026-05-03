import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

export default function useDashboard() {
  const { user } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await client.get("/tickets");
        setTickets(data);
      } catch (err) {
        setError(err.response?.data?.message ?? err.message ?? "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  /* ---------- STAT COUNTS ---------- */
  const stats = {
    total:       tickets.length,
    in_progress: tickets.filter((t) => t.status === "InProgress" || t.status === "Assigned").length,
    completed:   tickets.filter((t) => t.status === "Completed" || t.status === "Closed").length,
    pending:     tickets.filter((t) => t.status === "Pending" || t.status === "Open").length,
  };

  /* ---------- RECENT TICKETS (last 3) ---------- */
  const recentTickets = tickets.slice(0, 3).map((t) => ({
    id:      t.referenceNumber,
    subject: t.subject,
    status:  formatStatus(t.status),
    date:    formatDate(t.createdAt),
  }));

  return {
    loading,
    error,
    stats,
    recentTickets,
  };
}

/* ---------- HELPERS ---------- */
function formatStatus(status) {
  const map = {
    Pending:          "Pending",
    Open:             "Pending",
    Assigned:         "In progress",
    InProgress:       "In progress",
    Responded:        "In progress",
    ReadyForPickup:   "Ready for pickup",
    Completed:        "Completed",
    Closed:           "Completed",
    Rejected:         "Rejected",
  };
  return map[status] ?? status;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}