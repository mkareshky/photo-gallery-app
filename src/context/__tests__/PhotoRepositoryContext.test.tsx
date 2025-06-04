// src/context/__tests__/PhotoRepositoryContext.test.tsx
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { PhotoRepositoryProvider, usePhotoRepository } from "../PhotoRepositoryContext";
import type { Photo } from "../../types";

// 1. Mock usePhotoContext to return a known array of photos
jest.mock("../PhotoContext", () => ({
  usePhotoContext: () => ({
    photos: [
      {
        id: "10",
        author: "Mock Author",
        download_url: "https://example.com/10.jpg",
        width: 800,
        height: 600,
        url: "https://picsum.photos/id/10/800/600",
        title: "Mock Photo 10",
        upload_date: "2022-12-12T12:00:00.000Z",
        categories: ["Nature"],
      },
      {
        id: "20",
        author: "Mock Author 2",
        download_url: "https://example.com/20.jpg",
        width: 1024,
        height: 768,
        url: "https://picsum.photos/id/20/1024/768",
        title: "Mock Photo 20",
        upload_date: "2023-01-01T08:00:00.000Z",
        categories: ["City"],
      },
    ] as Photo[],
  }),
}));

// 2. Create a test consumer component that uses usePhotoRepository()
const Consumer: React.FC = () => {
  const repo = usePhotoRepository();

  // Display first photo's title and next/prev ids in data-testid spans
  const photos = repo.getPhotos();
  const first = photos[0];
  const nextId = repo.getNextPhotoId(first.id);
  const prevId = repo.getPrevPhotoId(first.id);

  return (
    <div>
      <span data-testid="first-title">{first.title}</span>
      <span data-testid="next-id">{nextId}</span>
      <span data-testid="prev-id">{prevId}</span>
    </div>
  );
};

describe("PhotoRepositoryContext", () => {
  it("provides a repository based on PhotoContext photos", () => {
    render(
      <PhotoRepositoryProvider>
        <Consumer />
      </PhotoRepositoryProvider>
    );

    // The mocked usePhotoContext returns two photos: IDs "10" and "20"
    // So first-title should be "Mock Photo 10"
    expect(screen.getByTestId("first-title")).toHaveTextContent("Mock Photo 10");

    // For ID="10", nextId should be "20"
    expect(screen.getByTestId("next-id")).toHaveTextContent("20");

    // For ID="10", prevId should wrap to last, which is "20"
    expect(screen.getByTestId("prev-id")).toHaveTextContent("20");
  });

  it("throws an error when usePhotoRepository is called outside its provider", () => {
    // Suppress console.error from React during expected error
    jest.spyOn(console, "error").mockImplementation(() => {});

    const BadConsumer: React.FC = () => {
      // Directly calling without provider should throw
      // Wrap in try/catch to prevent unhandled exception during render
      try {
        usePhotoRepository();
        return <div>Should not render</div>;
      } catch (e: any) {
        return <div data-testid="error">{e.message}</div>;
      }
    };

    render(<BadConsumer />);

    expect(screen.getByTestId("error")).toHaveTextContent(
      "PhotoRepositoryContext is not provided"
    );

    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });
});
