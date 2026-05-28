import client from "../api/client";

/**
 * Fetches the student profile linked to the given userId.
 * @param {number} userId - The user's ID from the auth context.
 * @returns {Promise<{data: Object, error: Object}>}
 */
export const getStudentByUserId = async (userId) => {
  try {
    const response = await client.get(`/student/user/${userId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await client.get(`/student/${studentId}`);
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};

export const getAllStudents = async () => {
  try {
    const response = await client.get("/student");  
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data || error.message };
  }
};
