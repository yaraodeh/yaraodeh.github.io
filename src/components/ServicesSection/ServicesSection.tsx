import { services } from "@/config/site";
import "@/components/ServicesSection/ServicesSection.css";

export default function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <div className="section-header reveal">
          <h2 className="section-title">Services Offered</h2>
          <p className="section-subtitle">
            From weddings to editorial shoots — Yara brings your vision to life
          </p>
        </div>
        <div className="services-grid reveal">
          {services.map(({ title, desc, icon }) => (
            <div className="service-card" key={title}>
              <div className="service-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d={icon} />
                </svg>
              </div>
              <h3 className="service-title">{title}</h3>
              <p className="service-description">{desc}</p>
              <div className="service-price">Get in Touch</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
