import flamePhoenixLogo from "../../assets/flame-phoenix-logo.png";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  TrendingUp,
  Mail,
  Bell,
  LogOut,
  RefreshCw,
  Clock3,
  CircleCheck,
  CircleAlert,
  FolderKanban,
} from "lucide-react";
import { getAssignedProjects } from "../../services/api";
import "./StaffDashboard.css";

const COMPLETED = ["APPROVED", "DELIVERED"];
const IN_PROGRESS = ["IN_PROGRESS", "TESTING"];
const PENDING_REVIEW = ["CLIENT_REVIEW"];
const TODO = ["SUBMITTED", "PLANNING"];

function statusLabel(status) {
  return String(status || "SUBMITTED").replaceAll("_", " ");
}

function StaffDashboard({ user, onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAssignedProjects();
      setProjects(
        Array.isArray(result)
          ? result
          : result.projects || result.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load your assigned projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      assigned: projects.length,
      inProgress: projects.filter(p => IN_PROGRESS.includes(p.status)).length,
      pending: projects.filter(p => PENDING_REVIEW.includes(p.status)).length,
      completed: projects.filter(p => COMPLETED.includes(p.status)).length,
      overdue: projects.filter(p =>
        p.deadline &&
        !COMPLETED.includes(p.status) &&
        new Date(p.deadline) < today
      ).length,
    };
  }, [projects]);

  const inProgress = projects.filter(p => IN_PROGRESS.includes(p.status));
  const todo = projects.filter(p => TODO.includes(p.status));
  const review = projects.filter(p =>
    PENDING_REVIEW.includes(p.status) ||
    p.status === "CHANGES_REQUESTED"
  );

  const firstName = user?.name || "Staff Member";

  const cards = [
    { title: "ASSIGNED PROJECTS", value: stats.assigned, color: "blue", note: "All assigned work" },
    { title: "IN PROGRESS", value: stats.inProgress, color: "orange", note: "Currently executing" },
    { title: "PENDING REVIEW", value: stats.pending, color: "purple", note: "Awaiting review" },
    { title: "COMPLETED", value: stats.completed, color: "green", note: "Approved or delivered" },
    { title: "OVERDUE", value: stats.overdue, color: "red", note: "Past the deadline" },
  ];

  function ProjectRow({ project }) {
    return (
      <div className="sd-project-row">
        <div className="sd-project-name">
          <strong>{project.name || "Untitled project"}</strong>
          <span>{project.type || "Project"}</span>
        </div>
        <span className={`sd-status sd-status-${String(project.status || "submitted").toLowerCase()}`}>
          {statusLabel(project.status)}
        </span>
        <span className="sd-deadline">
          {project.deadline
            ? new Date(project.deadline).toLocaleDateString()
            : "No deadline"}
        </span>
      </div>
    );
  }

  function Placeholder({ name }) {
    return window.alert(`${name} functionality has not been connected yet.`);
  }

  return (
    <div className={`sd-layout sd-theme-${theme}`}>
      <aside className="sd-sidebar">
        <Link to="/staff" className="sd-brand">
          <img className="sd-brand-logo" src={flamePhoenixLogo} alt="Flame Phoenix logo" />
          <span>
            <strong>Flame Phoenix</strong>
            <small>STAFF WORKSPACE</small>
          </span>
        </Link>

        <div className="sd-nav-heading">MY WORKSPACE</div>
        <nav className="sd-nav">
          <Link to="/staff" className="sd-nav-link active">
            <LayoutDashboard size={17} /> Dashboard
          </Link>
          <Link to="/staff/projects" className="sd-nav-link">
            <ClipboardList size={17} /> My Assigned Tasks
          </Link>
          
          <button className="sd-nav-link" onClick={() => Placeholder({ name: "Apply Leave" })}>
            <CalendarDays size={17} /> Apply Leave
          </button>
          <button className="sd-nav-link" onClick={() => Placeholder({ name: "Company Calendar" })}>
            <CalendarDays size={17} /> Company Calendar
          </button>
          <button className="sd-nav-link" onClick={() => Placeholder({ name: "Performance" })}>
            <TrendingUp size={17} /> Performance
          </button>
        </nav>

        <div className="sd-nav-heading">COMMUNICATION</div>
        <nav className="sd-nav">
          <button className="sd-nav-link" onClick={() => Placeholder({ name: "Department Mail" })}>
            <Mail size={17} /> Department Mail
          </button>
          <button className="sd-nav-link" onClick={() => Placeholder({ name: "Notifications" })}>
            <Bell size={17} /> Notifications
          </button>
        </nav>

        <div className="sd-sidebar-profile">
          <div className="sd-avatar">{firstName.charAt(0).toUpperCase()}</div>
          <div className="sd-profile-info">
            <strong>{firstName}</strong>
            <span>STAFF</span>
          </div>
          <button type="button" title="Log out" className="sd-logout" onClick={onLogout}>
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      <main className="sd-main">
        <header className="sd-topbar">
          <strong>My Work Overview</strong>
          <div className="sd-topbar-actions">
            <button className="sd-theme-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
            <span className="sd-topbar-user">{user?.email || "Staff account"}</span>
          </div>
        </header>

        <div className="sd-content">
          <section className="sd-welcome">
            <div>
              <p className="sd-eyebrow">STAFF DASHBOARD</p>
              <h1>Good day, {firstName}.</h1>
              <p>Review your assignments and keep your project progress up to date.</p>
            </div>
            <div className="sd-actions">
              <button type="button" className="sd-button sd-button-secondary" onClick={loadProjects} disabled={loading}>
                <RefreshCw size={16} /> Refresh
              </button>
              <Link to="/staff/projects" className="sd-button sd-button-primary">
                View All My Tasks
              </Link>
            </div>
          </section>

          {error && <div className="sd-error"><CircleAlert size={18} /> {error}</div>}

          <section className="sd-stats">
            {cards.map(card => (
              <article className="sd-stat-card" key={card.title}>
                <div className="sd-stat-top">
                  <span>{card.title}</span>
                  <span className={`sd-stat-icon ${card.color}`}>
                    {card.color === "green" ? <CircleCheck size={17} /> :
                     card.color === "red" ? <CircleAlert size={17} /> :
                     <FolderKanban size={17} />}
                  </span>
                </div>
                <strong className={`sd-stat-number ${card.color}`}>
                  {loading ? "..." : card.value}
                </strong>
                <p>{card.note}</p>
              </article>
            ))}
          </section>

          {loading ? (
            <div className="sd-panel sd-loading">Loading your assigned projects...</div>
          ) : (
            <>
              <section className="sd-work-grid">
                <article className="sd-panel">
                  <header className="sd-panel-header">
                    <h2><Clock3 size={17} /> In Progress Tasks</h2>
                    <span>{inProgress.length}</span>
                  </header>
                  {inProgress.length
                    ? inProgress.map(p => <ProjectRow key={p.id || p._id} project={p} />)
                    : <p className="sd-empty">No projects currently in progress.</p>}
                </article>

                <article className="sd-panel">
                  <header className="sd-panel-header">
                    <h2><ClipboardList size={17} /> To Do Tasks</h2>
                    <span>{todo.length}</span>
                  </header>
                  {todo.length
                    ? todo.map(p => <ProjectRow key={p.id || p._id} project={p} />)
                    : <p className="sd-empty">No unstarted projects assigned.</p>}
                </article>
              </section>

              <section className="sd-panel sd-review-panel">
                <header className="sd-panel-header">
                  <h2><CircleCheck size={17} /> Pending Approval &amp; Review</h2>
                  <span>{review.length}</span>
                </header>
                {review.length
                  ? review.map(p => <ProjectRow key={p.id || p._id} project={p} />)
                  : <p className="sd-empty">No projects waiting for review.</p>}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;




