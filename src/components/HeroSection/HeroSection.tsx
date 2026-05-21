import coverImage from "@/assets/cover/1-image.jpg";
import { hero } from "@/config/site";
import "@/components/HeroSection/HeroSection.css";

export default function HeroSection() {
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
        <button className="cta-button" onClick={() => scrollTo("portfolio")}>
          View My Work
        </button>
      </div>
    </section>
  );
}
