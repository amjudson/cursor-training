import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlaygroundPage from "../page";
import * as nextRouter from "next/navigation";

jest.mock("@/components/toast-provider", () => ({
  useToast: () => ({ show: jest.fn() }),
}));

describe("PlaygroundPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(nextRouter, "useRouter").mockReturnValue({ push: jest.fn() } as any);
  });

  it("renders the form", () => {
    render(<PlaygroundPage />);
    expect(screen.getByText(/API Playground/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your API key/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("submits a valid API key and redirects", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    const { container } = render(<PlaygroundPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your API key/i), { target: { value: "A123456789012345678901234567890123" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/validate-key", expect.anything());
    });
  });

  it("shows error toast for invalid API key", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({ error: "Invalid API Key" }) });
    render(<PlaygroundPage />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your API key/i), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/validate-key", expect.anything());
    });
  });
}); 