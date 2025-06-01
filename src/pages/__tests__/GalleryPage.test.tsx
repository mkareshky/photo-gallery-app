/**
 * @jest-environment jsdom
 */

import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import {
  screen,
  render,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PhotoContext } from "../../context/PhotoContext";
import { GalleryPage } from "../GalleryPage";
import type { Photo, PhotoContextType } from "../../types";

const mockPhotos: Photo[] = [
  {
    id: "1",
    author: "Alice",
    download_url: "https://example.com/1.jpg",
    width: 500,
    height: 400,
    url: "https://picsum.photos/id/1/500/400",
    title: "Photo by Alice",
    upload_date: "2021-01-01T12:00:00.000Z",
    categories: ["Nature"],
  },
  {
    id: "2",
    author: "Bob",
    download_url: "https://example.com/2.jpg",
    width: 600,
    height: 450,
    url: "https://picsum.photos/id/2/600/450",
    title: "Photo by Bob",
    upload_date: "2022-02-02T12:00:00.000Z",
    categories: ["City"],
  },
];

describe("GalleryPage component", () => {
  it("Must display the initial list of photos", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });
  });

  it("Must allow searching by title and only show matching items", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search...");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "Alice");

    await waitFor(
      () => {
        expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
        expect(screen.queryByText(/Photo by Bob/i)).toBeNull();
      },
      { timeout: 1500 }
    );
  });

  it("Must allow filtering by category", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    // Click the “All Categories” combobox trigger
    const categoryTrigger = screen.getByRole("combobox", { name: /All Categories/i });
    await userEvent.click(categoryTrigger);

    // Now pick "City"
    const cityOption = await screen.findByText("City");
    await userEvent.click(cityOption);

    // Only Bob should remain
    await waitFor(
      () => {
        expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
        expect(screen.queryByText(/Photo by Alice/i)).toBeNull();
      },
      { timeout: 500 }
    );
  });

  it("Must allow filtering by upload date", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    const { container } = render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    // Find the <input type="date"> directly
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    if (!dateInput) {
      throw new Error("Date input not found");
    }

    // Use fireEvent.change so that onChange fires properly
    fireEvent.change(dateInput, { target: { value: "2022-02-02" } });

    // Now only Bob should appear
    await waitFor(
      () => {
        expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
        expect(screen.queryByText(/Photo by Alice/i)).toBeNull();
      },
      { timeout: 500 }
    );
  });

  it("Must allow clearing filters and show all photos again", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    // Type “Alice” into search
    const searchInput = screen.getByPlaceholderText("Search...");
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "Alice");
    await waitFor(
      () => {
        expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
        expect(screen.queryByText(/Photo by Bob/i)).toBeNull();
      },
      { timeout: 500 }
    );

    // Click “Clear Filters”
    const clearButton = screen.getByRole("button", { name: /Clear Filters/i });
    await userEvent.click(clearButton);

    // Both photos should return
    await waitFor(
      () => {
        expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
        expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it("If loading=true, it should show 'Loading more photos...'", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: [],
      loading: true,
      error: null,
      loadMore: jest.fn(),
      hasMore: true,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    expect(screen.getByText(/Loading more photos\.\.\./i)).toBeInTheDocument();
  });

  it("If hasMore=false and loading=false, it should show 'No more photos to load.'", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
    };

    render(
      <PhotoContext.Provider value={fakeContextValue}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<GalleryPage />} />
          </Routes>
        </MemoryRouter>
      </PhotoContext.Provider>
    );

    expect(screen.getByText(/No more photos to load\./i)).toBeInTheDocument();
  });
});
