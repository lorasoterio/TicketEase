import { useState, useMemo } from "react";

/* mock records */
const MOCK_TICKETS = [
  {
    id: "#1042",
    subject: "Request for Form 137",
    status: "In progress",
    updatedAt: "Mar 24, 2026 — 02:31 PM",
    assignedStaff: {
      name: "Maria Santos",
      department: "Registrar Office",
      email: "registrar@school.edu",
    },
    eta: "Expected completion within 2–3 working days",
    timeline: [
      { label: "Submitted", date: "Mar 22, 2026 — 09:14 AM", done: true },
      { label: "In progress", date: "Mar 24, 2026 — 02:31 PM", done: true },
      { label: "Completed", date: null, done: false },
    ],
  },
  {
    id: "#1058",
    subject: "Enrollment Inquiry",
    status: "Pending",
    updatedAt: "Mar 25, 2026 — 10:02 AM",
    assignedStaff: null,
    eta: null,
    timeline: [
      { label: "Submitted", date: "Mar 25, 2026", done: true },
      { label: "In progress", date: null, done: false },
      { label: "Completed", date: null, done: false },
    ],
  },
];

export default function useTrackStatus() {
  const [search, setSearch] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const tickets = useMemo(() => {
    return MOCK_TICKETS.filter(
      (t) =>
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  function selectTicket(ticket) {
    setSelectedTicket(ticket);
  }

  return {
    search,
    setSearch,
    tickets,
    selectedTicket,
    selectTicket,
  };
}