
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import "./PublicPages.css";

function Contact() {
  const phone = "6374884720";
  const email = "flame_phoenix@gmail.com";

  return (
    <>
      <Navbar />

      <main className="public-page">
        <section className="public-hero">
          <span className="public-eyebrow">GET IN TOUCH</span>
          <h1>
            Let's build something <span>meaningful.</span>
          </h1>
          <p>
            Have a project or idea? Contact Flame Phoenix.
            We would love to hear from you.
          </p>
        </section>

        <section className="public-section">
          <div className="public-section-heading">
            <h2>Contact Flame Phoenix</h2>
            <p>
              Connect with our founder for enquiries and project discussions.
            </p>
          </div>

          <div className="public-card-grid">
            <div className="public-card">
              <h3>Founder</h3>
              <p>Parvin Chandran K.</p>
              <p>Founder, Flame Phoenix</p>
            </div>

            <div className="public-card">
              <h3>Phone</h3>
              <p>{phone}</p>
              <a href={`tel:${phone}`}>Call us</a>
            </div>

            <div className="public-card">
              <h3>WhatsApp</h3>
              <p>{phone}</p>
              <a
                href={`https://wa.me/91${phone}`}
                target="_blank"
                rel="noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="public-card">
              <h3>Email</h3>
              <p>{email}</p>
              <a href={`mailto:${email}`}>Send an email</a>
            </div>

            <div className="public-card">
              <h3>Office Address</h3>
              <p>Address will be updated soon.</p>
            </div>
          </div>

          <div className="public-cta">
            <h2>Have an enquiry?</h2>
            <p>
              Send us your project requirements and we will be happy
              to connect with you.
            </p>
            <a
              className="public-button"
              href={`mailto:${email}?subject=Flame%20Phoenix%20Enquiry`}
            >
              Send an enquiry
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

export default Contact;
