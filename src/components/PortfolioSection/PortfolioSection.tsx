import Coverflow from "@/components/Coverflow/Coverflow";
import { projects } from "@/config/site";
import "@/components/PortfolioSection/PortfolioSection.css";

export default function PortfolioSection() {
  return (
    <section className="portfolio-section" id="portfolio">
      <div className="section-header reveal">
        <h2 className="section-title">Featured Work</h2>
        <p className="section-subtitle">
          A selection of Yara&apos;s work across portraits, weddings, fashion, events, and more
        </p>
      </div>
      <div className="coverflow-wrapper">
        <Coverflow projects={projects} />
      </div>
    </section>
  );
}
