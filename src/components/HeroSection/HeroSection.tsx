import { useNavigate } from "react-router-dom";
import { hero } from "@/config/site";
import "@/components/HeroSection/HeroSection.css";

const coverImage = "https://res.cloudinary.com/bmtiifge/image/upload/v1783519174/yaraodeh-portfolio/cover/1-image_tcdffg.jpg";

export default function HeroSection() {
  const navigate = useNavigate();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="hero-section" id="home">
      <div className="hero-bg" style={{ backgroundImage: `url(${coverImage})` }} />
      <div className="hero-content reveal">
        <h1 className="hero-title">{hero.name}</h1>
        <p className="hero-tagline">{hero.tagline}</p>
        <div className="hero-socials">
          {hero.socials.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d={icon} />
              </svg>
            </a>
          ))}
        </div>
        <div className="hero-cta-group">
          <button className="cta-button" onClick={() => scrollTo("portfolio")}>
            View My Work
          </button>
          <button className="cta-button" onClick={() => navigate("/cv")}>
            CV
          </button>
          <button className="cta-button" onClick={() => navigate("/volunteering")}>
            Volunteering
          </button>
        </div>
      </div>
    </section>
  );
}
