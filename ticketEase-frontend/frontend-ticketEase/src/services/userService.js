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

export const verifyStudent = async (studentId) => {
  const response = await client.patch(`/student/${studentId}/verify`);
  return response.data;
};

export const unverifyStudent = async (studentId) => {
  const response = await client.patch(`/student/${studentId}/unverify`);
  return response.data;
};

export const deleteStudent = async (studentId) => {
  const response = await client.delete(`/student/${studentId}`);
  return response.data;
};
