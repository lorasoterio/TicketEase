import { useState, useEffect, useCallback } from "react";
import { getAllTickets, assignTicket } from "../../services/ticketsService";

/**
 * Formats a UTC date string into a relative "time ago" string.
 * @param {string} dateStr
 * @returns {string}
 */
export function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Maps a backend TicketPriority value to a display label.
 * High → "Urgent", Normal → "Normal", Low → "Low"
 * @param {string} priority
 * @returns {string}
 */
export function priorityLabel(priority) {
  if (priority === "High") return "Urgent";
  if (priority === "Low") return "Low";
  return "Normal";
}

/**
 * Custom hook for the admin Ticket Queue page.
 *
 * Fetches all tickets, filters to "Pending" status, and exposes
 * search / priority / type filter state.
 *
 * @returns {{
 *   tickets: Object[],
 *   loading: boolean,
 *   error: string | null,
 *   search: string,
 *   setSearch: Function,
 *   priorityFilter: string,
 *   setPriorityFilter: Function,
 *   typeFilter: string,
 *   setTypeFilter: Function,
 *   refetch: Function,
 * }}
 */
export default function useTicketQueue() {
  const [allPending, setAllPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getAllTickets();
    if (err) {
      setError(typeof err === "string" ? err : "Failed to load tickets.");
    } else {
      // Queue only shows unassigned Pending tickets
      const pending = (data || []).filter((t) => t.status === "Pending");
      setAllPending(pending);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const tickets = allPending
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        t.subject?.toLowerCase().includes(q) ||
        t.referenceNumber?.toLowerCase().includes(q)
      );
    })
    .filter((t) => {
      if (priorityFilter === "urgent") return t.priority === "High";
      if (priorityFilter === "normal") return t.priority === "Normal" || t.priority === "Low";
      return true;
    })
    .filter((t) => {
      if (typeFilter === "document") return t.ticketType === "DocumentRequest";
      if (typeFilter === "inquiry") return t.ticketType === "Inquiry";
      return true;
    });

  const assignTicketToStaff = useCallback(async (ticket, staffId) => {
    const { error: err } = await assignTicket(ticket.ticketId, staffId, ticket);
    if (err) {
      return { success: false, error: typeof err === "string" ? err : "Failed to assign ticket." };
    }
    await fetchTickets();
    return { success: true };
  }, [fetchTickets]);

  return {
    tickets,
    loading,
    error,
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    refetch: fetchTickets,
    assignTicketToStaff,
  };
}
