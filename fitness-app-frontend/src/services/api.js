import axios from "axios";
import keycloak from "../keycloak";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 REQUEST INTERCEPTOR
api.interceptors.request.use(async (config) => {
  if (keycloak?.token) {
    try {
      await keycloak.updateToken(30);
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (err) {
      console.error("Token refresh failed");
      keycloak.logout();
    }
  }
  return config;
});

// ❌ ERROR HANDLING FIX
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err?.response || err);

    if (err?.response?.status === 401) {
      keycloak.logout();
    }

    return Promise.reject(err);
  }
);

// =========================
// ACTIVITY APIs
// =========================
export const addActivity = (data) => api.post("/api/activities", data);
export const getActivities = () => api.get("/api/activities");
export const getActivityDetail = (id) =>
  api.get(`/api/activities/id/${id}`);

// =========================
// AI APIs
// =========================
export const getAIRecommendation = (data) =>
  api.post("/api/ai/analyze", data);

export const chatWithAI = (message) =>
  api.post("/api/ai/chat", { message });

// =========================
// PDF
// =========================
export const generateReport = (content) =>
  api.post("/api/report", content, {
    responseType: "blob",
  });

export default api;