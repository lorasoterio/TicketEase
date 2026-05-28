import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/useAuth";
import { getTicketsByStudent } from "../../services/ticketsService";

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
    console.log("[useMyTickets] Current user:", user);

    if (!user?.schoolStudentId) {
      console.warn("[useMyTickets] No schoolStudentId found in user.", user);
      return;
    }

    const fetchTickets = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const { data, error } = await getTicketsByStudent(user.schoolStudentId);
        console.log("[useMyTickets] Fetched data:", data);
        if (error) {
          console.error("[useMyTickets] Fetch error:", error);
          throw new Error(typeof error === "string" ? error : (error.message || "Failed to load tickets."));
        }

        const shaped = data.map((t) => ({
          id:       t.referenceNumber || String(t.ticketId),
          ticketId: t.ticketId,
          subject:  t.subject ?? "(No subject)",
          status:   formatStatus(t.status),
          type:     formatTicketType(t.ticketType),
          date:     formatDate(t.createdAt),
        }));
        console.log("[useMyTickets] Shaped tickets:", shaped);
        setAllTickets(shaped);
      } catch (err) {
        console.error("[useMyTickets] Exception:", err);
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
    const filtered = allTickets.filter((t) => {
      const statusMatch = status === "All" || t.status === status;
      const typeMatch   = ticketType === "All" || t.type === ticketType;
      const searchMatch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      return statusMatch && typeMatch && searchMatch;
    });
    console.log("[useMyTickets] Filtered tickets:", filtered);
    return filtered;
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
    Rejected:       "Rejected",
    Responded:      "In progress",
    Closed:         "Closed",
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
