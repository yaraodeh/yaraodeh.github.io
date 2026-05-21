import "@/components/ContactSection/ContactSection.css";

export default function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="section-header reveal">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Ready to book a session or have a question? Reach out to Yara
          </p>
        </div>
        <div className="contact-info reveal">
          <a href="mailto:yaraodehph@gmail.com" className="contact-item">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
              </svg>
            </div>
            <div className="contact-label">Email</div>
            <div className="contact-value">yaraodehph@gmail.com</div>
          </a>
          <a href="tel:+34625950563" className="contact-item">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24">
                <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" />
              </svg>
            </div>
            <div className="contact-label">Phone</div>
            <div className="contact-value">+34 625 950 563</div>
          </a>
          <a
            href="https://instagram.com/yara.photography_22"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-item"
          >
            <div className="contact-icon">
              <svg viewBox="0 0 24 24">
                <path d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2M7.6 4C5.61 4 4 5.61 4 7.6V16.4C4 18.39 5.61 20 7.6 20H16.4C18.39 20 20 18.39 20 16.4V7.6C20 5.61 18.39 4 16.4 4H7.6M17.25 5.5C17.94 5.5 18.5 6.06 18.5 6.75S17.94 8 17.25 8S16 7.44 16 6.75S16.56 5.5 17.25 5.5M12 7C14.76 7 17 9.24 17 12S14.76 17 12 17S7 14.76 7 12S9.24 7 12 7M12 9C10.34 9 9 10.34 9 12S10.34 15 12 15S15 13.66 15 12S13.66 9 12 9Z" />
              </svg>
            </div>
            <div className="contact-label">Instagram</div>
            <div className="contact-value">@yara.photography_22</div>
          </a>
          <div className="contact-item">
            <div className="contact-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5S14.5 7.62 14.5 9S13.38 11.5 12 11.5Z" />
              </svg>
            </div>
            <div className="contact-label">Based In</div>
            <div className="contact-value">Barcelona, Spain</div>
          </div>
        </div>
      </div>
    </section>
  );
}
