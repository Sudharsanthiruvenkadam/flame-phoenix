import Navbar from "../components/Navbar";
import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Smartphone,
  Cpu,
  Layers,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./PublicPages.css";

const services = [
  {
    icon: BrainCircuit,
    title: "AI & Deep Learning",
    description:
      "Intelligent applications using machine learning, deep learning, computer vision, and data-driven insights.",
    features: ["Machine Learning", "Computer Vision", "Data Analytics"],
  },
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Responsive, modern websites and web applications designed around business and user requirements.",
    features: ["Business Websites", "Web Applications", "API Integration"],
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "User-friendly mobile application experiences that help businesses connect with their customers.",
    features: ["Mobile Interfaces", "Application Design", "Backend Integration"],
  },
  {
    icon: Cpu,
    title: "IoT & Smart Devices",
    description:
      "Connected-device concepts and smart systems that help monitor activities and simplify everyday tasks.",
    features: ["Sensor Integration", "Device Monitoring", "Smart Automation"],
  },
  {
    icon: Layers,
    title: "Other Software Solutions",
    description:
      "Purpose-built software that helps organize workflows, manage information, and solve specific problems.",
    features: ["Management Systems", "Database Solutions", "Workflow Tools"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description:
      "Digital strategies that help businesses strengthen their online presence and reach relevant audiences.",
    features: ["Digital Presence", "Content Strategy", "Campaign Support"],
  },
];

function Services() {
  return (
    <><Navbar /><main className="public-page">
      <section className="public-hero">
        <span className="public-eyebrow">WHAT WE DO</span>
        <h1>
          Technology that moves your ideas <span>forward.</span>
        </h1>
        <p>
          Explore practical digital services designed to turn your requirements
          into useful, reliable, and scalable solutions.
        </p>
        <Link to="/contact" className="public-button">
          Discuss Your Project <ArrowRight size={18} />
        </Link>
      </section>

      <section className="public-section">
        <div className="public-section-heading">
          <span className="public-eyebrow">OUR SERVICES</span>
          <h2>Solutions for your next big idea</h2>
          <p>
            Tell us what you want to achieve. We can discuss the right approach
            for your project.
          </p>
        </div>

        <div className="public-card-grid">
          {services.map(({ icon: Icon, title, description, features }) => (
            <article className="public-card service-card" key={title}>
              <div className="public-icon">
                <Icon size={25} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul className="service-features">
                {features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link to="/contact" className="service-link">
                Enquire about this service <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="public-cta">
        <h2>Not sure which service you need?</h2>
        <p>
          Start with a free initial discussion and tell us about your idea,
          goals, and requirements.
        </p>
        <Link to="/contact" className="public-button">
          Let's Talk <ArrowRight size={18} />
        </Link>
      </section>
    </main></>
  );
}

export default Services;
