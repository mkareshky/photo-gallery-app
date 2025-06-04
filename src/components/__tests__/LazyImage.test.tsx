// src/components/__tests__/LazyImage.test.tsx
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { LazyImage } from "../LazyImage";

describe("LazyImage component", () => {
  let intersectionCallback: ((entries: IntersectionObserverEntry[]) => void) | null = null;
  let observedElement: Element | null = null;
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;
  let mockIntersectionObserver: jest.Mock;

  beforeAll(() => {
    observeMock = jest.fn((element: Element) => {
      observedElement = element;
    });
    disconnectMock = jest.fn();

    mockIntersectionObserver = jest.fn().mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: observeMock,
        disconnect: disconnectMock,
      };
    });

    // @ts-ignore
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterAll(() => {
    // @ts-ignore
    delete window.IntersectionObserver;
  });

  it("renders placeholder div initially and then loads the image when manually intersecting", async () => {
    const src = "https://example.com/photo.jpg";
    const alt = "Example Photo";

    const { container } = render(
      <LazyImage
        src={src}
        alt={alt}
        placeholderHeight={150}
        placeholderBg="#abcdef"
      />
    );

    // Initially, since intersectionCallback hasn't been invoked, only a placeholder <div> is rendered.
    // container.firstChild is the outer <div>, whose first child is the placeholder <div>.
    const rootDiv = container.firstElementChild as HTMLElement;
    const placeholderDiv = rootDiv.querySelector("div");
    expect(placeholderDiv).toBeInTheDocument();
    expect(placeholderDiv).toHaveStyle({
      width: "100%",
      height: "150px",
      backgroundColor: "#abcdef",
    });

    // No <img> yet:
    expect(screen.queryByRole("img")).toBeNull();

    // Simulate intersection:
    act(() => {
      intersectionCallback &&
        intersectionCallback([
          { isIntersecting: true, target: observedElement! } as IntersectionObserverEntry,
        ]);
    });

    // Now the <img> should appear
    const img = await screen.findByRole("img", { name: alt });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", src);
    expect(img).toHaveAttribute("loading", "lazy");

    // Verify observer.observe was called once
    expect(observeMock).toHaveBeenCalledWith(observedElement);
    // Verify observer.disconnect was called once
    expect(disconnectMock).toHaveBeenCalled();
  });

  it("uses default placeholderHeight and placeholderBg when none are provided", () => {
    const src = "https://example.com/another.jpg";
    const alt = "Another Photo";

    const { container } = render(<LazyImage src={src} alt={alt} />);

    // Before intersection, placeholder should use defaults: height=200px, bg="#f0f0f0"
    const rootDiv = container.firstElementChild as HTMLElement;
    const placeholderDiv = rootDiv.querySelector("div");
    expect(placeholderDiv).toBeInTheDocument();
    expect(placeholderDiv).toHaveStyle({
      width: "100%",
      height: "200px",
      backgroundColor: "#f0f0f0",
    });

    // No <img> yet
    expect(screen.queryByRole("img")).toBeNull();
  });
});
