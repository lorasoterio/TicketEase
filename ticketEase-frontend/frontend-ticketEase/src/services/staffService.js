import Client from "../api/client";

const BASE_URL = "/staff";

// Get all staff
export const getAllStaff = () => Client.get(`${BASE_URL}`);

// Get staff by staff ID
export const getStaffById = (id) => Client.get(`${BASE_URL}/${id}`);

// Get staff by user ID
export const getStaffByUserId = (userId) => Client.get(`${BASE_URL}/user/${userId}`);

// Get active staff
export const getActiveStaff = () => Client.get(`${BASE_URL}/active`);

// Get inactive staff
export const getInactiveStaff = () => Client.get(`${BASE_URL}/inactive`);

// Get staff by position
export const getStaffByPosition = (position) => Client.get(`${BASE_URL}/position/${encodeURIComponent(position)}`);

// Create staff
export const createStaff = (data) => Client.post(`${BASE_URL}`, data);

// Update staff
export const updateStaff = (id, data) => Client.put(`${BASE_URL}/${id}`, data);

// Activate staff
export const activateStaff = (id) => Client.patch(`${BASE_URL}/${id}/activate`);

// Deactivate staff
export const deactivateStaff = (id) => Client.patch(`${BASE_URL}/${id}/deactivate`);

// Delete staff
export const deleteStaff = (id) => Client.delete(`${BASE_URL}/${id}`);