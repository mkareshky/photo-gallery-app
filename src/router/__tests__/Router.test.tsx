import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PhotoProvider } from "../../context/PhotoContext";
import { GalleryPage } from "../../pages/GalleryPage";
import { PhotoDetailPage } from "../../pages/PhotoDetailPage";

const mockPhotos = [
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

jest.mock("axios", () => ({
  get: () => Promise.resolve({ data: mockPhotos }),
}));

describe("Router Integration Tests", () => {
  it('renders GalleryPage at "/"', async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Author One/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Author Two/i)).toBeInTheDocument();
    });
  });

  it('renders PhotoDetailPage at "/photos/:id"', async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/1"]}>
          <Routes>
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Author One/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
  });

  it("navigates from GalleryPage to PhotoDetailPage when a photo link is clicked", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Author One/i)).toBeInTheDocument();
    });

    const firstPhotoLink = screen.getByRole("link", {
      name: /Photo by Author One/i,
    });
    await userEvent.click(firstPhotoLink);

    await waitFor(() => {
      expect(screen.getByText(/Photo by Author One/i)).toBeInTheDocument();
    });
  });
});
