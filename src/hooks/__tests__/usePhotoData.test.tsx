// src/hooks/__tests__/usePhotoData.test.tsx

/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { usePhotoData } from "../usePhotoData";
import { usePhotos } from "../usePhotos";
import { Photo } from "../../types";

// Mock usePhotos to return a known shape
jest.mock("../usePhotos", () => ({
    usePhotos: jest.fn(),
}));

const mockedUsePhotos = usePhotos as jest.MockedFunction<typeof usePhotos>;

// A small test component that uses usePhotoData and displays values
function PhotoDataConsumer() {
    const { photos, loading, error, loadMore, hasMore } = usePhotoData();
    return (
        <div>
            <div data-testid="photos-length">{photos.length}</div>
            <div data-testid="loading">{loading ? "true" : "false"}</div>
            <div data-testid="error">{error ?? "null"}</div>
            <div data-testid="hasMore">{hasMore ? "true" : "false"}</div>
            <button onClick={loadMore} data-testid="loadMore">LoadMore</button>
        </div>
    );
}

describe("usePhotoData", () => {
    beforeEach(() => {
        mockedUsePhotos.mockReset();
    });

    it("returns exactly what usePhotos provides", () => {
        const dummyPhotos: Photo[] = [
            {
                id: "x",
                author: "Alice",
                download_url: "https://example.com/x.jpg",
                width: 100,
                height: 100,
                url: "https://picsum.photos/id/x/100/100",
                // The following properties are optional (you can omit them):
                // title?: string;
                // upload_date?: string;
                // categories?: string[];
            },
        ];

        const dummyLoadMore = jest.fn();
        const dummyFetchPhotos = jest.fn();
        mockedUsePhotos.mockReturnValue({
            photos: dummyPhotos,
            loading: false,
            error: "some error",
            loadMore: dummyLoadMore,
            hasMore: true,
            retry: jest.fn(),
            fetchPhotos: dummyFetchPhotos,
        });

        render(<PhotoDataConsumer />);
        expect(screen.getByTestId("photos-length").textContent).toBe("1");
        expect(screen.getByTestId("loading").textContent).toBe("false");
        expect(screen.getByTestId("error").textContent).toBe("some error");
        expect(screen.getByTestId("hasMore").textContent).toBe("true");

        // Clicking LoadMore should call the mocked loadMore
        screen.getByTestId("loadMore").click();
        expect(dummyLoadMore).toHaveBeenCalled();
    });
});
