
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  Search,
  RefreshCw,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { getAdminUsers } from "../../services/api";
import "./UserManagement.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getAdminUsers();

      if (!Array.isArray(result.users)) {
        throw new Error("The server did not return a valid users list.");
      }

      setUsers(result.users);
    } catch (err) {
      console.error("User Management loading error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load user accounts. Check the Admin API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const summary = useMemo(() => ({
    total: users.length,
    clients: users.filter((u) => u.role === "CLIENT").length,
    staff: users.filter((u) => u.role === "STAFF").length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    active: users.filter((u) => u.isActive !== false).length,
    inactive: users.filter((u) => u.isActive === false).length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.company?.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive !== false) ||
        (statusFilter === "inactive" && user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <main className="user-management-page">
      <header className="user-management-header">
        <Link to="/admin" className="user-management-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <button
          type="button"
          className="user-management-refresh"
          onClick={loadUsers}
          disabled={loading}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </header>

      <section className="user-management-content">
        <div className="user-management-eyebrow">
          <Users size={17} />
          ADMIN WORKSPACE
        </div>

        <h1>User Management</h1>
        <p className="user-management-intro">
          Manage visibility of client, staff, and admin accounts
          in your Flame Phoenix workspace.
        </p>

        <div className="user-management-summary">
          <div className="user-management-summary-icon">
            <Users size={24} />
          </div>
          <div>
            <span>Total user accounts</span>
            <strong>{summary.total}</strong>
          </div>
        </div>

        <div className="user-management-stats">
          {[
            ["Clients", summary.clients],
            ["Staff", summary.staff],
            ["Admins", summary.admins],
            ["Active", summary.active],
            ["Inactive", summary.inactive],
          ].map(([label, count]) => (
            <div className="user-management-stat" key={label}>
              <span>{label}</span>
              <strong>{count}</strong>
            </div>
          ))}
        </div>

        <div className="user-management-toolbar">
          <label htmlFor="user-search">
            <Search size={18} />
            <span className="sr-only">Search users</span>
          </label>
          <input
            id="user-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email, or company"
          />
        </div>

        <div className="user-management-filters">
          <label>
            <span>Role</span>
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="ALL">All roles</option>
              <option value="CLIENT">Clients</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admins</option>
            </select>
          </label>

          <label>
            <span>Account status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All accounts</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>

        {!loading && !error && (
          <p className="user-management-result-count">
            Showing {filteredUsers.length} of {users.length} accounts
          </p>
        )}

        {error && (
          <div className="user-management-error" role="alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <p className="user-management-empty">Loading user accounts...</p>
        ) : error ? (
          <div className="user-management-empty">
            <p>Check the server and try refreshing.</p>
            <button
              type="button"
              className="user-management-refresh"
              onClick={loadUsers}
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="user-management-empty">
            <Users size={30} />
            <h2>
              {users.length === 0
                ? "No user accounts found"
                : "No matching users"}
            </h2>
            <p>
              {users.length === 0
                ? "Registered accounts will appear here."
                : "Try changing your search or filters."}
            </p>
            {users.length === 0 && (
              <Link
                to="/admin/projects"
                className="user-management-create"
              >
                <UserPlus size={17} />
                Go to All Projects
              </Link>
            )}
          </div>
        ) : (
          <div className="user-management-list">
            {filteredUsers.map((user) => (
              <article
                className="user-management-card"
                key={user._id || user.id || user.email}
              >
                <div className="user-management-avatar">
                  {(user.name || "?").trim().charAt(0).toUpperCase()}
                </div>

                <div className="user-management-details">
                  <h2>{user.name || "Unnamed user"}</h2>
                  <p>{user.email}</p>
                  {user.company && <span>{user.company}</span>}
                  {user.phone && <span>{user.phone}</span>}
                </div>

                <div className="user-management-badges">
                  <span
                    className={`user-management-role user-management-role-${(
                      user.role || "unknown"
                    ).toLowerCase()}`}
                  >
                    {user.role || "UNKNOWN"}
                  </span>

                  <span
                    className={`user-management-status ${
                      user.isActive === false ? "inactive" : "active"
                    }`}
                  >
                    {user.isActive === false ? "Inactive" : "Active"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default UserManagement;

