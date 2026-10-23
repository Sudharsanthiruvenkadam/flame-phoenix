import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { getMyProjectById } from "../../services/api";
import "./ProjectDetails.css";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProject() {
      setLoading(true);
      setError("");

      try {
        const result = await getMyProjectById(id);
        if (active) setProject(result.project);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load this project. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [id]);

  function formatDate(value) {
    if (!value) return "Not provided";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "Not available"
      : date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
  }

  function formatBudget(value) {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return (
    <main className="project-details-page">
      <header className="workspace-header">
        <Link to="/dashboard/projects" className="workspace-back">
          <ArrowLeft size={18} />
          My Projects
        </Link>
        <span className="workspace-brand">Flame Phoenix</span>
      </header>

      <section className="project-details-content">
        <span className="details-eyebrow">
          <FolderKanban size={17} />
          PROJECT WORKSPACE
        </span>

        <h1>Project Details</h1>
        <p className="details-intro">
          Review your submitted project information and current progress.
        </p>

        {loading && <p className="details-message">Loading project details...</p>}

        {!loading && error && (
          <section className="details-card">
            <p className="details-error" role="alert">{error}</p>
            <Link to="/dashboard/projects" className="details-button">
              Back to My Projects
            </Link>
          </section>
        )}

        {!loading && !error && project && (
          <article className="details-card">
            <div className="details-title-row">
              <div>
                <span className="details-label">PROJECT NAME</span>
                <h2>{project.name}</h2>
                <p className="details-type">{project.type}</p>
              </div>
              <span className="project-status">
                {project.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="details-section">
              <h3>Project Requirements</h3>
              <p className="details-description">{project.description}</p>
            </div>

            <div className="details-grid">
              <div className="details-field">
                <span className="details-label">Budget</span>
                <strong>{formatBudget(project.budget)}</strong>
              </div>

              <div className="details-field">
                <span className="details-label">Deadline</span>
                <strong>{formatDate(project.deadline)}</strong>
              </div>

              <div className="details-field">
                <span className="details-label">Submitted On</span>
                <strong>{formatDate(project.createdAt)}</strong>
              </div>

              <div className="details-field">
                <span className="details-label">Last Updated</span>
                <strong>{formatDate(project.updatedAt)}</strong>
              </div>
            </div>

            <Link to="/dashboard/projects" className="details-button">
              <ArrowLeft size={17} />
              Back to My Projects
            </Link>
          </article>
        )}
      </section>
    </main>
  );
}

export default ProjectDetails;
