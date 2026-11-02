
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved authentication token.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fp_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Authentication
export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Admin APIs
export async function getAdminProjects() {
  const response = await api.get("/admin/projects");
  return response.data;
}

export async function getAdminStaff() {
  const response = await api.get("/admin/staff");
  return response.data;
}

export async function getAdminUsers(params = {}) {
  const response = await api.get("/admin/users", { params });
  return response.data;
}

export async function createAdminStaff(staffData) {
  const response = await api.post("/admin/staff", staffData);
  return response.data;
}

export async function assignProjectToStaff(projectId, staffId) {
  const response = await api.patch(
    `/admin/projects/${encodeURIComponent(projectId)}/assign`,
    { staffId }
  );
  return response.data;
}

// Staff APIs
export async function getAssignedProjects() {
  const response = await api.get("/staff/assigned");
  return response.data;
}

export async function updateAssignedProjectStatus(projectId, status) {
  const response = await api.patch(
    `/staff/${encodeURIComponent(projectId)}/status`,
    { status }
  );
  return response.data;
}

export default api;
