import { useEffect } from "react";
import "./About.css";

function About() {

 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <h1>About EcoStore 🌿</h1>

      <p className="about-intro">
        EcoStore is built to make sustainable living simple, affordable, and beautiful.
        We bring nature closer to your home with eco-friendly products and greenery.
      </p>

      <div className="about-grid">
        <div className="about-card">
          🌱 <h3>Our Mission</h3>
          <p>To promote eco-conscious living through sustainable products.</p>
        </div>

        <div className="about-card">
          ♻️ <h3>Sustainability</h3>
          <p>Every product is chosen with care for the planet.</p>
        </div>

        <div className="about-card">
          💚 <h3>Community</h3>
          <p>We support green habits and eco-friendly lifestyles.</p>
        </div>
      </div>
    </div>
  );
}

export default About;
