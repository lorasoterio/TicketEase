import client from "../api/client";
/**
 * Fetches tickets assigned to a specific staff member (admin/staff use).
 * @param {number|string} staffId - The ID of the staff member.
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getTicketsByStaff = async (staffId) => {
  try {
    const response = await client.get(`/tickets/staff/${staffId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Fetches tickets for a specific student (admin/staff use).
 * @param {number|string} studentId - The ID of the student.
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getTicketsByStudent = async (studentId) => {
  try {
    const response = await client.get(`/tickets/student/${studentId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};


/**
 * Submits a new ticket to the backend API.
 * @param {Object} ticketData - The ticket data to submit.
 * @returns {Promise<{data: Object, error: Object}>} - The response data or error.
 */
export const submitTicket = async (ticketData) => {
  try {
    const response = await client.post('/tickets', ticketData);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Fetches tickets for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{data: Array, error: Object}>} - The tickets data or error.
 */
export const getTicketsByUser = async (userId) => {
  try {
    const response = await client.get(`/tickets?studentId=${userId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};


/**
 * Fetches all tickets (for admin use).
 * @returns {Promise<{data: Array, error: Object}>} - All tickets data or error.
 */
export const getAllTickets = async () => {
  try {
    const response = await client.get('/tickets');
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Assigns a staff member to a ticket.
 * @param {number} ticketId - The ID of the ticket.
 * @param {number} staffId - The ID of the staff to assign.
 * @param {Object} ticketData - The full current ticket object (required for PUT).
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const assignTicket = async (ticketId, staffId, ticketData) => {
  try {
    const response = await client.put(`/tickets/${ticketId}`, {
      ...ticketData,
      assignedStaffId: staffId,
      status: 'Assigned',
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Updates the status of a ticket.
 * @param {number} ticketId - The ID of the ticket.
 * @param {string} newStatus - The new status to apply.
 * @param {Object} ticketData - The full current ticket object (required for PUT).
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const updateTicketStatus = async (ticketId, newStatus, ticketData) => {
  try {
    const response = await client.put(`/tickets/${ticketId}`, {
      ...ticketData,
      status: newStatus,
    });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

/**
 * Fetches all attachments for a specific ticket.
 * @param {number} ticketId - The ID of the ticket.
 * @returns {Promise<{data: Array, error: Object}>}
 */
export const getTicketAttachments = async (ticketId) => {
  console.log(`[attachmentService] getTicketAttachments → fetching for ticketId: ${ticketId}`);
  try {
    const response = await client.get(`/Attachment/ticket/${ticketId}`);
    console.log(`[attachmentService] getTicketAttachments → HTTP ${response.status}, count: ${Array.isArray(response.data) ? response.data.length : "(not array)"}, raw:`, response.data);
    return { data: response.data, error: null };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data || error.message;
    console.error(`[attachmentService] getTicketAttachments → FAILED (HTTP ${status ?? "network error"}):`, detail);
    return { data: null, error: detail };
  }
};

/**
 * Saves an attachment record to the backend after a file has been uploaded to storage.
 * Logs the request, the backend response, and any failure details to the console so
 * you can verify whether the record was actually persisted.
 *
 * @param {{ fileUrl: string, fileName: string, fileType: string, ticketId: number, messageId?: number }} params
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export const createAttachment = async ({ fileUrl, fileName, fileType, ticketId, messageId }) => {
  console.log("[attachmentService] createAttachment → requesting backend save:", {
    fileName,
    fileType,
    ticketId,
    messageId: messageId ?? null,
  });

  try {
    const response = await client.post("/Attachment", {
      fileUrl,
      fileName,
      fileType,
      ticketId,
      messageId: messageId ?? null,
    });

    console.log("[attachmentService] createAttachment → backend confirmed save ✓", {
      attachmentId: response.data?.attachmentId,
      fileName: response.data?.fileName,
      ticketId: response.data?.ticketId,
      httpStatus: response.status,
    });

    return { data: response.data, error: null };
  } catch (error) {
    const status = error.response?.status;
    const detail = error.response?.data || error.message;
    console.error(
      `[attachmentService] createAttachment → backend save FAILED (HTTP ${status ?? "network error"}):`,
      detail
    );
    return { data: null, error: detail };
  }
};
