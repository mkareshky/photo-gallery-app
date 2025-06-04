// src/components/__tests__/PhotoItem.test.tsx
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PhotoItem } from "../../components/PhotoItem";
import type { Photo } from "../../types";

describe("PhotoItem component", () => {
  const basePhoto: Photo = {
    id: "42",
    author: "Jane Doe",
    download_url: "https://example.com/42.jpg",
    width: 800,
    height: 600,
    url: "https://picsum.photos/id/42/800/600",
    title: "Test Title",
    upload_date: "2021-05-05T10:00:00.000Z",
    categories: ["Nature"],
  };

  it("renders title, author, and formatted date when upload_date is provided", () => {
    render(
      <MemoryRouter>
        <PhotoItem photo={basePhoto} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Author:\s*Jane Doe/i)).toBeInTheDocument();

    expect(screen.getByText(/Uploaded:.*2021/)).toBeInTheDocument();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/photos/42");
  });

  it("falls back to `Photo by {author}` when title is falsy", () => {
    const noTitle: Photo = {
      ...basePhoto,
      id: "99",
      title: "",
      author: "Zed",
      upload_date: "2020-03-03T00:00:00.000Z",
    };
    render(
      <MemoryRouter>
        <PhotoItem photo={noTitle} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Photo by Zed/i)).toBeInTheDocument();
  });

  it("renders `Uploaded: Unknown` when upload_date is undefined", () => {
    const missingDate: Photo = {
      ...basePhoto,
      id: "77",
      title: "No Date Photo",
      upload_date: undefined,
    };
    render(
      <MemoryRouter>
        <PhotoItem photo={missingDate} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Uploaded:\s*Unknown/i)).toBeInTheDocument();
  });
});
