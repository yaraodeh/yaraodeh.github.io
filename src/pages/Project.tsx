import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import { projects } from "@/config/site";
import "@/project.css";

export default function Project() {
  const { dir } = useParams<{ dir: string }>();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const project = projects.find((p) => p.dir === dir);

  useEffect(() => {
    if (!project) navigate("/");
  }, [project, navigate]);

  // Lock scroll on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!project) return;
    const total = project.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + total) % total);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const total = project.images.length;
    let startX = 0;
    const el = document.getElementById("carousel");
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) setCurrent((c) => (c + (diff > 0 ? 1 : -1) + total) % total);
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [project]);

  if (!project) return null;

  const { title, body, images } = project;
  const total = images.length;
  const goTo = (i: number) => setCurrent((i + total) % total);

  const bodyHTML = body
    .split(/\n\n+/)
    .map((p) => `<p>${p}</p>`)
    .join("");

  return (
    <>
      <Header />

      <div className="carousel" id="carousel">
        <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="carousel-slide">
              <img
                src={src}
                alt={i === 0 ? title : `${title} — ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-overlay" />

      <div className="carousel-title">
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: bodyHTML }} />
      </div>

      <button
        className="back-btn"
        onClick={() => navigate("/", { state: { scrollTo: "portfolio" } })}
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
        Portfolio
      </button>

      {total > 1 && (
        <>
          <button
            className="carousel-btn prev"
            onClick={() => goTo(current - 1)}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            className="carousel-btn next"
            onClick={() => goTo(current + 1)}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === current ? " active" : ""}`}
                aria-label={`Image ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <div className="carousel-counter">
            {current + 1} / {total}
          </div>
        </>
      )}
    </>
  );
}
