import client from "../api/client";

export const fetchStrands = async () => {
  const response = await client.get("/Strand");
  return response.data;
};

export const fetchGradeLevels = async () => {
  const response = await client.get("/GradeLevel");
  return response.data;
};
