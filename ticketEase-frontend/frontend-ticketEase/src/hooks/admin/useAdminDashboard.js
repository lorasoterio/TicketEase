import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/useAuth";
import { getAllTickets, getMyTickets } from "../../services/ticketsService";

const OPEN_STATUSES = ["Pending", "Assigned", "InProgress", "ReadyForPickup", "Responded"];
const RESOLVED_STATUSES = ["Closed"];
const STAFF_AUTO_REFRESH_MS = 15000;

function mapStatus(status) {
  const map = {
    Pending: "Pending",
    Assigned: "Open",
    InProgress: "Open",
    Responded: "Open",
    ReadyForPickup: "Pending",
    Closed: "Closed",
    Rejected: "Closed",
  };
  return map[status] ?? status;
}

function activityColor(status) {
  if (RESOLVED_STATUSES.includes(status)) return "success.main";
  if (status === "Rejected") return "error.main";
  if (["InProgress", "Assigned"].includes(status)) return "primary.main";
  return "secondary.main";
}

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function buildWeekData(tickets) {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun..6=Sat
  const mondayOffset = (dayOfWeek + 6) % 7; // days since Monday
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = new Array(7).fill(0);

  tickets.forEach((t) => {
    const d = new Date(t.createdAt);
    const offset = Math.floor((d - startOfWeek) / 86400000);
    if (offset >= 0 && offset < 7) counts[offset]++;
  });

  return days.map((label, i) => ({
    label,
    v: counts[i],
    gold: i >= 5,
    dim: i < mondayOffset && i < 5,
  }));
}

export default function useAdminDashboard() {
  const { user } = useAuth();
  const currentUserId = Number(user?.userId);
  const role = (user?.role ?? "").toLowerCase();
  const isAssignedScopeRole = role === "staff" || role === "admin";
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await (isAssignedScopeRole ? getMyTickets() : getAllTickets());
      if (err) throw new Error(typeof err === "string" ? err : "Failed to load tickets.");
      const allTickets = data || [];
      const filtered = isAssignedScopeRole
        ? allTickets.filter((t) => Number(t.assignedStaffId) === currentUserId)
        : allTickets;
      setTickets(filtered);
    } catch (e) {
      setError(e.message ?? "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [isAssignedScopeRole, currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isAssignedScopeRole) return undefined;

    const onFocusOrVisible = () => {
      if (document.visibilityState === "visible") {
        fetchData();
      }
    };

    const intervalId = window.setInterval(fetchData, STAFF_AUTO_REFRESH_MS);
    window.addEventListener("focus", onFocusOrVisible);
    document.addEventListener("visibilitychange", onFocusOrVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocusOrVisible);
      document.removeEventListener("visibilitychange", onFocusOrVisible);
    };
  }, [isAssignedScopeRole, fetchData]);

  const total = tickets.length;
  const safeTotal = total || 1;

  const thisWeekCount = tickets.filter((t) => {
    return new Date(t.createdAt) >= new Date(Date.now() - 7 * 86400000);
  }).length;

  const stats = [
    {
      label: "Total Tickets",
      value: total,
      sub: `↑ ${thisWeekCount} this week`,
      color: "primary.main",
    },
    {
      label: "Open",
      value: tickets.filter((t) => OPEN_STATUSES.includes(t.status)).length,
      sub: "Awaiting action",
      color: "primary.main",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => RESOLVED_STATUSES.includes(t.status)).length,
      sub: "Completed & closed",
      color: "success.main",
    },
    {
      label: "Urgent",
      value: tickets.filter((t) => t.priority === "High").length,
      sub: "High priority",
      color: "error.main",
    },
  ];

  const recentTickets = tickets
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((t) => ({
      id: t.referenceNumber || `#${t.ticketId}`,
      subject: t.subject || "—",
      status: mapStatus(t.status),
    }));

  const docReqCount = tickets.filter((t) => t.ticketType === "DocumentRequest").length;
  const inquiryCount = tickets.filter((t) => t.ticketType === "Inquiry").length;

  const categories = [
    { label: "Document Request", pct: Math.round((docReqCount / safeTotal) * 100) },
    { label: "Inquiry", pct: Math.round((inquiryCount / safeTotal) * 100) },
  ];

  const weekData = buildWeekData(tickets);

  const activity = tickets
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5)
    .map((t) => ({
      color: activityColor(t.status),
      text: `${t.referenceNumber || `#${t.ticketId}`} — ${t.subject || "—"} (${t.status})`,
      time: timeAgo(t.updatedAt),
    }));

  return { loading, error, stats, recentTickets, categories, weekData, activity, refetch: fetchData };
}
