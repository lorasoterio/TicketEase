import { useState, useEffect, useCallback } from "react";
import { getTicketAttachments, createAttachment } from "../../services/ticketsService";
import { createAuditLog } from "../../services/auditLogService";
import { useAuth } from "../../context/useAuth";

/**
 * Fetches attachments for a given ticket ID and exposes an `upload` action
 * that saves an attachment record to the backend with full tracking logs.
 *
 * Console logs let you verify whether the backend actually persisted the file:
 *   [useTicketAttachments] upload → starting …
 *   [attachmentService]    createAttachment → requesting backend save …
 *   [attachmentService]    createAttachment → backend confirmed save ✓  (or FAILED)
 *   [useTicketAttachments] upload → backend confirmed, attachment visible in list ✓
 *
 * An audit log entry (actionType: "ATTACHMENT_UPLOADED") is written on success.
 *
 * Returns an empty array and no error when ticketId is null/undefined.
 */
export default function useTicketAttachments(ticketId) {
  const { user } = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    console.log("[useTicketAttachments] fetch → called with ticketId:", ticketId);
    if (!ticketId) {
      console.log("[useTicketAttachments] fetch → ticketId is null/undefined, skipping.");
      setAttachments([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await getTicketAttachments(ticketId);
    if (err) {
      console.error("[useTicketAttachments] fetch → error from service:", err);
      setError("Failed to load attachments.");
      setAttachments([]);
    } else {
      console.log("[useTicketAttachments] fetch → received data:", data);
      console.log("[useTicketAttachments] fetch → setting attachments count:", (data || []).length);
      setAttachments(data || []);
    }
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  /**
   * Saves an attachment record to the backend and tracks the result.
   *
   * @param {{ fileUrl: string, fileName: string, fileType: string, messageId?: number }} params
   * @returns {Promise<{ success: boolean, data?: Object, error?: string }>}
   */
  const upload = useCallback(
    async ({ fileUrl, fileName, fileType, messageId }) => {
      setUploading(true);
      console.log("[useTicketAttachments] upload → starting:", {
        fileName,
        fileType,
        ticketId,
        messageId: messageId ?? null,
      });

      const { data, error: err } = await createAttachment({
        fileUrl,
        fileName,
        fileType,
        ticketId,
        messageId,
      });

      if (err) {
        console.error("[useTicketAttachments] upload → backend save FAILED:", err);
        setUploading(false);
        return { success: false, error: typeof err === "string" ? err : "Failed to save attachment." };
      }

      // Refresh list so we can confirm the record appears in the backend response
      await fetch();
      console.log("[useTicketAttachments] upload → backend confirmed, attachment visible in list ✓", {
        attachmentId: data.attachmentId,
        fileName: data.fileName,
      });

      // Persist an audit trail entry for this upload
      await createAuditLog({
        userId: user?.userId ?? null,
        actionType: "ATTACHMENT_UPLOADED",
        entityType: "Attachment",
        entityId: data.attachmentId ?? null,
        oldValues: null,
        newValues: { fileName, fileType, ticketId, messageId: messageId ?? null },
      });

      setUploading(false);
      return { success: true, data };
    },
    [ticketId, user?.userId, fetch]
  );

  return { attachments, loading, uploading, error, upload };
}
