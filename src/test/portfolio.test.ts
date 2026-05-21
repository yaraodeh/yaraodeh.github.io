import { describe, it, expect } from "vitest";
import { projects } from "@/config/site";

describe("portfolio data", () => {
  it("loads at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has a non-empty dir, title, and at least one image", () => {
    for (const p of projects) {
      expect(p.dir).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.images.length).toBeGreaterThan(0);
    }
  });

  it("project dirs are unique", () => {
    const dirs = projects.map((p) => p.dir);
    expect(new Set(dirs).size).toBe(dirs.length);
  });

  it("image URLs are strings", () => {
    for (const p of projects) {
      for (const img of p.images) {
        expect(typeof img).toBe("string");
        expect(img.length).toBeGreaterThan(0);
      }
    }
  });
});
