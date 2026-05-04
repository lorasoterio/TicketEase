import client from "../api/client";

export const getAuditLogs = async () => {
  try {
    const response = await client.get("/auditlogs");
    return { data: response.data, error: null };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data || error.message;
    console.error(`[auditLogService] getAuditLogs failed — HTTP ${status ?? "network error"}:`, detail);
    if (status === 401) {
      console.warn("[auditLogService] 401 Unauthorized — token may be missing, expired, or invalid.");
    }
    return { data: null, error: detail };
  }
};

export const getAuditLogById = async (id) => {
  try {
    const response = await client.get(`/auditlogs/${id}`);
    return { data: response.data, error: null };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data || error.message;
    console.error(`[auditLogService] getAuditLogById(${id}) failed — HTTP ${status ?? "network error"}:`, detail);
    if (status === 401) {
      console.warn("[auditLogService] 401 Unauthorized — token may be missing, expired, or invalid.");
    }
    return { data: null, error: detail };
  }
};

export const createAuditLog = async ({ userId, actionType, entityType, entityId, oldValues, newValues }) => {
  try {
    const response = await client.post("/auditlogs", { userId, actionType, entityType, entityId, oldValues, newValues });
    return { data: response.data, error: null };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data || error.message;
    console.error(`[auditLogService] createAuditLog failed — HTTP ${status ?? "network error"}:`, detail);
    if (status === 401) {
      console.warn("[auditLogService] 401 Unauthorized — token may be missing, expired, or invalid.");
    }
    return { data: null, error: detail };
  }
};
