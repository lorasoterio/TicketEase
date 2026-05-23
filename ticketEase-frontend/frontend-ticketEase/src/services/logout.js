import client from "../api/client";

export const logoutUser = async () => {
  // Call backend logout endpoint if available
  try {
    await client.post("/auth/logout");
  } catch (err) {
    // Ignore errors, just clear session
  }
  sessionStorage.removeItem("user");
};
