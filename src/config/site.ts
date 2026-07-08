import siteData from "./site.json";
import projectsData from "./projects.json";

export const { hero, about, services, portfolioBase } = siteData;

export interface ImageMeta {
  file: string;
  order: number;
  tags: string[];
}

export interface PortfolioProject {
  dir: string;
  title: string;
  body: string;
  images: string[];
}

const imageModules = import.meta.glob<{ default: string }>(
  "../assets/portfolio/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP}",
  { eager: true }
);

const resolveImage = (dir: string, file: string): string | undefined =>
  imageModules[`../assets/portfolio/${dir}/${file}`]?.default;

export const projects: PortfolioProject[] = (
  projectsData as { dir: string; title: string; body: string; images?: ImageMeta[] }[]
).map(({ dir, title, body, images = [] }) => {
  const resolved = [...images]
    .sort((a, b) => a.order - b.order)
    .map((img) => resolveImage(dir, img.file))
    .filter((src): src is string => Boolean(src));
  return { dir, title, body, images: resolved };
});
