/**
 * @jest-environment jsdom
 */

import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PhotoDetailPage from "../PhotoDetailPage";
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

import { PhotoProvider } from "../../context/PhotoContext";

describe("PhotoDetailPage", () => {
  it('When the URL is "/photos/1", it should display the details of the first photo', async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/1"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /Previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("When clicking Next, it should navigate to the details of the next photo (ID=2)", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/1"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 2/i)).toBeInTheDocument();
    });
  });

  it("When clicking Previous on the first photo, it should wrap to the last photo (ID=2)", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/1"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 2/i)).toBeInTheDocument();
    });
  });

  it("When the URL is '/photos/2', clicking Next wraps to first photo (ID=1)", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/2"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 2/i)).toBeInTheDocument();
    });

    const nextButton = screen.getByRole("button", { name: /Next/i });
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });
  });

  it("When the URL is '/photos/2', clicking Previous goes to photo with ID=1", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/2"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 2/i)).toBeInTheDocument();
    });

    const prevButton = screen.getByRole("button", { name: /Previous/i });
    await userEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });
  });

  it("When URL references a non‐existent ID, it should render 'Photo not found'", () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/999"]}>
          <Routes>
            <Route path="/" element={<div>Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    expect(screen.getByText(/Photo not found/i)).toBeInTheDocument();
  });

  it("Clicking “Back to Gallery” navigates to `/`", async () => {
    render(
      <PhotoProvider>
        <MemoryRouter initialEntries={["/photos/1"]}>
          <Routes>
            <Route path="/" element={<div data-testid="home">Gallery Home</div>} />
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test Photo 1/i)).toBeInTheDocument();
    });

    const backButton = screen.getByRole("button", { name: /Back to Gallery/i });
    await userEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId("home")).toBeInTheDocument();
      expect(screen.getByText(/Gallery Home/i)).toBeInTheDocument();
    });
  });
});
