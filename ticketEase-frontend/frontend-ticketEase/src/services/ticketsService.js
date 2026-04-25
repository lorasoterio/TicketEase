import client from "../api/client";

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
    const response = await client.get(`/tickets?userId=${userId}`);
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
