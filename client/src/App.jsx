
import {
  ArrowRight,
  Code2,
  Layers3,
  ShieldCheck,
  Zap,
} from "lucide-react";
import phoenixLogo from "./assets/flame-phoenix-logo.png";
import Navbar from "./components/Navbar";
import "./App.css";

const services = [
  {
    icon: Code2,
    title: "Custom Software",
    description:
      "Build practical software solutions designed around your business needs.",
  },
  {
    icon: Layers3,
    title: "Product Development",
    description:
      "Turn your ideas into reliable, scalable digital products.",
  },
  {
    icon: Zap,
    title: "AI & Automation",
    description:
      "Improve workflows and discover smarter ways to solve problems.",
  },
];

function App() {
  return (
    <div className="site-shell">
      <Navbar />

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <img
              className="hero-logo"
              src={phoenixLogo}
              alt="Flame Phoenix — official company logo"
            />

            <h1>Your Trust Is Our Responsibility.</h1>

            <p>
              Building meaningful digital solutions through trust,
              innovation, and excellence.
            </p>

            <a className="primary-button" href="/contact">
              Get a Quote <ArrowRight size={20} />
            </a>
          </div>

          <div className="hero-trust-note">
            <ShieldCheck size={17} />
            <span>Trust. Innovation. Excellence.</span>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="section-heading">
            <span className="section-label">WHAT WE DO</span>
            <h2>Technology that moves you forward.</h2>
            <p>
              From the first idea to the final product, let's build
              something valuable together.
            </p>
          </div>

          <div className="service-grid">
            {services.map(({ icon: Icon, title, description }) => (
              <article className="service-card" key={title}>
                <div className="service-icon">
                  <Icon size={24} />
                </div>

                <h3>{title}</h3>
                <p>{description}</p>

                <a
                  href="/services"
                  aria-label={`Learn more about ${title}`}
                >
                  Learn More <ArrowRight size={16} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-section" id="projects">
          <div className="section-heading">
            <span className="section-label">OUR WORKSPACE</span>
            <h2>Ideas become real projects.</h2>
            <p>
              Explore the Flame Phoenix workspace for clients,
              staff members, and administrators.
            </p>
          </div>

          <div className="portal-actions">
            <a href="/login/client" className="portal-link">
              Client Portal <ArrowRight size={17} />
            </a>

            <a href="/login/staff" className="portal-link">
              Staff Portal <ArrowRight size={17} />
            </a>

            <a href="/login/admin" className="portal-link">
              Admin Portal <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <span className="section-label">LET'S WORK TOGETHER</span>

          <h2>Have an idea? Let's build it.</h2>

          <p>
            Connect with Flame Phoenix to discuss your business
            requirements and digital project ideas.
          </p>

          <a className="primary-button" href="/contact">
            Request a Quote <ArrowRight size={18} />
          </a>
        </section>
      </main>

      <footer id="about">
        <a className="footer-brand" href="/">
          <img src={phoenixLogo} alt="Flame Phoenix" />
        </a>

        <p>
          Building meaningful digital solutions through trust and
          innovation.
        </p>

        <span>
          © {new Date().getFullYear()} Flame Phoenix. All rights reserved.
        </span>
      </footer>
    </div>
  );
}

export default App;
