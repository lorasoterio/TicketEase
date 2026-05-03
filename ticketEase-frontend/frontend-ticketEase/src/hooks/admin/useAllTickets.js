import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllTickets } from "../../services/ticketsService";
import { getAllStudents } from "../../services/userService";

const PAGE_SIZE = 7;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapTicketType(type) {
  if (type === "DocumentRequest") return "Document";
  if (type === "Inquiry") return "Inquiry";
  return type ?? "—";
}

export default function useAllTickets() {
  const [rawTickets, setRawTickets] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ticketsResult, students] = await Promise.all([
        getAllTickets(),
        getAllStudents(),
      ]);

      const { data: ticketList, error: ticketErr } = ticketsResult;
      if (ticketErr) throw new Error(typeof ticketErr === "string" ? ticketErr : "Failed to load tickets.");

      // Only show tickets that have been assigned to a staff member and are past Pending
      const assigned = (ticketList || []).filter(
        (t) => t.assignedStaffId != null && (t.status ?? "").toLowerCase() !== "pending"
      );
      setRawTickets(assigned);

      // Build userId → fullName map from students list
      const map = {};
      (students || []).forEach((s) => {
        if (s.userId != null) map[s.userId] = s.fullName || "—";
      });
      setStudentMap(map);
    } catch (err) {
      setError(err.message ?? "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const filtered = useMemo(() => {
    return rawTickets
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        const refNum = (t.referenceNumber ?? `#${t.ticketId}`).toLowerCase();
        const requestor = (studentMap[t.studentId] ?? "").toLowerCase();
        return (
          refNum.includes(q) ||
          (t.subject ?? "").toLowerCase().includes(q) ||
          requestor.includes(q)
        );
      })
      .filter((t) => {
        if (!statusFilter) return true;
        return (t.status ?? "").toLowerCase() === statusFilter.toLowerCase();
      });
  }, [rawTickets, studentMap, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const rows = paginated.map((t) => ({
    id: t.referenceNumber ?? `#T-${t.ticketId}`,
    subject: t.subject ?? "—",
    requestor: studentMap[t.studentId] ?? "—",
    type: mapTicketType(t.ticketType),
    date: formatDate(t.createdAt),
    status: t.status ?? "—",
    _raw: t,
  }));

  return {
    rows,
    studentMap,
    loading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    total: filtered.length,
    refetch: fetchData,
  };
}
