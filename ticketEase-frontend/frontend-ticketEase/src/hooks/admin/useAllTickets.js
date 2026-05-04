import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllTickets, updateTicketStatus } from "../../services/ticketsService";
import { getAllStudents } from "../../services/userService";
import { useAuth } from "../../context/useAuth";

// Maps UI display labels → exact backend enum names
const STATUS_API_MAP = {
  "In Progress": "InProgress",
  "Ready for Pickup": "ReadyForPickup",
};

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
  const { user } = useAuth();
  const [rawTickets, setRawTickets] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    console.log("[useAllTickets] Current user ID:", user?.userId ?? "not logged in");
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
  }, [user]);

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
        const apiStatus = STATUS_API_MAP[statusFilter] || statusFilter;
        return (t.status ?? "").toLowerCase() === apiStatus.toLowerCase();
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

  const updateStatus = useCallback(async (rawTicket, newStatus, pickupDate = null) => {
    const apiStatus = STATUS_API_MAP[newStatus] || newStatus;
    const ticketData = {
      ...rawTicket,
      estimatedCompletion: pickupDate ? new Date(pickupDate).toISOString() : null,
    };
    return updateTicketStatus(rawTicket.ticketId, apiStatus, ticketData);
  }, []);

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
    updateStatus,
  };
}
