import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/components/Header/Header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (section: string) => {
    setMenuOpen(false);
    if (section === "cv") {
      navigate("/cv");
    } else if (section === "volunteering") {
      navigate("/volunteering");
    } else if (isHome) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: section } });
    }
  };

  const navItems: Array<{ id: string; label: string }> = [
    { id: "home", label: "Home" },
    { id: "portfolio", label: "Portfolio" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "cv", label: "CV" },
    { id: "volunteering", label: "Volunteering" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header id="header" className={scrolled ? "scrolled" : ""}>
      <nav>
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("home");
          }}
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18ZM12 10C10.34 10 9 11.34 9 13C9 14.66 10.34 16 12 16C13.66 16 15 14.66 15 13C15 11.34 13.66 10 12 10Z" />
          </svg>
          Yara Odeh
        </a>

        <ul className={`nav-menu${menuOpen ? " active" : ""}`}>
          {navItems.map(({ id, label }) => (
            <li key={id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(id);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className={`menu-toggle${menuOpen ? " active" : ""}`}
          onClick={() => setMenuOpen((m) => !m)}
        >
          <span />
          <span />
          <span />
        </div>
      </nav>
    </header>
  );
}
