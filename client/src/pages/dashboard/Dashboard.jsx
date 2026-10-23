import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Users,
  LogOut,
} from "lucide-react";
import "../PublicPages.css";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fp_user");
      const savedToken = localStorage.getItem("fp_token");

      if (!savedUser || !savedToken) {
        navigate("/login/client", { replace: true });
        return;
      }

      const parsedUser = JSON.parse(savedUser);
      const role = String(parsedUser.role || "").toUpperCase();

      if (!["CLIENT", "STAFF", "ADMIN"].includes(role)) {
        localStorage.removeItem("fp_user");
        localStorage.removeItem("fp_token");
        navigate("/login/client", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch {
      localStorage.removeItem("fp_user");
      localStorage.removeItem("fp_token");
      navigate("/login/client", { replace: true });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("fp_token");
    localStorage.removeItem("fp_user");
    navigate("/", { replace: true });
  }

  if (!user) {
    return <main className="dashboard-loading">Loading workspace...</main>;
  }

  const role = String(user.role || "").toUpperCase();
  const roleName = role.charAt(0) + role.slice(1).toLowerCase();

  const dashboardCards = {
    CLIENT: [
      {
        icon: FolderKanban,
        title: "My Projects",
        description: "View and track your submitted projects.",
      },
      {
        icon: ClipboardList,
        title: "Project Requirements",
        description: "Keep your project needs organized.",
      },
    ],

    STAFF: [
      {
        icon: FolderKanban,
        title: "Assigned Projects",
        description: "Review the projects assigned to you.",
      },
      {
        icon: ClipboardList,
        title: "Work Updates",
        description: "Track tasks and work progress.",
      },
    ],

    ADMIN: [
      {
        icon: FolderKanban,
        title: "All Projects",
        description: "Oversee company project progress.",
      },
      {
        icon: Users,
        title: "User Management",
        description: "Manage access to company workspaces.",
      },
    ],
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <Flame size={25} />
          </span>
          <span>Flame Phoenix</span>
        </Link>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-welcome">
          <span className="dashboard-eyebrow">
            <LayoutDashboard size={16} />
            {roleName} Workspace
          </span>

          <h1>Welcome, {user.name}!</h1>

          <p>
            Here is your {roleName.toLowerCase()} workspace at Flame Phoenix.
          </p>
        </div>

        <div className="dashboard-profile">
          <div>
            <span className="dashboard-label">Signed in as</span>
            <strong>{user.email}</strong>
          </div>

          <span className="dashboard-role">{roleName}</span>
        </div>

        <h2>Your Workspace</h2>

        <div className="dashboard-grid">
          {dashboardCards[role].map((card) => {
            const Icon = card.icon;

            let destination = "#";

            if (role === "CLIENT" && card.title === "My Projects") {
              destination = "/dashboard/projects";
            } else if (
              role === "ADMIN" &&
              card.title === "All Projects"
            ) {
              destination = "/dashboard/admin/projects";
            } else if (
              role === "ADMIN" &&
              card.title === "User Management"
            ) {
              destination = "/dashboard/admin/users";
            } else if (
              role === "STAFF" &&
              card.title === "Assigned Projects"
            ) {
              destination = "/dashboard/staff/projects";
            }

            return (
              <article className="dashboard-card" key={card.title}>
                <span className="dashboard-card-icon">
                  <Icon size={24} />
                </span>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                {destination !== "#" ? (
                  <Link
                    to={destination}
                    className="dashboard-card-action"
                  >
                    Open Workspace →
                  </Link>
                ) : (
                  <span className="dashboard-coming-soon">
                    Coming soon
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;