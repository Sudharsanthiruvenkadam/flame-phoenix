import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserRound,
  ChartNoAxesCombined,
  LogOut,
} from "lucide-react";

import logo from "../assets/flame-phoenix-logo.png";
import "./AdminLayout.css";

function AdminLayout({ user, onLogout }) {
  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Project Management",
      path: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Employee Management",
      path: "/admin/employee",
      icon: Users,
    },
    {
      label: "Client Management",
      path: "/admin/clients",
      icon: UserRound,
    },
    {
      label: "Work Tracking",
      path: "/admin/tracking",
      icon: ChartNoAxesCombined,
    },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="Flame Phoenix" />
          <div>
            <h2>FLAME PHOENIX</h2>
            <span>ADMIN WORKSPACE</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <strong>{user?.name || "Administrator"}</strong>
            <span>Administrator</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <span className="admin-menu-heading">MAIN MENU</span>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          className="admin-logout-button"
          onClick={onLogout}
          type="button"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>FLAME PHOENIX / ADMIN</span>
            <h2>Management Workspace</h2>
          </div>
        </header>

        <section className="admin-page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default AdminLayout;