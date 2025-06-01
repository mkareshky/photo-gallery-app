/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { PhotoProvider, usePhotoContext } from "../PhotoContext";
import { usePhotos } from "../../hooks/usePhotos"; // import برای تایپ

// یک mock واحد برای loadMore تعریف می‌کنیم:
const mockLoadMore = jest.fn();

// Mock کردن usePhotos؛ دقت کنید که loadMore به mockLoadMore اختصاص یافته است.
jest.mock("../../hooks/usePhotos", () => ({
  usePhotos: () => ({
    photos: [
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
    ],
    loading: false,
    error: null,
    loadMore: mockLoadMore, // ← استفاده از mockLoadMore واحد
    hasMore: true,
  }),
}));

// یک کامپوننت برای مصرف کانتکست می‌سازیم
const ConsumerComponent: React.FC = () => {
  const { photos, loading, error, loadMore, hasMore } = usePhotoContext();

  return (
    <div>
      <div data-testid="photos-count">{photos.length}</div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <div data-testid="error">{error ?? "null"}</div>
      <div data-testid="has-more">{hasMore ? "true" : "false"}</div>
      <button onClick={() => loadMore()} data-testid="load-more">
        Load More
      </button>
    </div>
  );
};

describe("PhotoContext and usePhotoContext", () => {
  it("throws an error if usePhotoContext is used outside of PhotoProvider", () => {
    const renderWithoutProvider = () => render(<ConsumerComponent />);
    expect(renderWithoutProvider).toThrow(
      "usePhotoContext must be used within a PhotoProvider"
    );
  });

  it("provides the values from usePhotos via PhotoProvider", () => {
    render(
      <PhotoProvider>
        <ConsumerComponent />
      </PhotoProvider>
    );

    // از mock: آرایه‌ی photos طولش ۱ است
    expect(screen.getByTestId("photos-count").textContent).toBe("1");
    expect(screen.getByTestId("loading").textContent).toBe("false");
    expect(screen.getByTestId("error").textContent).toBe("null");
    expect(screen.getByTestId("has-more").textContent).toBe("true");

    // کلیک روی دکمه‌ی "Load More"
    const loadMoreButton = screen.getByTestId("load-more");
    loadMoreButton.click();

    // assert که mockLoadMore فراخوانده شده باشد
    expect(mockLoadMore).toHaveBeenCalled();
  });
});
