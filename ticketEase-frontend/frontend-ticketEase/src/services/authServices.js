import client from "../api/client";

/**
 * Register new user
 */
export const registerUser = async (data) => {
  const response = await client.post("/auth/register", {
    FirstName: data.firstName,
    LastName: data.lastName,
    Email: data.email,
    Password: data.password,
  });

  return response.data;
};

/**
 * Login user
 */
export const loginUser = async (data) => {
  const response = await client.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;
};
