import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header/Header";
import { projects } from "@/config/site";
import "@/project.css";

const MIN_HEIGHT = 320;

export default function Project() {
  const { dir } = useParams<{ dir: string }>();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [carouselHeight, setCarouselHeight] = useState<number | null>(null);

  const project = projects.find((p) => p.dir === dir);
  const images = project?.images ?? [];

  const carouselRef = useRef<HTMLDivElement>(null);
  const aspectRatios = useRef<Record<number, number>>({});

  const fitToImage = useCallback((index: number) => {
    const aspect = aspectRatios.current[index];
    const el = carouselRef.current;
    if (!aspect || !el) return;
    const width = el.clientWidth;
    const maxHeight = window.innerHeight * 0.85;
    const height = Math.min(width / aspect, maxHeight);
    setCarouselHeight(Math.max(height, MIN_HEIGHT));
  }, []);

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    aspectRatios.current[index] = img.naturalWidth / img.naturalHeight;
    if (index === current) fitToImage(index);
  };

  useEffect(() => {
    fitToImage(current);
  }, [current, fitToImage]);

  useEffect(() => {
    const onResize = () => fitToImage(current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [current, fitToImage]);

  useEffect(() => {
    if (!project) navigate("/");
  }, [project, navigate]);

  useEffect(() => {
    setExpanded(false);
    setCurrent(0);
    aspectRatios.current = {};
    setCarouselHeight(null);
  }, [dir]);

  useEffect(() => {
    if (!project) return;
    const total = images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent((c) => (c - 1 + total) % total);
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, images.length]);

  useEffect(() => {
    if (!project) return;
    const total = images.length;
    let startX = 0;
    const el = document.getElementById("carousel");
    if (!el) return;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
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
  }, [project, images.length]);

  if (!project) return null;

  const { title, body } = project;
  const total = images.length;
  const goTo = (i: number) => setCurrent((i + total) % total);

  const paragraphs = body.split(/\n\n+/);
  const bodyHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
  const collapsible = paragraphs.length > 1 || body.length > 160;

  return (
    <div className="project-page">
      <Header />

      <div
        className="carousel"
        id="carousel"
        ref={carouselRef}
        style={carouselHeight ? { height: carouselHeight } : undefined}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="carousel-slide">
              <img
                src={src}
                alt={i === 0 ? title : `${title} — ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                onLoad={(e) => handleImageLoad(i, e.currentTarget)}
              />
            </div>
          ))}
        </div>

        <div className="carousel-overlay" />

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
      </div>

      <div className={`project-info${expanded ? " expanded" : ""}`}>
        <h1>{title}</h1>
        <div
          className={`carousel-body${collapsible ? " clamped" : ""}`}
          dangerouslySetInnerHTML={{ __html: bodyHTML }}
        />
        {collapsible && (
          <button className="carousel-body-toggle" onClick={() => setExpanded((e) => !e)}>
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </div>
  );
}
