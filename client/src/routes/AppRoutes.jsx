import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Services from "../pages/Services";
import Projects from "../pages/Projects";
import Contact from "../pages/Contact";
import Dashboard from "../pages/dashboard/Dashboard";
import ProjectsWorkspace from "../pages/dashboard/ProjectsWorkspace";
import ProjectDetails from "../pages/dashboard/ProjectDetails";
import AdminProjects from "../pages/dashboard/AdminProjects";
import StaffProjects from "../pages/dashboard/StaffProjects";
import UserManagement from "../pages/dashboard/UserManagement";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login/:role" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Client pages */}
        <Route
          path="/dashboard/projects"
          element={<ProjectsWorkspace />}
        />
        <Route
          path="/dashboard/projects/:id"
          element={<ProjectDetails />}
        />

        {/* Admin pages */}
        <Route
          path="/dashboard/admin/projects"
          element={<AdminProjects />}
        />
        <Route
          path="/dashboard/admin/users"
          element={<UserManagement />}
        />

        {/* Staff pages */}
        <Route
          path="/dashboard/staff/projects"
          element={<StaffProjects />}
        />

        {/* Page not found */}
        <Route
          path="*"
          element={
            <main style={{ padding: "40px", textAlign: "center" }}>
              <h1>Page not found</h1>
              <a href="/">Return to Home</a>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;