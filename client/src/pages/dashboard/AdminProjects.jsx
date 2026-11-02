
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
  getAdminEmployee,
  assignProjectToEmployee,
  createAdminEmployee,
} from "../../services/api";
import "./AdminProjects.css";

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [creatingEmployee, setCreatingEmployee] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [employeeForm, setEmployeeForm] = useState({
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
      const [projectData, employeeData] = await Promise.all([
        getAdminProjects(),
        getAdminEmployee(),
      ]);

      const projectList = projectData.projects || [];
      setProjects(projectList);
      setEmployee(employeeData.employee || []);

      const currentAssignments = {};
      projectList.forEach((project) => {
        currentAssignments[project.id] =
          project.assignedEmployee?.id || "";
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
      const employeeId = assignments[projectId] || null;

      await assignProjectToEmployee(projectId, employeeId);

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

  function updateEmployeeField(event) {
    const { name, value } = event.target;

    setEmployeeForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleCreateEmployee(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (employeeForm.password.length < 8) {
      setError("Employee password must contain at least 8 characters.");
      return;
    }

    setCreatingEmployee(true);

    try {
      const result = await createAdminEmployee(employeeForm);

      setNotice(
        result.message || "Employee account created successfully."
      );

      setEmployeeForm({
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
          "Unable to create the employee account."
      );
    } finally {
      setCreatingEmployee(false);
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
          <p>Review client projects and assign them to your employees.</p>
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
              <strong>{employee.length}</strong>
              <span>Active Employees</span>
            </div>
          </article>

          <article>
            <FolderKanban size={22} />
            <div>
              <strong>
                {projects.filter((project) => project.assignedEmployee?.id).length}
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

        <section className="admin-employee-create">
          <div className="admin-employee-create-heading">
            <UserPlus size={24} />
            <div>
              <h2>Create Employee Account</h2>
              <p>
                Create a team member's login to manage assigned projects.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateEmployee}>
            <label htmlFor="employee-name">Full name *</label>
            <input
              id="employee-name"
              name="name"
              type="text"
              placeholder="Enter employee's name"
              value={employeeForm.name}
              onChange={updateEmployeeField}
              minLength={2}
              maxLength={100}
              autoComplete="name"
              required
            />

            <label htmlFor="employee-email">Email address *</label>
            <input
              id="employee-email"
              name="email"
              type="email"
              placeholder="employee@example.com"
              value={employeeForm.email}
              onChange={updateEmployeeField}
              autoComplete="email"
              required
            />

            <label htmlFor="employee-password">Temporary password *</label>
            <input
              id="employee-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={employeeForm.password}
              onChange={updateEmployeeField}
              minLength={8}
              autoComplete="new-password"
              required
            />

            <label htmlFor="employee-company">Company (optional)</label>
            <input
              id="employee-company"
              name="company"
              type="text"
              placeholder="Company name"
              value={employeeForm.company}
              onChange={updateEmployeeField}
              maxLength={150}
            />

            <label htmlFor="employee-phone">Phone number (optional)</label>
            <input
              id="employee-phone"
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={employeeForm.phone}
              onChange={updateEmployeeField}
              maxLength={30}
            />

            <button type="submit" disabled={creatingEmployee}>
              {creatingEmployee
                ? "Creating account..."
                : "Create Employee Account"}
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
                  <label htmlFor={`employee-${project.id}`}>
                    Assign employee
                  </label>

                  <select
                    id={`employee-${project.id}`}
                    value={assignments[project.id] || ""}
                    onChange={(event) =>
                      setAssignments((previous) => ({
                        ...previous,
                        [project.id]: event.target.value,
                      }))
                    }
                  >
                    <option value="">Unassigned</option>

                    {employee.map((member) => (
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
