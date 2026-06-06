import aboutImage from "/assets/1-image-C_kxRZ9O.jpg";
import { about, hero } from "@/config/site";
import "@/components/AboutSection/AboutSection.css";

export default function AboutSection() {
  const bodyHTML = about.body
    .trim()
    .split(/\n\n+/)
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");

  return (
    <section className="about-section" id="about">
      <div className="about-container reveal">
        <div className="about-image">
          <img src={aboutImage} alt={hero.name} />
        </div>
        <div className="about-content">
          <h2>{about.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
          <div className="stats">
            {about.stats.map(({ number, label }) => (
              <div className="stat-item" key={label}>
                <div className="stat-number">{number}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
