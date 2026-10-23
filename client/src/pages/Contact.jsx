import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./PublicPages.css";

function Contact() {
  return (
    <><Navbar /><main className="public-page">
      <section className="public-hero">
        <span className="public-eyebrow">GET IN TOUCH</span>
        <h1>
          Let's build something <span>meaningful.</span>
        </h1>
        <p>
          Tell us about your idea and the problem you want to solve.
        </p>
        <Link to="/services" className="public-button">
          Explore our services
        </Link>
      </section>

      <section className="public-section">
        <div className="public-section-heading">
          <h2>Contact Flame Phoenix</h2>
          <p>
            Start with a discussion about your project requirements.
          </p>
        </div>
      </section>
    </main></>
  );
}

export default Contact;