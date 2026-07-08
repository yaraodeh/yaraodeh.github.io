import siteData from "./site.json";
import projectsData from "./projects.json";

export const { hero, about, services } = siteData;

export interface ImageMeta {
  url: string;
  order: number;
  tags: string[];
}

export interface PortfolioProject {
  dir: string;
  title: string;
  body: string;
  images: string[];
}

export const projects: PortfolioProject[] = (
  projectsData as { dir: string; title: string; body: string; images?: ImageMeta[] }[]
).map(({ dir, title, body, images = [] }) => {
  const resolved = [...images]
    .sort((a, b) => a.order - b.order)
    .map((img) => img.url);
  return { dir, title, body, images: resolved };
});
