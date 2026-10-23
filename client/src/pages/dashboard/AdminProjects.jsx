
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  FolderKanban,
  UserPlus,
} from "lucide-react";
import {
  getAdminProjects,
  getAdminStaff,
  assignProjectToStaff,
  createAdminStaff,
} from "../../services/api";
import "./AdminProjects.css";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [projectData, staffData] = await Promise.all([
        getAdminProjects(),
        getAdminStaff(),
      ]);

      const projectList = projectData.projects || [];
      setProjects(projectList);
      setStaff(staffData.staff || []);

      const currentAssignments = {};
      projectList.forEach((project) => {
        currentAssignments[project.id] =
          project.assignedStaff?.id || "";
      });

      setAssignments(currentAssignments);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load projects. Please check your login and server."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAssign(projectId) {
    setSavingId(projectId);
    setError("");
    setNotice("");

    try {
      const staffId = assignments[projectId] || null;

      await assignProjectToStaff(projectId, staffId);

      setNotice("Project assignment updated successfully.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update project assignment."
      );
    } finally {
      setSavingId("");
    }
  }

  function updateStaffField(event) {
    const { name, value } = event.target;

    setStaffForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleCreateStaff(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (staffForm.password.length < 8) {
      setError("Staff password must contain at least 8 characters.");
      return;
    }

    setCreatingStaff(true);

    try {
      const result = await createAdminStaff(staffForm);

      setNotice(
        result.message || "Staff account created successfully."
      );

      setStaffForm({
        name: "",
        email: "",
        password: "",
        company: "",
        phone: "",
      });

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the staff account."
      );
    } finally {
      setCreatingStaff(false);
    }
  }

  return (
    <main className="admin-projects-page">
      <header className="admin-projects-header">
        <Link to="/dashboard" className="admin-back-link">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </header>

      <section className="admin-projects-content">
        <div className="admin-projects-heading">
          <span className="admin-projects-eyebrow">
            <FolderKanban size={17} />
            ADMIN WORKSPACE
          </span>

          <h1>Project Management</h1>
          <p>Review client projects and assign them to your staff.</p>
        </div>

        <div className="admin-projects-stats">
          <article>
            <FolderKanban size={22} />
            <div>
              <strong>{projects.length}</strong>
              <span>Total Projects</span>
            </div>
          </article>

          <article>
            <Users size={22} />
            <div>
              <strong>{staff.length}</strong>
              <span>Active Staff</span>
            </div>
          </article>

          <article>
            <FolderKanban size={22} />
            <div>
              <strong>
                {projects.filter((project) => project.assignedStaff?.id).length}
              </strong>
              <span>Assigned Projects</span>
            </div>
          </article>
        </div>

        {error && (
          <div className="admin-message admin-error" role="alert">
            {error}
          </div>
        )}

        {notice && (
          <div className="admin-message admin-success" role="status">
            {notice}
          </div>
        )}

        <section className="admin-staff-create">
          <div className="admin-staff-create-heading">
            <UserPlus size={24} />
            <div>
              <h2>Create Staff Account</h2>
              <p>
                Create a team member's login to manage assigned projects.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateStaff}>
            <label htmlFor="staff-name">Full name *</label>
            <input
              id="staff-name"
              name="name"
              type="text"
              placeholder="Enter staff member's name"
              value={staffForm.name}
              onChange={updateStaffField}
              minLength={2}
              maxLength={100}
              autoComplete="name"
              required
            />

            <label htmlFor="staff-email">Email address *</label>
            <input
              id="staff-email"
              name="email"
              type="email"
              placeholder="staff@example.com"
              value={staffForm.email}
              onChange={updateStaffField}
              autoComplete="email"
              required
            />

            <label htmlFor="staff-password">Temporary password *</label>
            <input
              id="staff-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={staffForm.password}
              onChange={updateStaffField}
              minLength={8}
              autoComplete="new-password"
              required
            />

            <label htmlFor="staff-company">Company (optional)</label>
            <input
              id="staff-company"
              name="company"
              type="text"
              placeholder="Company name"
              value={staffForm.company}
              onChange={updateStaffField}
              maxLength={150}
            />

            <label htmlFor="staff-phone">Phone number (optional)</label>
            <input
              id="staff-phone"
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={staffForm.phone}
              onChange={updateStaffField}
              maxLength={30}
            />

            <button type="submit" disabled={creatingStaff}>
              {creatingStaff
                ? "Creating account..."
                : "Create Staff Account"}
            </button>
          </form>
        </section>

        {loading ? (
          <div className="admin-empty">Loading project data...</div>
        ) : projects.length === 0 ? (
          <div className="admin-empty">
            <FolderKanban size={32} />
            <h2>No projects yet</h2>
            <p>Projects submitted by clients will appear here.</p>
          </div>
        ) : (
          <div className="admin-project-list">
            {projects.map((project) => (
              <article className="admin-project-card" key={project.id}>
                <div className="admin-project-card-top">
                  <div>
                    <span className="admin-project-type">
                      {project.type || "Project"}
                    </span>
                    <h2>{project.name}</h2>
                  </div>

                  <span className="admin-project-status">
                    {(project.status || "SUBMITTED").replaceAll("_", " ")}
                  </span>
                </div>

                <p className="admin-project-description">
                  {project.description || "No description provided."}
                </p>

                <div className="admin-project-meta">
                  <span>
                    <strong>Client:</strong>{" "}
                    {project.client?.name || "Unknown"}
                  </span>
                  <span>
                    <strong>Email:</strong>{" "}
                    {project.client?.email || "—"}
                  </span>
                  <span>
                    <strong>Deadline:</strong>{" "}
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "Not set"}
                  </span>
                </div>

                <div className="admin-assignment-row">
                  <label htmlFor={`staff-${project.id}`}>
                    Assign staff member
                  </label>

                  <select
                    id={`staff-${project.id}`}
                    value={assignments[project.id] || ""}
                    onChange={(event) =>
                      setAssignments((previous) => ({
                        ...previous,
                        [project.id]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Unassigned</option>

                    {staff.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => handleAssign(project.id)}
                    disabled={savingId === project.id}
                  >
                    {savingId === project.id
                      ? "Saving..."
                      : "Save Assignment"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProjects;
