import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllTickets, getMyTickets, setTicketPriorityHigh, updateTicketRemarks, updateTicketStatus } from "../../services/ticketsService";
import { getAllStudents } from "../../services/userService";
import { useAuth } from "../../context/useAuth";

// Maps UI display labels → exact backend enum names
const STATUS_API_MAP = {
  "In Progress": "InProgress",
  "Ready for Pickup": "ReadyForPickup",
};

const PAGE_SIZE = 7;
const STAFF_AUTO_REFRESH_MS = 15000;

function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function mapTicketType(type) {
  if (type === "DocumentRequest") return "Document";
  if (type === "Inquiry") return "Inquiry";
  return type ?? "—";
}

export default function useAllTickets() {
  const { user } = useAuth();
  const currentUserId = Number(user?.userId);
  const role = (user?.role ?? "").toLowerCase();
  const isAssignedScopeRole = role === "staff" || role === "admin";
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
        isAssignedScopeRole ? getMyTickets() : getAllTickets(),
        getAllStudents(),
      ]);

      const { data: ticketList, error: ticketErr } = ticketsResult;
      console.log("[useAllTickets] Fetched tickets:", ticketList);
      if (ticketErr) throw new Error(typeof ticketErr === "string" ? ticketErr : "Failed to load tickets.");

      const assigned = (ticketList || []).filter(
        (t) =>
          t.assignedStaffId != null &&
          (isAssignedScopeRole || (t.status ?? "").toLowerCase() !== "pending") &&
          (!isAssignedScopeRole || Number(t.assignedStaffId) === currentUserId)
      );
      setRawTickets(assigned);

      const map = {};
      (students || []).forEach((s) => {
        if (s.userId != null)
          map[s.userId] = {
            fullName: [s.firstName, s.middleName, s.lastName, s.suffix]
              .filter(Boolean)
              .join(" ") || "—",
            schoolStudentId: s.schoolStudentId || "—",
            yearLevel: s.gradeLevelName || "—",
          };
      });
      setStudentMap(map);
    } catch (err) {
      setError(err.message ?? "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [user, currentUserId, isAssignedScopeRole]);

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
        const requestor = (studentMap[t.studentId]?.fullName ?? "").toLowerCase();
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
    requestor: studentMap[t.studentId]?.fullName ?? "—",
    type: mapTicketType(t.ticketType),
    date: formatDateTime(t.createdAt),
    status: t.status ?? "—",
    _raw: t,
  }));

  const updateStatus = useCallback(async (rawTicket, newStatus, remarks = null) => {
    const apiStatus = STATUS_API_MAP[newStatus] || newStatus;
    const statusResult = await updateTicketStatus(rawTicket.ticketId, apiStatus, rawTicket);
    if (statusResult.error) return statusResult;

    if (remarks !== null && remarks !== undefined) {
      return updateTicketRemarks(rawTicket.ticketId, remarks);
    }

    return statusResult;
  }, []);

  const markTicketAsHigh = useCallback(async (rawTicket) => {
    if (!rawTicket?.ticketId) {
      return { data: null, error: "Invalid ticket." };
    }

    const result = await setTicketPriorityHigh(rawTicket.ticketId);
    if (!result.error) {
      setRawTickets((prev) =>
        prev.map((t) =>
          t.ticketId === rawTicket.ticketId
            ? {
              ...t,
              priority: "High",
              updatedAt: result.data?.updatedAt ?? t.updatedAt,
            }
            : t
        )
      );
    }

    return result;
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
    markTicketAsHigh,
  };
}
