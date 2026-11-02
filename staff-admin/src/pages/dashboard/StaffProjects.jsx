import flamePhoenixLogo from "../../assets/flame-phoenix-logo.png";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, CalendarDays, TrendingUp,
  Mail, Bell, LogOut, RefreshCw, Search, FolderKanban,
  CircleAlert
} from "lucide-react";
import {
  getAssignedProjects,
  updateAssignedProjectStatus
} from "../../services/api";
import "./StaffProjects.css";

const STATUSES = [
  "PLANNING",
  "IN_PROGRESS",
  "TESTING",
  "CLIENT_REVIEW",
  "ON_HOLD",
  "CHANGES_REQUESTED"
];

const COMPLETED = ["APPROVED", "DELIVERED"];

function projectId(project) {
  return String(project.id || project._id || "");
}

function statusText(status) {
  return String(status || "SUBMITTED").replaceAll("_", " ");
}

function StaffProjects({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [savingId, setSavingId] = useState("");
  const [fallbackUser, setFallbackUser] = useState(null);

  const staffUser = user || fallbackUser;

  useEffect(() => {
    try {
      setFallbackUser(JSON.parse(localStorage.getItem("fp_user") || "null"));
    } catch {
      setFallbackUser(null);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getAssignedProjects();
      setProjects(
        Array.isArray(result) ? result : result.projects || result.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load assigned tasks. Check your login and server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => ({
    assigned: projects.length,
    inProgress: projects.filter(p =>
      ["IN_PROGRESS", "TESTING"].includes(p.status)
    ).length,
    submitted: projects.filter(p => p.status === "SUBMITTED").length,
    completed: projects.filter(p => COMPLETED.includes(p.status)).length
  }), [projects]);

  const filteredProjects = useMemo(() => {
    const term = search.trim().toLowerCase();
    return projects.filter(project => {
      const matchesSearch =
        !term ||
        [project.name, project.description, project.type]
          .some(value => String(value || "").toLowerCase().includes(term));
      const matchesStatus = filter === "ALL" || project.status === filter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, search, filter]);

  async function handleStatusChange(project, status) {
    const id = projectId(project);
    if (!id || status === project.status) return;

    setSavingId(id);
    setError("");
    setNotice("");

    try {
      const result = await updateAssignedProjectStatus(id, status);
      const updated = result.project || result.data || result;
      setProjects(current =>
        current.map(item =>
          projectId(item) === id
            ? { ...item, ...updated, status: updated.status || status }
            : item
        )
      );
      setNotice("Task status updated successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Status update failed. Check that this project is assigned to your account."
      );
    } finally {
      setSavingId("");
    }
  }

  const name = staffUser?.name || "Staff Member";

  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        <Link to="/staff" className="tasks-brand">
          <img className="tasks-brand-logo" src={flamePhoenixLogo} alt="Flame Phoenix logo" />
          <span>
            <strong>Flame Phoenix</strong>
            <small>? WORKER WORKSPACE</small>
          </span>
        </Link>

        <p className="tasks-nav-heading">MY WORKSPACE</p>
        <nav className="tasks-nav">
          <Link to="/staff" className="tasks-nav-link">
            <LayoutDashboard size={17} /> Dashboard
          </Link>
          <Link to="/staff/projects" className="tasks-nav-link active">
            <ClipboardList size={17} /> My Tasks
          </Link>
          <button className="tasks-nav-link" onClick={() => window.alert("Apply Leave is not connected yet.")}>
            <CalendarDays size={17} /> Apply Leave
          </button>
          <button className="tasks-nav-link" onClick={() => window.alert("Company Calendar is not connected yet.")}>
            <CalendarDays size={17} /> Company Calendar
          </button>
          <button className="tasks-nav-link" onClick={() => window.alert("Performance is not connected yet.")}>
            <TrendingUp size={17} /> Performance
          </button>
        </nav>

        <p className="tasks-nav-heading">COMMUNICATION</p>
        <nav className="tasks-nav">
          <button className="tasks-nav-link" onClick={() => window.alert("Department Mail is not connected yet.")}>
            <Mail size={17} /> Department Mail
          </button>
          <button className="tasks-nav-link" onClick={() => window.alert("Notifications are not connected yet.")}>
            <Bell size={17} /> Notifications
          </button>
        </nav>

        <div className="tasks-profile">
          <div className="tasks-avatar">{name.charAt(0).toUpperCase()}</div>
          <div className="tasks-profile-info">
            <strong>{name}</strong>
            <small>STAFF</small>
          </div>
          {onLogout && (
            <button className="tasks-logout" title="Log out" onClick={onLogout}>
              <LogOut size={17} />
            </button>
          )}
        </div>
      </aside>

      <main className="tasks-main">
        <header className="tasks-topbar">
          <strong>My Assigned Tasks</strong>
          <span className="tasks-topbar-user">{staffUser?.email || "Staff account"}</span>
        </header>

        <section className="tasks-content">
          <div className="tasks-page-heading">
            <div>
              <h1>My Assigned Tasks</h1>
              <p>Manage progress, update task status, and review your assigned work.</p>
            </div>
            <button className="tasks-refresh" onClick={loadProjects} disabled={loading}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {error && <div className="tasks-message tasks-error"><CircleAlert size={18} /> {error}</div>}
          {notice && <div className="tasks-message tasks-success">{notice}</div>}

          <section className="tasks-stats">
            <article className="tasks-stat">
              <div><span>TOTAL ASSIGNED</span><b className="stat-blue">All</b></div>
              <strong>{loading ? "ï¿½" : stats.assigned}</strong>
            </article>
            <article className="tasks-stat">
              <div><span>IN PROGRESS</span><b className="stat-orange">Run</b></div>
              <strong>{loading ? "ï¿½" : stats.inProgress}</strong>
            </article>
            <article className="tasks-stat">
              <div><span>SUBMITTED</span><b className="stat-purple">Sub</b></div>
              <strong>{loading ? "ï¿½" : stats.submitted}</strong>
            </article>
            <article className="tasks-stat">
              <div><span>COMPLETED</span><b className="stat-green">Done</b></div>
              <strong>{loading ? "ï¿½" : stats.completed}</strong>
            </article>
          </section>

          <section className="tasks-filters">
            <div className="tasks-search">
              <Search size={17} />
              <input
                value={search}
                onChange={event => setSearch(event.target.value)}
                placeholder="Search tasks by title or description..."
                aria-label="Search assigned tasks"
              />
            </div>
            <select
              value={filter}
              onChange={event => setFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option value="ALL">All Statuses</option>
              {STATUSES.map(status => (
                <option value={status} key={status}>{statusText(status)}</option>
              ))}
            </select>
          </section>

          <section className="tasks-table-wrap">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>TASK TITLE</th>
                  <th>PRIORITY</th>
                  <th>PROGRESS</th>
                  <th>STATUS</th>
                  <th>DUE DATE</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="tasks-table-empty">Loading assigned tasks...</td></tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="tasks-table-empty">
                      <FolderKanban size={25} />
                      <strong>No matching tasks</strong>
                      <span>Try another search or status filter.</span>
                    </td>
                  </tr>
                ) : filteredProjects.map(project => (
                  <tr key={projectId(project)}>
                    <td className="task-title-cell">
                      <strong>{project.name || "Untitled project"}</strong>
                      {project.description && <small>{project.description}</small>}
                      {project.type && <span className="task-type-tag">{project.type}</span>}
                    </td>
                    <td><span className="task-not-set">Not set</span></td>
                    <td><span className="task-not-set">Not tracked</span></td>
                    <td>
                      <div className="task-status-cell">
                        <span className={`task-status-pill status-${String(project.status || "SUBMITTED").toLowerCase()}`}>
                          <i /> {statusText(project.status)}
                        </span>
                        <select
                          className="task-status-select"
                          aria-label={`Update status for ${project.name}`}
                          value={project.status || "SUBMITTED"}
                          disabled={savingId === projectId(project)}
                          onChange={event => handleStatusChange(project, event.target.value)}
                        >
                          {[...new Set([project.status || "SUBMITTED", ...STATUSES])].map(status => (
                            <option value={status} key={status}>{statusText(status)}</option>
                          ))}
                        </select>
                      </div>
                      {savingId === projectId(project) && <small className="task-saving">Saving...</small>}
                    </td>
                    <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <p className="tasks-footnote">
            Showing {filteredProjects.length} of {projects.length} assigned tasks
          </p>
        </section>
      </main>
    </div>
  );
}

export default StaffProjects;



