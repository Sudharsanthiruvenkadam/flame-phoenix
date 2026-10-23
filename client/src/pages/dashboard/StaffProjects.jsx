import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw, FolderKanban, AlertCircle } from "lucide-react";
import { getAssignedProjects, updateAssignedProjectStatus } from "../../services/api";
import "./StaffProjects.css";

const STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "TESTING",
  "CLIENT_REVIEW",
  "ON_HOLD",
  "CHANGES_REQUESTED",
];

function getProjectId(project) {
  return project._id || project.id;
}

function StaffProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAssignedProjects();
      const list = Array.isArray(result)
        ? result
        : result.projects || result.data || [];
      setProjects(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load assigned projects. Check your login and server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleStatusChange(project, status) {
    const id = getProjectId(project);
    if (!id || status === project.status) return;

    setSavingId(id);
    setError("");
    setNotice("");

    try {
      const result = await updateAssignedProjectStatus(id, status);
      const updated = result.project || result.data || result;

      setProjects((current) =>
        current.map((item) =>
          getProjectId(item) === id
            ? { ...item, ...updated, status: updated.status || status }
            : item
        )
      );
      setNotice("Project status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Status update failed. Make sure this project is assigned to you."
      );
    } finally {
      setSavingId("");
    }
  }

  return (
    <main className="staff-projects-page">
      <header className="staff-projects-header">
        <Link to="/dashboard" className="staff-back-link">
          <ArrowLeft size={17} /> Dashboard
        </Link>
        <button
          className="staff-refresh-button"
          onClick={loadProjects}
          disabled={loading}
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      <section className="staff-projects-content">
        <div className="staff-projects-eyebrow">
          <FolderKanban size={17} /> STAFF WORKSPACE
        </div>
        <h1>Assigned Projects</h1>
        <p className="staff-projects-intro">
          Review your assigned work and keep project progress up to date.
        </p>

        {error && (
          <div className="staff-message staff-error">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {notice && <div className="staff-message staff-success">{notice}</div>}

        {loading ? (
          <p className="staff-empty">Loading assigned projects...</p>
        ) : projects.length === 0 ? (
          <div className="staff-empty">
            <FolderKanban size={30} />
            <h2>No assigned projects yet</h2>
            <p>Projects assigned to your staff account will appear here.</p>
          </div>
        ) : (
          <div className="staff-project-list">
            {projects.map((project) => {
              const id = getProjectId(project);
              return (
                <article className="staff-project-card" key={id || project.name}>
                  <div className="staff-project-card-top">
                    <div>
                      <span className="staff-project-type">
                        {project.type || "Project"}
                      </span>
                      <h2>{project.name || "Untitled project"}</h2>
                    </div>
                    <span className="staff-project-status">
                      {(project.status || "SUBMITTED").replaceAll("_", " ")}
                    </span>
                  </div>

                  <p className="staff-project-description">
                    {project.description || "No description provided."}
                  </p>

                  <div className="staff-project-meta">
                    <span>
                      <strong>Client:</strong>{" "}
                      {project.client?.name || project.clientName || "Not provided"}
                    </span>
                    <span>
                      <strong>Email:</strong>{" "}
                      {project.client?.email || project.clientEmail || "Not provided"}
                    </span>
                    <span>
                      <strong>Deadline:</strong>{" "}
                      {project.deadline
                        ? new Date(project.deadline).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>

                  <label className="staff-status-label" htmlFor={`status-${id}`}>
                    Update project status
                  </label>
                  <select
                    id={`status-${id}`}
                    value={project.status || "SUBMITTED"}
                    disabled={savingId === id}
                    onChange={(event) =>
                      handleStatusChange(project, event.target.value)
                    }
                  >
                    {[...new Set([project.status || "SUBMITTED", ...STATUSES])].map(
                      (status) => (
                        <option value={status} key={status}>
                          {status.replaceAll("_", " ")}
                        </option>
                      )
                    )}
                  </select>
                  {savingId === id && (
                    <p className="staff-saving">Saving status...</p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default StaffProjects;
