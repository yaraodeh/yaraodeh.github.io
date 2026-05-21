import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { PortfolioProject } from "@/config/site";
import "@/components/Coverflow/Coverflow.css";

interface Props {
  projects: PortfolioProject[];
}

export default function Coverflow({ projects }: Props) {
  const [current, setCurrent] = useState(0);
  const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
  const navigate = useNavigate();
  const total = projects.length;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setViewport({ w: window.innerWidth, h: window.innerHeight }), 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  useEffect(() => {
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [next]);

  useEffect(() => {
    let startX = 0,
      startY = 0;
    const el = document.getElementById("coverflowContainer");
    if (!el) return;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = startX - e.changedTouches[0].clientX;
      const dy = startY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        dx > 0 ? next() : prev();
      }
      startX = 0;
      startY = 0;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [prev, next]);

  const getStyle = (index: number): React.CSSProperties => {
    let offset = index - current;
    if (offset > total / 2) offset -= total;
    else if (offset < -total / 2) offset += total;

    let baseSpacing = 220;
    if (viewport.h > 900) baseSpacing = 250;
    else if (viewport.h < 768) baseSpacing = 180;
    if (viewport.w <= 480) baseSpacing = Math.min(baseSpacing * 0.7, 140);
    else if (viewport.w <= 768) baseSpacing = Math.min(baseSpacing * 0.8, 170);

    let translateZ = 0,
      rotateY = 0,
      scale = 1,
      opacity = 1;
    const abs = Math.abs(offset);

    if (offset === 0) {
      translateZ = 100;
      scale = 1.1;
    } else if (abs === 1) {
      rotateY = offset * -40;
      scale = 0.85;
      opacity = 0.7;
    } else if (abs === 2) {
      translateZ = -100;
      rotateY = offset * -50;
      scale = 0.7;
      opacity = 0.5;
    } else if (abs === 3) {
      translateZ = -150;
      rotateY = offset * -60;
      scale = 0.6;
      opacity = 0.3;
    } else {
      translateZ = -200;
      rotateY = offset * -70;
      scale = 0.5;
      opacity = 0.2;
    }

    return {
      transform: `translate(-50%, -50%) translateX(${offset * baseSpacing}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: total - abs,
    };
  };

  const handleItemClick = (index: number) => {
    if (index === current) {
      navigate(`/project/${projects[index].dir}`);
    } else {
      setCurrent(index);
    }
  };

  return (
    <>
      <div className="coverflow-container" id="coverflowContainer">
        {projects.map((p, i) => (
          <div
            key={p.dir}
            className="coverflow-item"
            data-index={i}
            data-dir={p.dir}
            style={getStyle(i)}
            onClick={() => handleItemClick(i)}
          >
            <img src={p.images[0]} alt={p.title} className="portfolio-image" />
            <div className="portfolio-overlay" />
            <div className="portfolio-category">{p.title}</div>
          </div>
        ))}
      </div>

      <div className="coverflow-controls">
        <button className="control-btn" id="prevBtn" onClick={prev}>
          ‹
        </button>
        <button className="control-btn" id="nextBtn" onClick={next}>
          ›
        </button>
      </div>

      <div className="indicators" id="indicators">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`indicator${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </>
  );
}
