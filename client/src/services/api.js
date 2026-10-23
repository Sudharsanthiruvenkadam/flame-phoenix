
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the saved login token to protected API requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fp_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Authentication APIs
export async function registerUser(userData) {
  const response = await api.post("/auth/register", userData);
  return response.data;
}

export async function loginUser(credentials) {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

// Client project APIs
export async function createProject(projectData) {
  const response = await api.post("/projects", projectData);
  return response.data;
}

export async function getMyProjects() {
  const response = await api.get("/projects/my");
  return response.data;
}

// Fetch one project belonging to the signed-in client.
export async function getMyProjectById(projectId) {
  const response = await api.get(
    `/projects/${encodeURIComponent(projectId)}`
  );
  return response.data;
}

// Admin APIs: projects, users, and staff.
export async function getAdminProjects() {
  const response = await api.get("/admin/projects");
  return response.data;
}

export async function getAdminStaff() {
  const response = await api.get("/admin/staff");
  return response.data;
}

// Fetch all users with optional role, status, and search filters.
export async function getAdminUsers(params = {}) {
  const response = await api.get("/admin/users", { params });
  return response.data;
}

// Create a staff account.
export async function createAdminStaff(staffData) {
  const response = await api.post("/admin/staff", staffData);
  return response.data;
}

// Assign or unassign a project.
export async function assignProjectToStaff(projectId, staffId) {
  const response = await api.patch(
    `/admin/projects/${encodeURIComponent(projectId)}/assign`,
    { staffId }
  );
  return response.data;
}

// Staff APIs: assigned projects and status updates.
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
