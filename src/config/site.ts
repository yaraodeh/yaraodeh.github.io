import siteData from "./site.json";
import projectsData from "./projects.json";

export const { hero, about, services } = siteData;

export interface PortfolioProject {
  dir: string;
  title: string;
  body: string;
  images: string[];
}

const imageModules = import.meta.glob<{ default: string }>(
  "../assets/portfolio/**/*-image.{jpg,jpeg,JPG,JPEG}",
  { eager: true }
);

export const projects: PortfolioProject[] = projectsData.map(({ dir, title, body }) => {
  const images = Object.entries(imageModules)
    .filter(([p]) => p.includes(`/portfolio/${dir}/`))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => mod.default);
  return { dir, title, body, images };
});
