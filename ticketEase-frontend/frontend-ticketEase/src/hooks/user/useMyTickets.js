import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

export default function useMyTickets() {
  const { user } = useAuth();
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [fetchTrigger, setFetchTrigger] = useState(0);
  const refetch = () => setFetchTrigger((n) => n + 1);

  const [status, setStatus] = useState("All");
  const [ticketType, setTicketType] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const PER_PAGE = 8;

  /* ---------- FETCH FROM BACKEND ---------- */
  useEffect(() => {
    if (!user?.userId) return;

    const fetchTickets = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const { data } = await client.get("/tickets");

        const shaped = data.map((t) => ({
          id:       t.referenceNumber || String(t.ticketId),
          ticketId: t.ticketId,
          subject:  t.subject ?? "(No subject)",
          status:   formatStatus(t.status),
          type:     formatTicketType(t.ticketType),
          date:     formatDate(t.createdAt),
        }));

        setAllTickets(shaped);
      } catch (err) {
        setFetchError(err.message || "Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, fetchTrigger]);

  /* ---------- HANDLERS ---------- */
  const handleSetStatus     = (val) => { setStatus(val);     setPage(1); };
  const handleSetTicketType = (val) => { setTicketType(val); setPage(1); };
  const handleSetSearch     = (val) => { setSearch(val);     setPage(1); };

  /* ---------- FILTER ---------- */
  const filteredTickets = useMemo(() => {
    return allTickets.filter((t) => {
      const statusMatch = status === "All" || t.status === status;
      const typeMatch   = ticketType === "All" || t.type === ticketType;
      const searchMatch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });
  }, [allTickets, status, ticketType, search]);

  /* ---------- PAGINATION ---------- */
  const pageCount = Math.ceil(filteredTickets.length / PER_PAGE);

  const tickets = useMemo(() => {
    return filteredTickets.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  }, [filteredTickets, page]);

  return {
    tickets,
    loading,
    fetchError,
    status,
    ticketType,
    search,
    page,
    setPage,
    pageCount,
    total: filteredTickets.length,
    handleSetStatus,
    handleSetTicketType,
    handleSetSearch,
    refetch,
  };
}

/* ---------- HELPERS ---------- */
function formatStatus(status) {
  const map = {
    Pending:        "Pending",
    Assigned:       "Pending",
    InProgress:     "In progress",
    ReadyForPickup: "In progress",
    Completed:      "Completed",
    Rejected:       "Rejected",
    Open:           "Pending",
    Responded:      "In progress",
    Closed:         "Completed",
  };
  return map[status] ?? status;
}

function formatTicketType(ticketType) {
  const map = {
    DocumentRequest: "Document Request",
    Inquiry:         "Inquiry",
  };
  return map[ticketType] ?? ticketType ?? "Other";
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}
