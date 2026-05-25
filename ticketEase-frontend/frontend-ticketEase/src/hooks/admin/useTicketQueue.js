import { useState, useEffect, useCallback } from "react";
import { getAllTickets } from "../../services/ticketsService";
import { createAssignment } from "../../services/assignRepresentativeService";

import { getAllStudents } from "../../services/userService";
import { getAllStaff } from "../../services/staffService";
import { getAllGradeLevels } from "../../services/gradeLevelService";

/**
 * Fetches all staff.
 * @returns {Promise<{ staff: any[], error: string | null }>}
 */
export async function fetchAllStaffs() {
  try {
    const staffRes = await getAllStaff();
    // Map staff to include fullName
    const staffWithFullName = (staffRes?.data || []).map(s => ({
      ...s,
      fullName: [s.firstName, s.middleName, s.lastName, s.suffix].filter(Boolean).join(' ')
    }));
    return {
      staff: staffWithFullName,
      error: null,
    };
  } catch (err) {
    return {
      staff: [],
      error: typeof err === "string" ? err : "Failed to fetch staff.",
    };
  }
}

/**
 * Fetches all grade levels.
 * @returns {Promise<{ gradeLevels: any[], error: string | null }>}
 */
export async function fetchAllGradeLevels() {
  try {
    const gradeLevelRes = await getAllGradeLevels();
    return {
      gradeLevels: gradeLevelRes?.data || [],
      error: null,
    };
  } catch (err) {
    return {
      gradeLevels: [],
      error: typeof err === "string" ? err : "Failed to fetch grade levels.",
    };
  }
}

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
  const [studentMap, setStudentMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [ticketsResult, students] = await Promise.all([
      getAllTickets(),
      getAllStudents().catch(() => []),
    ]);
    const { data, error: err } = ticketsResult;
    if (err) {
      setError(typeof err === "string" ? err : "Failed to load tickets.");
    } else {
      // Queue only shows unassigned Pending tickets
      const pending = (data || []).filter((t) => t.status === "Pending");
      setAllPending(pending);
    }
    const map = {};
    (students || []).forEach((s) => {
      if (s.userId != null)
        map[s.userId] = {
          fullName: s.fullName || "—",
          schoolStudentId: s.schoolStudentId || "—",
          yearLevel: s.yearLevel || "—",
        };
    });
    setStudentMap(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const tickets = allPending
    .filter((t) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const studentName = (studentMap[t.studentId]?.fullName ?? "").toLowerCase();
      const schoolId = (studentMap[t.studentId]?.schoolStudentId ?? "").toLowerCase();
      return (
        t.subject?.toLowerCase().includes(q) ||
        t.referenceNumber?.toLowerCase().includes(q) ||
        studentName.includes(q) ||
        schoolId.includes(q)
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
    try {
      // The assignment object structure should match backend expectations
      const assignment = {
        ticketId: ticket.ticketId,
        staffId: staffId
      };
      await createAssignment(assignment);
      await fetchTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: typeof err === "string" ? err : "Failed to assign ticket." };
    }
  }, [fetchTickets]);


  return {
    tickets,
    studentMap,
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
