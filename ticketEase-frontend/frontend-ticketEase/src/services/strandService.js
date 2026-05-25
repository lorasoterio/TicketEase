import Client from "../apiClient";

const BASE_URL = "/strand";

// Get all strands
export const getStrands = async () => {
	const response = await Client.get(BASE_URL);
	return response.data;
};

// Get a single strand by ID
export const getStrand = async (id) => {
	const response = await Client.get(`${BASE_URL}/${id}`);
	return response.data;
};

// Create a new strand
export const createStrand = async (strandDto) => {
	const response = await Client.post(BASE_URL, strandDto);
	return response.data;
};

// Update a strand by ID
export const updateStrand = async (id, strandDto) => {
	await Client.put(`${BASE_URL}/${id}`, strandDto);
};

// Delete a strand by ID
export const deleteStrand = async (id) => {
	await Client.delete(`${BASE_URL}/${id}`);
};

