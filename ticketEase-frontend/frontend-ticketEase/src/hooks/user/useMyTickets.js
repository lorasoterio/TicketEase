import { useState, useMemo } from "react";

export default function useMyTickets() {
  const [allTickets] = useState([]);
  const [loading] = useState(true);
  const [fetchError] = useState("");

  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const PER_PAGE = 8;

  /* ---------- FETCH FROM SUPABASE ---------- */
  /*
  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      setLoading(true);
      setFetchError("");

      const { data, error } = await supabase
        .from("tickets")
        .select("id, ticket_number, subject, status, category, submitted_at")
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false });

      if (error) {
        setFetchError(error.message);
      } else {
        // Shape the data to match what TicketRow expects
        const shaped = data.map((t) => ({
          id:      t.ticket_number,               // e.g. TKT-2024-0001
          subject: t.subject,
          status:  formatStatus(t.status),        // "open" → "Pending"
          type:    formatCategory(t.category),    // "document_request" → "Document Request"
          date:    formatDate(t.submitted_at),    // "Mar 10, 2026"
        }));
        setAllTickets(shaped);
      }

      setLoading(false);
    };

    fetchTickets();
  }, [user]);*/

  /* ---------- HANDLERS ---------- */
  const handleSetStatus = (val) => { setStatus(val); setPage(1); };
  const handleSetSearch = (val) => { setSearch(val);  setPage(1); };

  /* ---------- FILTER ---------- */
  const filteredTickets = useMemo(() => {
    return allTickets.filter((t) => {
      const statusMatch = status === "All" || t.status === status;
      const searchMatch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [allTickets, status, search]);

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
    search,
    page,
    setPage,
    pageCount,
    total: filteredTickets.length,
    handleSetStatus,
    handleSetSearch,
  };
}

/* ---------- HELPERS ---------- */
function formatStatus(status) {
  const map = {
    open:        "Pending",
    in_progress: "In progress",
    resolved:    "Completed",
    rejected:    "Rejected",
    closed:      "Completed",
  };
  return map[status] ?? status;
}

function formatCategory(category) {
  const map = {
    document_request: "Document Request",
    inquiry:          "Inquiry",
    other:            "Other",
  };
  return map[category] ?? category;
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}