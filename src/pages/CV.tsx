import Header from "@/components/Header/Header";
import "@/pages/CV.css";

export default function CV() {
  return (
    <>
      <Header />
      <div className="cv-container">
      <div className="cv-page">
        <div className="cv-header">
          <div className="cv-name">Yara Odeh</div>
          <div className="cv-role">Photographer — Documentary, Portrait, Street &amp; Fine Art</div>
          <div className="cv-contact">
            <span>
              <svg
                className="cv-ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.4 17.5c0 .3-.1.6-.3.8a8.4 8.4 0 0 1-1.6 1.4 7 7 0 0 1-2 .8c-3.6 1-7.7-.6-11-3.9S1.1 8.8 2.1 5.2a7 7 0 0 1 .8-2c.4-.6.9-1.1 1.4-1.6.2-.2.5-.3.8-.3h2.6c.5 0 1 .3 1.1.8l1 3.4c.1.4 0 .9-.3 1.2L8 8.3c1 2 2.7 3.7 4.7 4.7l1.6-1.5c.3-.3.8-.4 1.2-.3l3.4 1c.5.1.8.6.8 1.1z" />
              </svg>
              +34 625 950 563
            </span>
            <span>
              <svg
                className="cv-ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 5h18v14H3z" />
                <path d="M3 6l9 7 9-7" />
              </svg>
              <a href="mailto:yaraodehph@gmail.com">yaraodehph@gmail.com</a>
            </span>
            <span>
              <svg
                className="cv-ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9s1.3-6.5 3.8-9z" />
              </svg>
              <a href="https://yara.odeh.app/">yara.odeh.app</a>
            </span>
            <span>
              <svg
                className="cv-ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M7 10v7M7 7v.01M11 17v-4.5a1.5 1.5 0 0 1 3 0V17M14 17v-4.5a2 2 0 0 1 4 0V17" />
              </svg>
              <a href="https://www.linkedin.com/in/yaraodeh">/in/yaraodeh</a>
            </span>
            <span>
              <svg
                className="cv-ic"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Barcelona, Spain
            </span>
          </div>
        </div>

        <p className="cv-statement">
          Photographer with 4+ years of freelance experience, based in Barcelona and working across
          documentary, portrait, street, architecture, nature, and fine art, currently completing a
          Master's in Photography and Design at Elisava. Exhibited work across Barcelona and
          Catalonia, with freelance experience managing photography projects end to end — from shoot
          through post-production and client delivery.
        </p>

        <section>
          <div className="cv-eyebrow">Experience</div>

          <div className="cv-entry">
            <div className="cv-row">
              <div className="cv-title">Freelance Photographer · Self-employed</div>
              <div className="cv-date">2022 – Present</div>
            </div>
            <ul className="cv-desc">
              <li>Shoot weddings, proms, graduations, and private events for individual clients.</li>
              <li>Provide Airbnb listing photography for hosts to showcase their properties.</li>
              <li>Cover portrait sessions for individuals and families.</li>
              <li>Edit and retouch all images in Adobe Lightroom and Photoshop.</li>
              <li>Use Claude AI to streamline client communication, scheduling, and workflow organisation.</li>
              <li>Manage client communication, scheduling, and final delivery independently.</li>
            </ul>
          </div>

          <div className="cv-entry">
            <div className="cv-row">
              <div className="cv-title">Volunteer Photographer &amp; Childcare Support · Montblanc &amp; Terral</div>
              <div className="cv-date">March 2026 – Present</div>
            </div>
            <ul className="cv-desc">
              <li>Committed daily volunteer role, present on-site every day to support the organisation's work.</li>
              <li>Care for children day to day, supporting their schoolwork and activities.</li>
              <li>Photograph the children's everyday moments, gatherings, and events.</li>
              <li>Edit and deliver images for the organisation's communications and outreach.</li>
            </ul>
          </div>
        </section>

        <section>
          <div className="cv-eyebrow">Exhibitions</div>
          <div className="cv-exh-row">
            <div className="cv-exh-year">2026</div>
            <div>
              <div className="cv-exh-title">Presence</div>
              <div className="cv-exh-venue">Nau Bostik, Barcelona</div>
              <div className="cv-exh-series">Series: This Sea Is Mine</div>
            </div>
          </div>
          <div className="cv-exh-row">
            <div className="cv-exh-year">2026</div>
            <div>
              <div className="cv-exh-title">
                <a
                  href="https://www.fundaciovilacasas.com/en/exhibition/elisava-el-mar-sempre-el-mar"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  El mar, sempre el mar
                </a>
              </div>
              <div className="cv-exh-venue">Can Framis Museum, Barcelona</div>
            </div>
          </div>
          <div className="cv-exh-row">
            <div className="cv-exh-year">2026</div>
            <div>
              <div className="cv-exh-title">Identity</div>
              <div className="cv-exh-venue">Fine Art Igualada, Igualada</div>
              <div className="cv-exh-series">Series: The Art of Silence</div>
            </div>
          </div>
        </section>

        <section>
          <div className="cv-eyebrow">Education</div>
          <div className="cv-entry">
            <div className="cv-row">
              <div className="cv-title">Master's in Photography and Design</div>
              <div className="cv-date">2025 – Present</div>
            </div>
            <div className="cv-sub">Elisava, Barcelona School of Design and Engineering · Barcelona, Spain</div>
          </div>
          <div className="cv-entry">
            <div className="cv-row">
              <div className="cv-title cv-title-secondary">B.A. in Economics, Birzeit University</div>
              <div className="cv-date">2018 – 2022</div>
            </div>
          </div>
        </section>

        <section>
          <div className="cv-eyebrow">Skills &amp; Languages</div>
          <div className="cv-twocol">
            <div className="cv-skill-line">
              <b>Software</b>
              <br />
              Adobe Lightroom, Adobe Photoshop, CapCut, Canva, Claude AI
            </div>
            <div className="cv-skill-line">
              <b>Areas</b>
              <br />
              Documentary, portrait, street, architecture, nature &amp; fine art photography, event
              &amp; Airbnb listing photography, photo retouching, video editing
            </div>
          </div>
          <div className="cv-skill-line cv-skill-line-languages">
            <b>Languages</b>
            <br />
            Arabic (Native) · English (Fluent) · Spanish (Beginner)
          </div>
        </section>
      </div>
      </div>
    </>
  );
}
