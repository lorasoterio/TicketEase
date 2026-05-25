import Client from "../api/client";

const BASE_URL = "/gradelevel";

// Get all grade levels
export const getAllGradeLevels = () => Client.get(`${BASE_URL}`);
