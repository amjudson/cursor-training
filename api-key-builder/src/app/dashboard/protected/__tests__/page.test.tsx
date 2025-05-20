import { render, screen, waitFor } from "@testing-library/react";
import ProtectedPage from "../page";
import * as nextRouter from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProtectedPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders protected content if access is granted", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    (nextRouter.useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    render(<ProtectedPage />);
    const headings = await screen.findAllByText(/Protected Playground/i);
    expect(headings.length).toBeGreaterThan(0);
    expect(await screen.findByText(/Welcome to the protected playground area/i)).toBeInTheDocument();
  });

  it("redirects if access is denied", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Unauthorized" }) });
    const push = jest.fn();
    (nextRouter.useRouter as jest.Mock).mockReturnValue({ push });
    render(<ProtectedPage />);
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/playground");
    });
  });
}); 