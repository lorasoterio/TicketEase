import { useState, useEffect, useMemo } from "react";
import client from "../../api/client";

// Ordered by enum value (0–6) — matches backend TicketStatus enum
const STATUS_BY_NUMBER = [
  "Pending",        // 0
  "Assigned",       // 1
  "InProgress",     // 2
  "ReadyForPickup", // 3
  "Rejected",       // 4
  "Responded",      // 5
  "Closed",         // 6
];

// Normalizes numeric or string status → canonical string key
function normalizeStatus(status) {
  if (typeof status === "number") return STATUS_BY_NUMBER[status] ?? String(status);
  return status;
}

// Maps canonical status key → display label shown in the UI
const STATUS_LABEL = {
  Pending:        "Pending",
  Assigned:       "Assigned",
  InProgress:     "In Progress",
  ReadyForPickup: "Ready for Pickup",
  Rejected:       "Rejected",
  Responded:      "Responded",
  Closed:         "Closed",
};

// Rank determines how far along the ticket is in the workflow
const STATUS_RANK = {
  Pending:        0,
  Assigned:       1,
  InProgress:     2,
  ReadyForPickup: 3,
  Responded:      3,
  Closed:         4,
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month} ${day}, ${year} — ${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

function buildTimeline(ticket) {
  const status = normalizeStatus(ticket.status);
  const rejected = status === "Rejected";
  const rank = rejected ? -1 : (STATUS_RANK[status] ?? 0);
  const isDocumentRequest =
    ticket.ticketType === "DocumentRequest" || ticket.ticketType === 0;

  const updatedDate = formatDate(ticket.updatedAt);

  const steps = [
    { label: "Submitted",    date: formatDate(ticket.createdAt), done: true },
    { label: "Assigned",     date: rank >= 1 ? updatedDate : null, done: rank >= 1 },
    { label: "In Progress",  date: rank >= 2 ? updatedDate : null, done: rank >= 2 },
    isDocumentRequest
      ? { label: "Ready for Pickup", date: rank >= 3 ? updatedDate : null, done: rank >= 3 }
      : { label: "Responded",        date: rank >= 3 ? updatedDate : null, done: rank >= 3 },
  ];

  if (rejected) {
    steps.push({ label: "Rejected",  date: updatedDate, done: true });
  } else {
    steps.push({ label: "Closed",    date: rank >= 4 ? updatedDate : null, done: rank >= 4 });
  }

  return steps;
}

function mapTicket(ticket, staffMap) {
  const statusKey = normalizeStatus(ticket.status);
  const staff = ticket.assignedStaffId ? staffMap[ticket.assignedStaffId] : null;
  return {
    id: ticket.referenceNumber ?? `#${ticket.ticketId}`,
    subject: ticket.subject ?? "",
    ticketType: ticket.ticketType,
    status: STATUS_LABEL[statusKey] ?? statusKey,
    updatedAt: formatDate(ticket.updatedAt),
    assignedStaff: staff
      ? {
          name: staff.fullName,
          department: staff.department,
          email: staff.userEmail,
        }
      : null,
    eta: ticket.estimatedCompletion
      ? `Expected completion by ${formatDate(ticket.estimatedCompletion)}`
      : null,
    timeline: buildTimeline(ticket),
  };
}

export default function useTrackStatus() {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [rawTickets, setRawTickets] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: ticketList } = await client.get("/tickets");

        if (cancelled) return;

        // Collect unique assigned staff user IDs
        const staffIds = [
          ...new Set(
            ticketList
              .map((t) => t.assignedStaffId)
              .filter((id) => id != null)
          ),
        ];

        // Fetch all staff once and index by user ID to avoid N+1 requests
        const { data: staffList } = await client.get("/staff");

        if (cancelled) return;

        const staffMap = Object.fromEntries(
          staffIds.map((id) => {
            const staff =
              staffList.find((entry) => entry?.userId === id) ??
              staffList.find((entry) => entry?.user?.id === id) ??
              null;

            return [id, staff];
          })
        );

        setStaffMap(staffMap);
        setRawTickets(ticketList);
      } catch (err) {
        if (!cancelled)
          setError(err?.response?.data?.message ?? "Failed to load tickets.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const tickets = useMemo(() => {
    return rawTickets
      .map((t) => mapTicket(t, staffMap))
      .filter(
        (t) =>
          t.id.toLowerCase().includes(search.toLowerCase()) ||
          t.subject.toLowerCase().includes(search.toLowerCase())
      );
  }, [rawTickets, staffMap, search]);

  function selectTicket(ticket) {
    setSelectedTicket(ticket);
  }

  return {
    search,
    setSearch,
    tickets,
    selectedTicket,
    selectTicket,
    loading,
    error,
  };
}