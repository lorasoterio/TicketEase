import { useState, useEffect } from "react";
//import { useAuth } from "../../context/useAuth";

export default function useDashboard() {
  // const { user } = useAuth();

//  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      /*const { data, error } = await supabase
        .from("tickets")
        .select("id, ticket_number, subject, status, submitted_at")
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setTickets(data);
      }*/

      setLoading(false);
    };

    fetchDashboardData();
  }, [user]);

  /* ---------- STAT COUNTS ---------- */
  const stats = {
    total:       tickets.length,
    in_progress: tickets.filter((t) => t.status === "in_progress").length,
    completed:   tickets.filter((t) => t.status === "resolved" || t.status === "closed").length,
    pending:     tickets.filter((t) => t.status === "open").length,
  };

  /* ---------- RECENT TICKETS (last 3) ---------- */
  const recentTickets = tickets.slice(0, 3).map((t) => ({
    id:      t.ticket_number,
    subject: t.subject,
    status:  formatStatus(t.status),
    date:    formatDate(t.submitted_at),
  }));

  return {
    loading,
    error,
    stats,
    recentTickets,
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

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}