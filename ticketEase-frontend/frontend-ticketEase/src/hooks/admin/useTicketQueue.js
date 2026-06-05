import { useState, useEffect, useCallback } from "react";
import { getAllTickets, setTicketPriorityHigh, updateTicketAssignedStaff } from "../../services/ticketsService";
import { getAllStudents } from "../../services/userService";
import { getAllGradeLevels } from "../../services/gradeLevelService";
import { getAllStaff } from "../../services/userService";
/**
 * Fetches all staff.
 * @returns {Promise<{ staff: any[], error: string | null }>}
 */
export async function fetchAllStaffs() {
  try {
    const staffRes = await getAllStaff();
    const rawStaff = Array.isArray(staffRes)
      ? staffRes
      : Array.isArray(staffRes?.data)
        ? staffRes.data
        : [];
    // Map staff to include fullName
    const staffWithFullName = rawStaff.map((s) => ({
      ...s,
      fullName:
        s.fullName ||
        [s.firstName, s.middleName, s.lastName, s.suffix]
          .filter(Boolean)
          .join(" "),
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

function buildStudentFullName(student) {
  const fromParts = [student.firstName, student.middleName, student.lastName, student.suffix]
    .filter(Boolean)
    .join(" ")
    .trim();

  return student.fullName || fromParts || "—";
}

/**
 * Custom hook for the admin Ticket Queue page.
 *
 * Fetches all tickets and exposes
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
  const [allTickets, setAllTickets] = useState([]);
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
      setAllTickets(data || []);
    }
    const map = {};
    (students || []).forEach((s) => {
      const normalizedStudent = {
        fullName: buildStudentFullName(s),
        schoolStudentId: s.schoolStudentId || "—",
        yearLevel: s.gradeLevelName || s.yearLevel || (s.isGraduate ? "Graduate" : "—"),
      };

      if (s.userId != null) {
        map[s.userId] = normalizedStudent;
      }

      // Defensive fallback for any ticket payloads keyed by Student.StudentId.
      if (s.studentId != null && map[s.studentId] == null) {
        map[s.studentId] = normalizedStudent;
      }
    });
    setStudentMap(map);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => { await fetchTickets(); })();
  }, [fetchTickets]);

  const tickets = allTickets
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
      const { error: assignError } = await updateTicketAssignedStaff(ticket.ticketId, staffId);
      if (assignError) {
        throw assignError;
      }
      await fetchTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: typeof err === "string" ? err : "Failed to assign ticket." };
    }
  }, [fetchTickets]);

  const markTicketAsHigh = useCallback(async (ticket) => {
    if (!ticket?.ticketId) {
      return { success: false, error: "Invalid ticket." };
    }

    try {
      const { error: priorityError } = await setTicketPriorityHigh(ticket.ticketId);
      if (priorityError) {
        throw priorityError;
      }

      setAllTickets((prev) =>
        prev.map((entry) =>
          entry.ticketId === ticket.ticketId
            ? { ...entry, priority: "High" }
            : entry
        )
      );

      return { success: true };
    } catch (err) {
      return { success: false, error: typeof err === "string" ? err : "Failed to update priority." };
    }
  }, []);


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
    markTicketAsHigh,
  };
}
