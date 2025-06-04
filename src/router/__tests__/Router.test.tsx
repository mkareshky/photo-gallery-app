// src/router/__tests__/Router.test.tsx
/**
 * @jest-environment jsdom
 */

// 1. Mock usePhotos before importing anything that uses PhotoContext
import type { Photo } from "../../types";

const mockPhotos: Photo[] = [
  {
    id: "1",
    author: "Author One",
    download_url: "https://example.com/1.jpg",
    width: 500,
    height: 500,
    url: "https://picsum.photos/id/1/500/500",
    title: "Test Photo 1",
    upload_date: "2021-01-01T12:00:00.000Z",
    categories: ["Nature"],
  },
  {
    id: "2",
    author: "Author Two",
    download_url: "https://example.com/2.jpg",
    width: 600,
    height: 400,
    url: "https://picsum.photos/id/2/600/400",
    title: "Test Photo 2",
    upload_date: "2022-02-02T12:00:00.000Z",
    categories: ["City"],
  },
];

jest.mock("../../hooks/usePhotos", () => ({
  usePhotos: () => ({
    photos: mockPhotos,
    loading: false,
    error: null,
    loadMore: jest.fn(),
    hasMore: false,
  }),
}));

import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PhotoProvider } from "../../context/PhotoContext";
import { PhotoRepositoryProvider } from "../../context/PhotoRepositoryContext";
import GalleryPage from "../../pages/GalleryPage";
import PhotoDetailPage from "../../pages/PhotoDetailPage";

describe("Router Integration Tests", () => {
  const renderWithProviders = (initialEntries: string[]) => {
    return render(
      <PhotoProvider>
        <PhotoRepositoryProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <Routes>
              <Route path="/" element={<GalleryPage />} />
              <Route path="/photos/:id" element={<PhotoDetailPage />} />
            </Routes>
          </MemoryRouter>
        </PhotoRepositoryProvider>
      </PhotoProvider>
    );
  };

  it('renders PhotoDetailPage at "/photos/1"', async () => {
    renderWithProviders(["/photos/1"]);

    // Now that usePhotos is mocked, PhotoDetailPage should show "Test Photo 1"
    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });
  });

  it("navigates from GalleryPage to PhotoDetailPage when a photo link is clicked", async () => {
    renderWithProviders(["/"]);

    // Wait for GalleryPage to render items; check for "Author One"
    await waitFor(() => {
      expect(screen.getByText(/Author One/i)).toBeInTheDocument();
    });

    // Get all links; the first link corresponds to photo ID=1
    const allLinks = screen.getAllByRole("link");
    await userEvent.click(allLinks[0]);

    // After clicking, PhotoDetailPage for ID=1 should appear
    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });
  });
});
