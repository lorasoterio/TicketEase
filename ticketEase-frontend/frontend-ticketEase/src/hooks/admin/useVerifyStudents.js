import { useState, useEffect, useCallback, useMemo } from "react";
import { getAllStudents, verifyStudent, unverifyStudent, deleteStudent } from "../../services/userService";

const PAGE_SIZE = 8;

const buildFullName = (student) =>
  (
    student.fullName ||
    [student.firstName, student.middleName, student.lastName, student.suffix]
      .filter(Boolean)
      .join(" ")
  ).trim();

export default function useVerifyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // { studentId, action }

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "verified" | "unverified"
  const [page, setPage] = useState(1);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllStudents();
      setStudents(data || []);
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message ?? "Failed to load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        if (filter === "verified") return s.isVerified;
        if (filter === "unverified") return !s.isVerified;
        return true;
      })
      .filter((s) => {
        if (!search) return true;
        const q = search.toLowerCase();
        const fullName = buildFullName(s).toLowerCase();
        const strand = (s.strandName ?? s.courseProgram ?? "").toLowerCase();
        const yearLevel = (s.gradeLevelName ?? s.yearLevel ?? "").toLowerCase();
        return (
          fullName.includes(q) ||
          (s.schoolStudentId ?? "").toLowerCase().includes(q) ||
          strand.includes(q) ||
          yearLevel.includes(q) ||
          (s.userEmail ?? "").toLowerCase().includes(q)
        );
      });
  }, [students, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleVerify = useCallback(async (studentId) => {
    setActionLoading({ studentId, action: "verify" });
    try {
      await verifyStudent(studentId);
      setStudents((prev) =>
        prev.map((s) => s.studentId === studentId ? { ...s, isVerified: true } : s)
      );
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message ?? "Failed to verify student.");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleUnverify = useCallback(async (studentId) => {
    setActionLoading({ studentId, action: "unverify" });
    try {
      await unverifyStudent(studentId);
      setStudents((prev) =>
        prev.map((s) => s.studentId === studentId ? { ...s, isVerified: false } : s)
      );
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message ?? "Failed to unverify student.");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleRemove = useCallback(async (studentId) => {
    setActionLoading({ studentId, action: "remove" });
    try {
      await deleteStudent(studentId);
      setStudents((prev) => prev.filter((s) => s.studentId !== studentId));
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message ?? "Failed to remove student.");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const verifiedCount = students.filter((s) => s.isVerified).length;
  const unverifiedCount = students.filter((s) => !s.isVerified).length;

  return {
    students: paginated,
    loading,
    error,
    actionLoading,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    total: filtered.length,
    verifiedCount,
    unverifiedCount,
    handleVerify,
    handleUnverify,
    handleRemove,
    refetch: fetchStudents,
  };
}
