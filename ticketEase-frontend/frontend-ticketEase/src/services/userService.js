import client from "../api/client";

export const getAllStaff = async () => {
  const response = await client.get("/staff");
  return response.data;
};

export const getAllStudents = async () => {
  const response = await client.get("/student");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await client.get("/user");
  return response.data;
};
