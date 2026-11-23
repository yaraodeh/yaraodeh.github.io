import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Header from "@/components/Header/Header";

function CurrentPath() {
  const { pathname } = useLocation();
  return <span data-testid="current-path">{pathname}</span>;
}

describe("Header navigation", () => {
  it("groups the CV and volunteering pages and keeps Booking available", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
        <CurrentPath />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Booking" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "CV & Volunteering" }));

    expect(screen.getByRole("link", { name: "Volunteering" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("link", { name: "CV" }));
    expect(screen.getByTestId("current-path")).toHaveTextContent("/cv");
  });
});
