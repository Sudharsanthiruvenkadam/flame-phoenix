import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban,
  Users,
  UserRound,
  Clock,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

import { getAdminProjects, getAdminUsers } from "../../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [projectResponse, userResponse] = await Promise.all([
        getAdminProjects(),
        getAdminUsers(),
      ]);

      setProjects(projectResponse?.projects || []);
      setUsers(userResponse?.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const clients = users.filter((user) => user.role === "CLIENT");
  const staff = users.filter((user) => user.role === "STAFF");

  const activeProjects = projects.filter((project) =>
    ["IN_PROGRESS", "TESTING", "PLANNING", "UNDER_REVIEW"].includes(
      project.status
    )
  );

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      link: "/admin/projects",
    },
    {
      title: "Total Clients",
      value: clients.length,
      icon: Users,
      link: "/admin/clients",
    },
    {
      title: "Total Staff",
      value: staff.length,
      icon: UserRound,
      link: "/admin/staff",
    },
    {
      title: "Active Projects",
      value: activeProjects.length,
      icon: Clock,
      link: "/admin/tracking",
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">ADMINISTRATION</span>
          <h1>Dashboard Overview</h1>
          <p>Monitor projects, clients, staff and ongoing work.</p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && <div className="admin-dashboard-error">{error}</div>}

      <div className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link to={stat.link} className="admin-stat-card" key={stat.title}>
              <div className="admin-stat-icon">
                <Icon size={22} />
              </div>
              <div>
                <p>{stat.title}</p>
                <h2>{loading ? "..." : stat.value}</h2>
              </div>
              <ArrowRight className="admin-stat-arrow" size={18} />
            </Link>
          );
        })}
      </div>

      <section className="admin-recent-section">
        <div className="admin-section-heading">
          <div>
            <h2>Recent Projects</h2>
            <p>Latest projects submitted by clients.</p>
          </div>
          <Link to="/admin/projects" className="admin-view-all">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <p className="admin-empty-message">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="admin-empty-message">No projects available yet.</p>
        ) : (
          <div className="admin-project-table-wrap">
            <table className="admin-project-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((project) => (
                  <tr key={project._id || project.id}>
                    <td>
                      <strong>{project.name || "Untitled Project"}</strong>
                    </td>
                    <td>
                      {project.client?.name ||
                        project.client?.email ||
                        "Not available"}
                    </td>
                    <td>
                      <span
                        className={`admin-status-pill ${(project.status || "unknown").toLowerCase()}`}
                      >
                        {(project.status || "UNKNOWN").replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
