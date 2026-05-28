import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

/**
 * useStudentTickets — Fetches tickets for the currently authenticated student.
 * Returns only tickets where ticket.studentId === studentId.
 * @param {string|number} studentId - The student ID to filter tickets by.
 * @returns {{ tickets, loading, error, refetch }}
 */
export function useStudentTickets(studentId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const refetch = () => setFetchTrigger((n) => n + 1);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    setError("");
    client
      .get(`/tickets?studentId=${studentId}`)
      .then(({ data }) => setTickets(data))
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load tickets."))
      .finally(() => setLoading(false));
  }, [studentId, fetchTrigger]);

  return { tickets, loading, error, refetch };
}

/**
 * useStaffTickets — Fetches tickets assigned to the currently authenticated staff member.
 * Returns only tickets where ticket.assignStaffId === staffId.
 * @param {string|number} staffId - The staff ID to filter tickets by.
 * @returns {{ tickets, loading, error, refetch }}
 */
export function useStaffTickets(staffId) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const refetch = () => setFetchTrigger((n) => n + 1);

  useEffect(() => {
    if (!staffId) return;
    setLoading(true);
    setError("");
    client
      .get(`/tickets?assignStaffId=${staffId}`)
      .then(({ data }) => setTickets(data))
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load tickets."))
      .finally(() => setLoading(false));
  }, [staffId, fetchTrigger]);

  return { tickets, loading, error, refetch };
}
