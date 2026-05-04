import { useState, useEffect, useCallback, useMemo } from "react";
import { getAuditLogs, createAuditLog } from "../../services/auditLogService";

const PAGE_SIZE = 10;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function useAuditLogs() {
  const [rawLogs, setRawLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [page, setPage] = useState(1);

  const [detailLog, setDetailLog] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await getAuditLogs();
      if (fetchErr) throw new Error(typeof fetchErr === "string" ? fetchErr : "Failed to load audit logs.");
      setRawLogs(data || []);
    } catch (err) {
      setError(err.message ?? "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [search, actionFilter, entityFilter]);

  const actionTypes = useMemo(() => {
    const set = new Set(rawLogs.map((l) => l.actionType).filter(Boolean));
    return [...set].sort();
  }, [rawLogs]);

  const entityTypes = useMemo(() => {
    const set = new Set(rawLogs.map((l) => l.entityType).filter(Boolean));
    return [...set].sort();
  }, [rawLogs]);

  const filtered = useMemo(() => {
    return rawLogs.filter((l) => {
      if (actionFilter && l.actionType !== actionFilter) return false;
      if (entityFilter && l.entityType !== entityFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const email = (l.userEmail ?? "").toLowerCase();
        const action = (l.actionType ?? "").toLowerCase();
        const entity = (l.entityType ?? "").toLowerCase();
        if (!email.includes(q) && !action.includes(q) && !entity.includes(q) && !String(l.logId).includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [rawLogs, search, actionFilter, entityFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((l) => ({
    ...l,
    formattedDate: formatDate(l.createdAt),
  }));

  const logAuditEntry = useCallback(async ({ userId, actionType, entityType, entityId, oldValues, newValues } = {}) => {
    const { error: logErr } = await createAuditLog({ userId, actionType, entityType, entityId, oldValues, newValues });
    if (logErr) {
      console.error("[useAuditLogs] logAuditEntry failed:", logErr);
    }
  }, []);

  return {
    rows,
    loading,
    error,
    search,
    setSearch,
    actionFilter,
    setActionFilter,
    entityFilter,
    setEntityFilter,
    actionTypes,
    entityTypes,
    page,
    setPage,
    totalPages,
    total: filtered.length,
    detailLog,
    setDetailLog,
    refetch: fetchData,
    logAuditEntry,
  };
}
