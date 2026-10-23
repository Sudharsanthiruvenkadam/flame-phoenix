import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import phoenixLogo from "../assets/flame-phoenix-logo.png";
import "./Navbar.css";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="shared-navbar">
      <Link
        className="shared-brand"
        to="/"
        aria-label="Flame Phoenix home"
        onClick={closeMenu}
      >
        <img src={phoenixLogo} alt="Flame Phoenix company logo" />
      </Link>

      <button
        className="shared-menu-toggle"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="shared-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        id="shared-navigation"
        className={`shared-nav-links ${menuOpen ? "is-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={closeMenu}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link className="shared-nav-cta" to="/contact">
        Get a Quote <ArrowRight size={17} />
      </Link>
    </header>
  );
}

export default Navbar;
