import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import HeroSection from "@/components/HeroSection/HeroSection";
import PortfolioSection from "@/components/PortfolioSection/PortfolioSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import ServicesSection from "@/components/ServicesSection/ServicesSection";
import ContactSection from "@/components/ContactSection/ContactSection";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const target = state.scrollTo;
      setTimeout(
        () => document.getElementById(target)?.scrollIntoView({ behavior: "smooth" }),
        100
      );
    }
  }, [location.state]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("active");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -150px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <HeroSection />
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </>
  );
}
