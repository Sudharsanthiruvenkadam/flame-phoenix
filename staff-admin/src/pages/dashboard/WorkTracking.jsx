import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminProjects,
  getAdminStaff,
} from "../../services/api";
import "./WorkTracking.css";

const STATUS_OPTIONS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "PLANNING",
  "IN_PROGRESS",
  "TESTING",
  "CLIENT_REVIEW",
  "CHANGES_REQUESTED",
  "APPROVED",
  "DELIVERED",
  "ON_HOLD",
  "CANCELLED",
];

function formatDate(date) {
  if (!date) return "Not set";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "Not set";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status) {
  return (status || "UNKNOWN")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function WorkTracking() {
  const [projects, setProjects] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [employeeFilter, setEmployeeFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTrackingData() {
    try {
      setLoading(true);
      setError("");

      const [projectResponse, employeeResponse] = await Promise.all([
        getAdminProjects(),
        getAdminStaff(),
      ]);

      setProjects(projectResponse.projects || []);
      setEmployee(employeeResponse.employee || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load work tracking details."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrackingData();
  }, []);

  const filteredProjects = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !searchText ||
        project.name?.toLowerCase().includes(searchText) ||
        project.client?.name?.toLowerCase().includes(searchText) ||
        project.assignedEmployee?.name?.toLowerCase().includes(searchText) ||
        project.assignedEmployee?.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;

      const matchesEmployee =
        employeeFilter === "ALL" ||
        (employeeFilter === "UNASSIGNED"
          ? !project.assignedEmployee
          : project.assignedEmployee?.id === employeeFilter);

      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [projects, search, statusFilter, employeeFilter]);

  const inProgressCount = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const completedCount = projects.filter(
    (project) => project.status === "DELIVERED"
  ).length;

  const assignedCount = projects.filter(
    (project) => project.assignedEmployee
  ).length;

  const assignedEmployeeCount = new Set(
    projects
      .map((project) => project.assignedEmployee?.id)
      .filter(Boolean)
  ).size;

  return (
    <div className="work-tracking-page">
      <div className="tracking-header">
        <div>
          <Link to="/admin" className="tracking-back-link">
            ← Back to Dashboard
          </Link>

          <p className="tracking-eyebrow">ADMIN CONTROL CENTER</p>
          <h1>Work Tracking</h1>
          <p className="tracking-subtitle">
            Monitor project progress, employee assignments and deadlines.
          </p>
        </div>

        <button
          className="tracking-refresh-button"
          onClick={loadTrackingData}
          disabled={loading}
        >
          ↻ {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="tracking-stats">
        <div className="tracking-stat-card">
          <span className="tracking-stat-icon">📁</span>
          <p>Total Projects</p>
          <h2>{projects.length}</h2>
        </div>

        <div className="tracking-stat-card">
          <span className="tracking-stat-icon">⚙️</span>
          <p>In Progress</p>
          <h2>{inProgressCount}</h2>
        </div>

        <div className="tracking-stat-card">
          <span className="tracking-stat-icon">✓</span>
          <p>Delivered</p>
          <h2>{completedCount}</h2>
        </div>

        <div className="tracking-stat-card">
          <span className="tracking-stat-icon">👥</span>
          <p>Active Employees Assigned</p>
          <h2>{assignedEmployeeCount}</h2>
        </div>
      </div>

      <section className="tracking-content">
        <div className="tracking-section-heading">
          <div>
            <h2>Project Overview</h2>
            <p>
              {assignedCount} of {projects.length} projects have an employee
              assigned.
            </p>
          </div>
          <span className="tracking-result-count">
            {filteredProjects.length} Projects
          </span>
        </div>

        <div className="tracking-filters">
          <input
            type="text"
            placeholder="Search project, client or employee..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="ALL">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {formatStatus(status)}
              </option>
            ))}
          </select>

          <select
            value={employeeFilter}
            onChange={(event) => setEmployeeFilter(event.target.value)}
          >
            <option value="ALL">All Employees</option>
            <option value="UNASSIGNED">Not Assigned</option>
            {employee.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="tracking-error">{error}</div>}

        {loading ? (
          <div className="tracking-empty">Loading project details...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="tracking-empty">
            <h3>No projects found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <div className="tracking-table-wrapper">
            <table className="tracking-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Assigned Employee</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Last Updated</th>
                </tr>
              </thead>

              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <strong>{project.name}</strong>
                      <span className="tracking-project-type">
                        {project.type || "Project"}
                      </span>
                    </td>

                    <td>
                      <strong>{project.client?.name || "Unknown Client"}</strong>
                      <span className="tracking-secondary">
                        {project.client?.email || ""}
                      </span>
                    </td>

                    <td>
                      {project.assignedEmployee ? (
                        <>
                          <strong>{project.assignedEmployee.name}</strong>
                          <span className="tracking-secondary">
                            {project.assignedEmployee.email}
                          </span>
                        </>
                      ) : (
                        <span className="tracking-unassigned">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        className={`tracking-status status-${(
                          project.status || "unknown"
                        ).toLowerCase()}`}
                      >
                        {formatStatus(project.status)}
                      </span>
                    </td>

                    <td>{formatDate(project.deadline)}</td>

                    <td>{formatDate(project.updatedAt)}</td>
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

export default WorkTracking;