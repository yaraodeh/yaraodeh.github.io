// Coverflow
class PhotoCoverflow {
  constructor() {
    this.items = document.querySelectorAll(".coverflow-item");
    this.indicators = document.querySelectorAll(".indicator");
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    this.autoPlaySpeed = 2000;
    this.init();
  }

  init() {
    this.updateCoverflow();
    this.bindEvents();
    setInterval(() => this.next(), this.autoPlaySpeed);
  }

  bindEvents() {
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prev());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.next());

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goTo(index));
    });

    this.items.forEach((item, index) => {
      item.addEventListener("click", () => {
        if (index !== this.currentIndex) this.goTo(index);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    let startX = 0,
      startY = 0;
    const container = document.getElementById("coverflowContainer");

    container.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    container.addEventListener(
      "touchend",
      (e) => {
        if (!startX || !startY) return;
        const diffX = startX - e.changedTouches[0].clientX;
        const diffY = startY - e.changedTouches[0].clientY;
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          diffX > 0 ? this.next() : this.prev();
        }
        startX = 0;
        startY = 0;
      },
      { passive: true },
    );

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.updateCoverflow(), 100);
    });
  }

  updateCoverflow() {
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    const viewportHeight = window.innerHeight;

    let baseSpacing = 220;
    if (viewportHeight > 900) baseSpacing = 250;
    else if (viewportHeight < 768) baseSpacing = 180;
    if (isSmallMobile) baseSpacing = Math.min(baseSpacing * 0.7, 140);
    else if (isMobile) baseSpacing = Math.min(baseSpacing * 0.8, 170);

    this.items.forEach((item, index) => {
      let offset = index - this.currentIndex;
      if (offset > this.totalItems / 2) offset -= this.totalItems;
      else if (offset < -this.totalItems / 2) offset += this.totalItems;

      let translateX = offset * baseSpacing;
      let translateZ = 0,
        rotateY = 0,
        scale = 1,
        opacity = 1;

      if (offset === 0) {
        translateZ = 100;
        scale = 1.1;
      } else if (Math.abs(offset) === 1) {
        rotateY = offset * -40;
        scale = 0.85;
        opacity = 0.7;
      } else if (Math.abs(offset) === 2) {
        translateZ = -100;
        rotateY = offset * -50;
        scale = 0.7;
        opacity = 0.5;
      } else if (Math.abs(offset) === 3) {
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

      item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = this.totalItems - Math.abs(offset);
    });

    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.totalItems) % this.totalItems;
    this.updateCoverflow();
  }
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    this.updateCoverflow();
  }
  goTo(index) {
    this.currentIndex = index;
    this.updateCoverflow();
  }
}

function loadCover() {
  const heroBg = document.querySelector(".hero-bg");
  if (heroBg) heroBg.style.backgroundImage = "url('cover/image.jpg')";
}

async function loadPortfolio() {
  const manifest = await fetch("portfolio/manifest.json").then((r) => r.json());

  const results = await Promise.all(
    manifest.map(async (dir) => {
      try {
        const [titleRes, bodyRes] = await Promise.all([
          fetch(`portfolio/${dir}/title.txt`),
          fetch(`portfolio/${dir}/body.txt`),
        ]);
        if (!titleRes.ok || !bodyRes.ok) return null;
        const [title, body] = await Promise.all([
          titleRes.text(),
          bodyRes.text(),
        ]);
        return { dir, title: title.trim(), body: body.trim() };
      } catch {
        return null;
      }
    }),
  );
  const items = results.filter(Boolean);

  const container = document.getElementById("coverflowContainer");
  const indicatorsEl = document.getElementById("indicators");

  container.innerHTML = items
    .map(
      (item, i) => `
      <div class="coverflow-item" data-index="${i}">
         <img src="portfolio/${item.dir}/image.jpg" alt="${item.title}" class="portfolio-image">
         <div class="portfolio-overlay"></div>
         <div class="portfolio-category">${item.title}</div>
      </div>`,
    )
    .join("");

  indicatorsEl.innerHTML = items
    .map(
      (_, i) =>
        `<div class="indicator${i === 0 ? " active" : ""}" data-index="${i}"></div>`,
    )
    .join("");

  new PhotoCoverflow();
}

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadCover();
  loadPortfolio();

  // Header scroll effect
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Active menu highlighting on scroll
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Check on load
});
