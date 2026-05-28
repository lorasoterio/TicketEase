
import client from "../api/client";

const BASE_URL = "/StaffGradeAssignment";

export const assignGradeRepresentative = async ({ staffId, gradeLevelId }) => {
  try {
    let payload = { staffId };
    if (gradeLevelId === "graduate") {
      payload.isGraduate = true;
    } else {
      payload.gradeLevelId = gradeLevelId;
    }
    const response = await client.post(`${BASE_URL}/assign`, payload);
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Failed to assign grade representative.";
    throw new Error(message);
  }
};

// Get all assignments
export const getAllAssignments = async () => {
	const response = await client.get(BASE_URL);
	return response.data;
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
	const response = await client.get(`${BASE_URL}/${id}`);
	return response.data;
};

// Create assignment
export const createAssignment = async (assignment) => {
	const response = await client.post(BASE_URL, assignment);
	return response.data;
};

export const assignStaff = async (data) => {
  try {
    const response = await client.post(`${BASE_URL}/assign`, {
      email: data.email,
      password: data.password,
      schoolStudentId: data.schoolStudentId,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      suffix: data.suffix,
      strandId: data.strandId,
      gradeLevelId: data.gradeLevelId,
    });
    return response.data;
  } catch (err) {
    // Forward backend error message if present
    const message = err?.response?.data?.message || "Registration failed.";
    throw new Error(message);
  }
};

// Update assignment
export const updateAssignment = async (id, assignment) => {
	const response = await client.put(`${BASE_URL}/${id}`, assignment);
	return response.data;
};

// Delete assignment
export const deleteAssignment = async (id) => {
	const response = await client.delete(`${BASE_URL}/${id}`);
	return response.data;
};