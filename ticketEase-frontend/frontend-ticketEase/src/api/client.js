// src/api/client.js
import axios from "axios";

const SUCCESS_ACTION_EVENT = "app:success-action";

function defaultSuccessMessage(method) {
  switch (method) {
    case "post":
      return "Action completed successfully.";
    case "put":
    case "patch":
      return "Changes saved successfully.";
    case "delete":
      return "Deleted successfully.";
    default:
      return "Action completed successfully.";
  }
}

function resolveSuccessMessage(response, method) {
  const configMessage = response?.config?.successMessage ?? response?.config?.meta?.successMessage;
  if (typeof configMessage === "string" && configMessage.trim()) return configMessage;

  const payload = response?.data;
  if (typeof payload === "string" && payload.trim()) return payload;

  if (payload && typeof payload === "object") {
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
    if (typeof payload.successMessage === "string" && payload.successMessage.trim()) return payload.successMessage;
    if (typeof payload.title === "string" && payload.title.trim()) return payload.title;
  }

  return defaultSuccessMessage(method);
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  try {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch {
    // ignore malformed localStorage data
  }
  return config;
});

client.interceptors.response.use(
  (response) => {
    const method = (response?.config?.method || "").toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method);
    const skipSuccessNotification =
      response?.config?.skipSuccessNotification === true ||
      response?.config?.meta?.skipSuccessNotification === true;

    if (isMutating && !skipSuccessNotification && typeof window !== "undefined") {
      const message = resolveSuccessMessage(response, method);
      window.dispatchEvent(
        new CustomEvent(SUCCESS_ACTION_EVENT, {
          detail: { message },
        }),
      );
    }

    return response;
  },
  (error) => Promise.reject(error),
);

export default client;