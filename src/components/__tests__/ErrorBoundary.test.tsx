// src/components/__tests__/ErrorBoundary.test.tsx
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBoundary } from "../ErrorBoundary";

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it("catches an error from a child and displays fallback UI with the error message", () => {
    const Bomb: React.FC = () => {
      throw new Error("Boom!");
    };

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText("Boom!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try again/i })).toBeInTheDocument();
  });

  it("resets to rendering children again after clicking 'Try again'", () => {
    let shouldThrow = true;
    const TestComponent: React.FC = () => {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div data-testid="child">Child works</div>;
    };

    render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();

    shouldThrow = false;

    fireEvent.click(screen.getByRole("button", { name: /Try again/i }));

    expect(screen.getByTestId("child")).toHaveTextContent("Child works");
  });
});
