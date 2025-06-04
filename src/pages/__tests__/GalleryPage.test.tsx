// src/pages/__tests__/GalleryPage.test.tsx
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
import GalleryPage from "../GalleryPage";
import type { Photo, PhotoContextType } from "../../types";

jest.mock("../../hooks/useDebounce", () => ({
  useDebounce: (value: string) => value,
}));

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
    categories: ["Nature", "People"],
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
    categories: ["City", "Tech"],
  },
];

describe("GalleryPage component", () => {
  it("Must display the initial list of photos (category='all')", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

  it("Must display fallback title when `photo.title` is falsy", async () => {
    const photosWithNoTitle: Photo[] = [
      {
        id: "3",
        author: "Zed",
        download_url: "https://example.com/3.jpg",
        width: 300,
        height: 200,
        url: "https://picsum.photos/id/3/300/200",
        title: "",
        upload_date: "2020-03-03T12:00:00.000Z",
        categories: ["Nature"],
      },
    ];

    const fakeContextValue: PhotoContextType = {
      photos: photosWithNoTitle,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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
      expect(screen.getByText(/Photo by Zed/i)).toBeInTheDocument();
    });
  });

  it("Must allow searching by title and only show matching items", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.queryByText(/Photo by Bob/i)).toBeNull();
    });
  });

  it("Must allow filtering by upload date when `photo.upload_date` is undefined or unmatched", async () => {
    const photosMissingDate: Photo[] = [
      {
        id: "4",
        author: "Yara",
        download_url: "https://example.com/4.jpg",
        width: 450,
        height: 450,
        url: "https://picsum.photos/id/4/450/450",
        title: "Photo by Yara",
        // upload_date omitted → undefined
        categories: ["People"],
      },
    ];

    const fakeContextValue: PhotoContextType = {
      photos: photosMissingDate,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    if (!dateInput) throw new Error("Date input not found");

    fireEvent.change(dateInput, { target: { value: "2021-01-01" } });

    await waitFor(() => {
      expect(screen.queryByText(/Photo by Yara/i)).toBeNull();
    });
  });

  it("Must allow clearing filters and show all photos again", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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
    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.queryByText(/Photo by Bob/i)).toBeNull();
    });

    const clearButton = screen.getByRole("button", { name: /Clear Filters/i });
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });
  });

  it("If loading=true, it shows 'Loading more photos...'", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: [],
      loading: true,
      error: null,
      loadMore: jest.fn(),
      hasMore: true,
      retry: jest.fn(),
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

  it("If hasMore=true & loading=false, it shows no extra footer", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: [mockPhotos[0]],
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: true,
      retry: jest.fn(),
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

    expect(screen.queryByText(/Loading more photos\.\.\./i)).toBeNull();
    expect(screen.queryByText(/No more photos to load\./i)).toBeNull();
  });

  it("If hasMore=false & loading=false, it shows 'No more photos to load.'", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

  it("Shows an error message when context.error is non‐null", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: [],
      loading: false,
      error: "Network failed",
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

    expect(screen.getByText(/Network failed/i)).toBeInTheDocument();
  });

  it("Calls loadMore() when intersection occurs (hasMore=true & !loading)", async () => {
    const mockLoad = jest.fn();
    class MockObserver {
      cb: IntersectionObserverCallback;
      constructor(cb: IntersectionObserverCallback) {
        this.cb = cb;
      }
      observe(_el: Element) {
        // Simulate isIntersecting = true
        this.cb(
          [{ isIntersecting: true, target: {} as Element } as IntersectionObserverEntry],
          this as any
        );
      }
      unobserve() { }
      disconnect() { }
    }
    // @ts-ignore
    window.IntersectionObserver = MockObserver;

    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: mockLoad,
      hasMore: true,
      retry: jest.fn(),
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
      expect(mockLoad).toHaveBeenCalled();
    });
  });

  it("Covers matchesCategory nested‐false branch when category is empty string", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
    };

    // Spy on React.useState and override only the 2nd call (category state)
    const useStateSpy = jest.spyOn(React as any, "useState") as any;
    let callCount = 0;
    useStateSpy.mockImplementation((initial: any) => {
      callCount += 1;
      // The 2nd useState call is `category`:
      if (callCount === 2) {
        return ["", jest.fn()]; // force category = ""
      }
      // All other states: [initial, setter]
      return [initial, jest.fn()];
    });

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

    // Restore original useState
    useStateSpy.mockRestore();
  });

  /**
* 1) CATEGORY‐FILTER TEST (hits the `.map((c)=>c.toLowerCase())` branch)
* 
* Note: FilterPanel renders a Radix‐style combobox `<button aria-label="All Categories">…</button>`,
* so we find it by role/name, click to open, then pick “Tech” from the list.
*/
  it("Must allow filtering by a non‐all category (hits the `.map((c)=>c.toLowerCase())` branch)", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

    // 1) Verify both photos are visible initially (category="all")
    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    // 2) Find and click the "All Categories" combobox button
    const categoryButton = screen.getByRole("combobox", { name: /All Categories/i });
    expect(categoryButton).toBeInTheDocument();
    await userEvent.click(categoryButton);

    // 3) Wait for the "Tech" option to appear, then click it
    const techOption = await screen.findByText("Tech");
    await userEvent.click(techOption);

    // 4) Now only Bob’s card (which has category "Tech") should remain
    await waitFor(() => {
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
      expect(screen.queryByText(/Photo by Alice/i)).toBeNull();
    });
  });

  /**
   * 2) UPLOAD‐DATE‐MATCH TEST (hits the `.startsWith(...)` branch)
   */
  it("Must allow filtering by upload date when it actually matches `.startsWith(...)`", async () => {
    const fakeContextValue: PhotoContextType = {
      photos: mockPhotos,
      loading: false,
      error: null,
      loadMore: jest.fn(),
      hasMore: false,
      retry: jest.fn(),
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

    // Both photos should be present initially
    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.getByText(/Photo by Bob/i)).toBeInTheDocument();
    });

    // Grab the <input type="date" /> that FilterPanel renders
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    if (!dateInput) throw new Error("Date input not found");

    // Set date to "2021-01-01" (Alice’s upload_date starts with that)
    fireEvent.change(dateInput, { target: { value: "2021-01-01" } });

    // Now only Alice should remain, Bob should be gone
    await waitFor(() => {
      expect(screen.getByText(/Photo by Alice/i)).toBeInTheDocument();
      expect(screen.queryByText(/Photo by Bob/i)).toBeNull();
    });
  });

});
