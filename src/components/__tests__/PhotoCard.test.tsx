/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { PhotoCard } from "../PhotoCard";
import type { Photo } from "../../types";

describe("PhotoCard component", () => {
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
});
