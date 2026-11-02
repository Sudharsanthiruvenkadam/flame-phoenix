import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";

import StaffDashboard from "./pages/dashboard/StaffDashboard";
import StaffProjects from "./pages/dashboard/StaffProjects";

import AdminProjects from "./pages/dashboard/AdminProjects";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserManagement from "./pages/dashboard/UserManagement";
import WorkTracking from "./pages/dashboard/WorkTracking";

import AdminLayout from "./components/AdminLayout";

// =====================================================
// ROLE-BASED PORTAL ROUTING
// =====================================================

function PortalRoutes() {
  const navigate = useNavigate();

  // Load the logged-in user
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("fp_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("fp_user");
      localStorage.removeItem("fp_token");
      return null;
    }
  });

  // Validate stored session
  useEffect(() => {
    const token = localStorage.getItem("fp_token");

    if (!token || !user) {
      localStorage.removeItem("fp_token");
      localStorage.removeItem("fp_user");
      setUser(null);
      return;
    }

    const role = String(user.role || "").toUpperCase();

    if (role !== "ADMIN" && role !== "STAFF") {
      localStorage.removeItem("fp_token");
      localStorage.removeItem("fp_user");
      setUser(null);
    }
  }, []);

  // Determine the correct dashboard
  function getDashboardPath(role) {
    const normalizedRole = String(role || "").toUpperCase();

    if (normalizedRole === "ADMIN") {
      return "/admin";
    }

    if (normalizedRole === "STAFF") {
      return "/staff";
    }

    return "/login";
  }

  // Handle successful login
  function handleLogin(loggedInUser) {
    const role = String(loggedInUser?.role || "").toUpperCase();

    if (role !== "ADMIN" && role !== "STAFF") {
      localStorage.removeItem("fp_token");
      localStorage.removeItem("fp_user");
      setUser(null);
      navigate("/login", { replace: true });
      return;
    }

    const normalizedUser = {
      ...loggedInUser,
      role,
    };

    localStorage.setItem("fp_user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);

    navigate(getDashboardPath(role), { replace: true });
  }

  // Handle logout
  function handleLogout() {
    localStorage.removeItem("fp_token");
    localStorage.removeItem("fp_user");

    setUser(null);
    navigate("/login", { replace: true });
  }

  // Protect Staff and Admin routes
  function ProtectedRoute({ allowedRole, children }) {
    const token = localStorage.getItem("fp_token");
    const role = String(user?.role || "").toUpperCase();

    if (!token || !user) {
      return <Navigate to="/login" replace />;
    }

    if (role !== "ADMIN" && role !== "STAFF") {
      return <Navigate to="/login" replace />;
    }

    if (role !== allowedRole) {
      return (
        <Navigate
          to={getDashboardPath(role)}
          replace
        />
      );
    }

    return children;
  }

  // =====================================================
  // APPLICATION ROUTES
  // =====================================================

  return (
    <Routes>

      {/* ================= LOGIN ================= */}

      <Route
        path="/login"
        element={
          user && localStorage.getItem("fp_token") ? (
            <Navigate
              to={getDashboardPath(user.role)}
              replace
            />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />

      {/* ================= STAFF PORTAL ================= */}

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRole="STAFF">
            <StaffDashboard
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/projects"
        element={
          <ProtectedRoute allowedRole="STAFF">
            <StaffProjects
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN PORTAL ================= */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout
              user={user}
              onLogout={handleLogout}
            />
          </ProtectedRoute>
        }
      >

        {/* Admin Dashboard */}
        <Route
          index
          element={<AdminDashboard />}
        />

        {/* Project Management */}
        <Route
          path="projects"
          element={<AdminProjects />}
        />

        {/* All Users */}
        <Route
          path="users"
          element={<UserManagement initialRole="ALL" />}
        />

        {/* Staff Management */}
        <Route
          path="staff"
          element={<UserManagement initialRole="STAFF" />}
        />

        {/* Client Management */}
        <Route
          path="clients"
          element={<UserManagement initialRole="CLIENT" />}
        />

        {/* Work Tracking */}
        <Route
          path="tracking"
          element={<WorkTracking />}
        />

      </Route>

      {/* ================= DEFAULT ROUTES ================= */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  );
}

// =====================================================
// MAIN APPLICATION
// =====================================================

function App() {
  return (
    <BrowserRouter>
      <PortalRoutes />
    </BrowserRouter>
  );
}

export default App;
