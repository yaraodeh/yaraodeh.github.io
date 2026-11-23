import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock("@emailjs/browser", () => ({
  default: { send: mocks.sendEmail },
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => "server-timestamp"),
  setDoc: mocks.setDoc,
}));

vi.mock("@/lib/firebase", () => ({ db: {} }));

describe("Booking customer email", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.sendEmail.mockResolvedValue({ status: 200, text: "OK" });
    vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a cash-only confirmation email to the booking customer", async () => {
    const { default: Booking } = await import("@/components/Booking/Booking");

    render(
      <MemoryRouter>
        <Booking />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Individual portraits/ }));
    fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "A Client" } });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "client@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Review my session/ }));
    fireEvent.click(screen.getByRole("button", { name: /Send booking request/ }));

    await waitFor(() => expect(mocks.sendEmail).toHaveBeenCalledTimes(2));
    expect(mocks.sendEmail).toHaveBeenNthCalledWith(
      2,
      "service_qchijsr",
      "template_tf3qxwd",
      expect.objectContaining({
        to_email: "client@example.com",
        client_name: "A Client",
        payment_method: "Cash",
      }),
      expect.any(String)
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "A confirmation email was sent to client@example.com"
    );
  });
});
