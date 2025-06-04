// src/components/__tests__/ErrorDisplay.test.tsx
/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorDisplay } from "../ErrorDisplay";
import { usePhotos } from "../../hooks/usePhotos";

// Mock usePhotos to supply a retry function
jest.mock("../../hooks/usePhotos", () => ({
    usePhotos: jest.fn(),
}));

const mockedUsePhotos = usePhotos as jest.MockedFunction<typeof usePhotos>;

describe("ErrorDisplay component", () => {
    beforeEach(() => {
        mockedUsePhotos.mockReset();
    });

    it("renders the error message and calls retry when button is clicked", async () => {
        const fakeRetry = jest.fn();
        mockedUsePhotos.mockReturnValue({

            photos: [],
            loading: false,
            error: "some error",
            loadMore: jest.fn(),
            hasMore: false,
            retry: fakeRetry,
            fetchPhotos: jest.fn(),
        });

        render(<ErrorDisplay message="Something went wrong" />);

        // The <p> should contain the passed message
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();

        // The “Retry” button should be in the document
        const button = screen.getByRole("button", { name: /Retry/i });
        expect(button).toBeInTheDocument();

        // Click the button
        await userEvent.click(button);
        expect(fakeRetry).toHaveBeenCalledTimes(1);
    });
});
