
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
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

      // Only CLIENT users can access this dashboard.
      if (role !== "CLIENT") {
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
    return (
      <main className="dashboard-loading">
        Loading workspace...
      </main>
    );
  }

  const dashboardCards = [
    {
      icon: FolderKanban,
      title: "My Projects",
      description: "View and track your submitted projects.",
      destination: "/dashboard/projects",
    },
    {
      icon: ClipboardList,
      title: "Project Requirements",
      description: "Keep your project needs organized.",
      destination: "#",
    },
  ];

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
            Client Workspace
          </span>

          <h1>Welcome, {user.name}!</h1>

          <p>
            Here is your client workspace at Flame Phoenix.
          </p>
        </div>

        <div className="dashboard-profile">
          <div>
            <span className="dashboard-label">Signed in as</span>
            <strong>{user.email}</strong>
          </div>

          <span className="dashboard-role">Client</span>
        </div>

        <h2>Your Workspace</h2>

        <div className="dashboard-grid">
          {dashboardCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                className="dashboard-card"
                key={card.title}
              >
                <span className="dashboard-card-icon">
                  <Icon size={24} />
                </span>

                <h3>{card.title}</h3>

                <p>{card.description}</p>

                {card.destination !== "#" ? (
                  <Link
                    to={card.destination}
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
