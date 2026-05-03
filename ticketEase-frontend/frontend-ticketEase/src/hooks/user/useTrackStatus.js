import { useState, useEffect, useMemo } from "react";
import client from "../../api/client";

const STATUS_LABEL = {
  Open: "Pending",
  Pending: "Pending",
  Assigned: "In progress",
  InProgress: "In progress",
  ReadyForPickup: "In progress",
  Responded: "In progress",
  Completed: "Completed",
  Closed: "Completed",
  Rejected: "Rejected",
};

const IN_PROGRESS_STATUSES = new Set([
  "Assigned",
  "InProgress",
  "ReadyForPickup",
  "Responded",
]);

const COMPLETED_STATUSES = new Set(["Completed", "Closed"]);

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
  const inProgress = IN_PROGRESS_STATUSES.has(ticket.status);
  const completed = COMPLETED_STATUSES.has(ticket.status);
  return [
    { label: "Submitted", date: formatDate(ticket.createdAt), done: true },
    {
      label: "In progress",
      date: inProgress ? formatDate(ticket.updatedAt) : null,
      done: inProgress,
    },
    {
      label: "Completed",
      date: completed ? formatDate(ticket.updatedAt) : null,
      done: completed,
    },
  ];
}

function mapTicket(ticket, staffMap) {
  const staff = ticket.assignedStaffId ? staffMap[ticket.assignedStaffId] : null;
  return {
    id: ticket.referenceNumber ?? `#${ticket.ticketId}`,
    subject: ticket.subject ?? "",
    status: STATUS_LABEL[ticket.status] ?? ticket.status,
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