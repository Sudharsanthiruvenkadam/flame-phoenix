import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FolderKanban, PlusCircle } from "lucide-react";
import { createProject, getMyProjects } from "../../services/api";
import "./ProjectsWorkspace.css";

const projectTypes = [
  "Web Application",
  "Mobile Application",
  "AI / ML Project",
  "Server-based Project",
  "Product-based Project",
  "Software Development",
  "Automation Project",
  "Other",
];

function ProjectsWorkspace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    type: "Web Application",
    description: "",
    budget: "",
    deadline: "",
  });

  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const result = await getMyProjects();
      setProjects(result.projects || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load projects. Please sign in again if your session expired."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim(),
        budget: form.budget === "" ? null : Number(form.budget),
        deadline: form.deadline || null,
      };

      const result = await createProject(payload);

      setMessage(result.message || "Project submitted successfully.");
      setForm({
        name: "",
        type: "Web Application",
        description: "",
        budget: "",
        deadline: "",
      });

      await loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Project submission failed. Check your connection and login."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="workspace-page">
      <header className="workspace-header">
        <Link to="/dashboard" className="workspace-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>
        <span className="workspace-brand">Flame Phoenix</span>
      </header>

      <section className="workspace-content">
        <div className="workspace-heading">
          <span className="workspace-eyebrow">
            <FolderKanban size={17} />
            CLIENT WORKSPACE
          </span>
          <h1>My Projects</h1>
          <p>Submit a new project and track its progress in one place.</p>
        </div>

        <section className="project-form-card">
          <h2>
            <PlusCircle size={21} />
            Submit a Project
          </h2>

          <form onSubmit={handleSubmit} className="project-form">
            <label htmlFor="project-name">Project name *</label>
            <input
              id="project-name"
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Example: Company website"
              minLength={3}
              maxLength={150}
              required
            />

            <label htmlFor="project-type">Project type *</label>
            <select
              id="project-type"
              name="type"
              value={form.type}
              onChange={updateField}
              required
            >
              {projectTypes.map((type) => (
                <option value={type} key={type}>{type}</option>
              ))}
            </select>

            <label htmlFor="project-description">Project requirements *</label>
            <textarea
              id="project-description"
              name="description"
              value={form.description}
              onChange={updateField}
              placeholder="Explain what you need the project to do..."
              minLength={20}
              maxLength={5000}
              rows={5}
              required
            />

            <div className="project-form-row">
              <div>
                <label htmlFor="project-budget">Budget (optional)</label>
                <input
                  id="project-budget"
                  name="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.budget}
                  onChange={updateField}
                  placeholder="Enter budget"
                />
              </div>

              <div>
                <label htmlFor="project-deadline">Deadline (optional)</label>
                <input
                  id="project-deadline"
                  name="deadline"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA")}
                  value={form.deadline}
                  onChange={updateField}
                />
              </div>
            </div>

            {error && <p className="workspace-error" role="alert">{error}</p>}
            {message && <p className="workspace-success" role="status">{message}</p>}

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Project"}
            </button>
          </form>
        </section>

        <section className="project-list-section">
          <h2>Submitted Projects</h2>

          {loading && <p>Loading your projects...</p>}

          {!loading && !error && projects.length === 0 && (
            <div className="project-empty">
              <FolderKanban size={30} />
              <p>No projects submitted yet.</p>
              <span>Your submitted projects will appear here.</span>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="project-list">
              {projects.map((project) => (
                <article className="project-item" key={project.id}>
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.type}</p>
                    <p className="project-description">{project.description}</p>
                    {project.deadline && (
                      <p>Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="project-item-actions">
                    <span className="project-status">
                      {project.status.replaceAll("_", " ")}
                    </span>
                    <Link
                      to={`/dashboard/projects/${project.id}`}
                      className="project-view-details"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default ProjectsWorkspace;

