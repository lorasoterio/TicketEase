import client from "../api/client";

export const logoutUser = async () => {
  // Call backend logout endpoint if available
  try {
    await client.post("/auth/logout");
  } catch (err) {
    // Ignore errors, just clear session
  }
  // Remove user and token from both sessionStorage and localStorage
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
