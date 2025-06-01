/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { PhotoCard } from "../PhotoCard";
import type { Photo } from "../../types";

describe("PhotoCard component (additional branches)", () => {
  const basePhoto: Photo = {
    id: "42",
    author: "Alice",
    download_url: "https://example.com/42.jpg",
    width: 800,
    height: 600,
    url: "https://picsum.photos/id/42/800/600",
    title: "Amazing Scenery",
    upload_date: "2023-03-15T10:00:00.000Z",
    categories: ["Nature", "People"],
  };

  it("Must display all photo elements when images are available", () => {
    render(<PhotoCard photo={basePhoto} />);

    // Image with correct src and alt:
    const img = screen.getByRole("img", { name: /Alice/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", basePhoto.download_url);

    // Title (h2)
    expect(screen.getByRole("heading", { name: /Amazing Scenery/i })).toBeInTheDocument();

    // Display ID
    expect(screen.getByText(/ID:\s*42/i)).toBeInTheDocument();

    // Display dimensions
    expect(screen.getByText(/Dimensions:\s*800\s*×\s*600/i)).toBeInTheDocument();

    // Display upload date
    const formattedDate = basePhoto.upload_date ? new Date(basePhoto.upload_date).toLocaleDateString() : '';
    expect(screen.getByText(new RegExp(`Uploaded:\\s*${formattedDate}`))).toBeInTheDocument();

    // Display categories
    expect(screen.getByText(/Categories:\s*Nature,\s*People/i)).toBeInTheDocument();

    // Link "View Original"
    const link = screen.getByRole("link", { name: /View Original/i });
    expect(link).toHaveAttribute("href", basePhoto.download_url);
  });

  it("Must display 'Photo not found' message when download_url is missing", () => {
    const missingPhoto: Photo = {
      ...basePhoto,
      download_url: "",
    };
    render(<PhotoCard photo={missingPhoto} />);

    expect(screen.getByText(/Photo not found/i)).toBeInTheDocument();
  });

  it("falls back to author text when title is an empty string", () => {
    const photoNoTitle: Photo = {
      ...basePhoto,
      title: "",
    };
    render(<PhotoCard photo={photoNoTitle} />);

    // Should render <h2> with author name when title is falsy
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Alice");
  });

  it("omits <figcaption> and uses 'Photo' alt‐text when author is missing", () => {
    const photoNoAuthor: Photo = {
      ...basePhoto,
      author: "",
      title: "Some Title",
    };
    render(<PhotoCard photo={photoNoAuthor} />);

    // Alt‐text should be "Photo" since author is falsy
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Photo");

    // figcaption should NOT be in the document when author is empty
    expect(screen.queryByText(/©/)).toBeNull();
  });

  it("shows 'Uploaded: Unknown' when upload_date is missing", () => {
    const photoNoDate: Photo = {
      ...basePhoto,
      upload_date: "",
    };
    render(<PhotoCard photo={photoNoDate} />);

    // Should render "Uploaded: Unknown"
    expect(screen.getByText(/Uploaded:\s*Unknown/i)).toBeInTheDocument();
  });

  it("renders no <ul> when categories is empty or undefined", () => {
    // Case 1: categories = []
    const photoNoCats1: Photo = {
      ...basePhoto,
      categories: [],
    };
    const { rerender } = render(<PhotoCard photo={photoNoCats1} />);
    expect(screen.queryByText(/Categories:/i)).toBeNull();

    // Case 2: categories = undefined (omit the property)
    const { categories, ...partialPhoto } = basePhoto;
    render(<PhotoCard photo={partialPhoto as Photo} />);
    expect(screen.queryByText(/Categories:/i)).toBeNull();
  });
});
