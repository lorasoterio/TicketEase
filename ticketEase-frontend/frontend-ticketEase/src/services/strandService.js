import Client from '../api/Client';

const API_URL = '/Strand';

export const getStrands = async () => {
	const response = await Client.get(API_URL);
	return response.data;
};

export const getStrand = async (id) => {
	const response = await Client.get(`${API_URL}/${id}`);
	return response.data;
};

export const createStrand = async (strand) => {
	const response = await Client.post(API_URL, strand);
	return response.data;
};

export const updateStrand = async (id, strand) => {
	await Client.put(`${API_URL}/${id}`, strand);
};

export const deleteStrand = async (id) => {
	await Client.delete(`${API_URL}/${id}`);
};
