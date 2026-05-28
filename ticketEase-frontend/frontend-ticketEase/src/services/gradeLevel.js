import Client from '../api/Client';

const API_URL = '/GradeLevel';

export const getGradeLevels = async () => {
	const response = await Client.get(API_URL);
	return response.data;
};

export const getGradeLevel = async (id) => {
	const response = await Client.get(`${API_URL}/${id}`);
	return response.data;
};

export const createGradeLevel = async (gradeLevelDto) => {
	const response = await Client.post(API_URL, gradeLevelDto);
	return response.data;
};

export const updateGradeLevel = async (id, gradeLevelDto) => {
	const response = await Client.put(`${API_URL}/${id}`, gradeLevelDto);
	return response.data;
};

export const deleteGradeLevel = async (id) => {
	const response = await Client.delete(`${API_URL}/${id}`);
	return response.data;
};
