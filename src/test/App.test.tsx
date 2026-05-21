import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "@/pages/Home";

describe("Home page", () => {
  it("renders the photographer name", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Yara Odeh" })).toBeInTheDocument();
  });

  it("renders the portfolio section heading", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText("Featured Work")).toBeInTheDocument();
  });
});
