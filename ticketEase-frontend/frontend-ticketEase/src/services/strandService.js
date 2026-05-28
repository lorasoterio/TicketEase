import axios from 'axios';

const API_URL = '/api/Strand';

export const getStrands = async () => {
	const response = await axios.get(API_URL);
	return response.data;
};

export const getStrand = async (id) => {
	const response = await axios.get(`${API_URL}/${id}`);
	return response.data;
};

export const createStrand = async (strand) => {
	const response = await axios.post(API_URL, strand);
	return response.data;
};

export const updateStrand = async (id, strand) => {
	await axios.put(`${API_URL}/${id}`, strand);
};

export const deleteStrand = async (id) => {
	await axios.delete(`${API_URL}/${id}`);
};
