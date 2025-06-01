/**
 * @jest-environment jsdom
 */

import { screen, waitFor, act } from "@testing-library/react";

beforeAll(() => {
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.appendChild(root);
});

describe("Main entry point (main.tsx)", () => {
  it("renders the Photo Gallery heading into #root without crashing", async () => {
    await act(async () => {
      await import("../main");
    });

    await waitFor(() => {
      expect(screen.getByText(/Photo Gallery/i)).toBeInTheDocument();
    });
  });
});
