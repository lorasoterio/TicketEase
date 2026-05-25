import client from "../api/client";

const BASE_URL = "/StaffGradeAssignment";

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