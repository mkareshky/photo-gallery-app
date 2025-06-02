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

    // The component now renders a <figure> placeholder instead of a raw <img>.
    // Verify that <figure> is present:
    const figure = screen.getByRole("figure");
    expect(figure).toBeInTheDocument();

    // Verify that <figcaption> displays "© Alice":
    expect(screen.getByText(/©\s*Alice/i)).toBeInTheDocument();

    // Title (<h2>):
    expect(
      screen.getByRole("heading", { name: /Amazing Scenery/i })
    ).toBeInTheDocument();

    // Display ID:
    expect(screen.getByText(/ID:\s*42/i)).toBeInTheDocument();

    // Display dimensions:
    expect(
      screen.getByText(/Dimensions:\s*800\s*×\s*600/i)
    ).toBeInTheDocument();

    // Display upload date:
    const formattedDate = new Date(basePhoto.upload_date || "").toLocaleDateString();
    expect(
      screen.getByText(new RegExp(`Uploaded:\\s*${formattedDate}`))
    ).toBeInTheDocument();

    // Display categories:
    expect(
      screen.getByText(/Categories:\s*Nature,\s*People/i)
    ).toBeInTheDocument();

    // Link "View Original":
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

    // When title is an empty string, the component renders the author (Alice) as <h2>
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Alice");
  });

  it("omits <figcaption> and does not render an <img> when author is missing", () => {
    const photoNoAuthor: Photo = {
      ...basePhoto,
      author: "",
      title: "Some Title",
    };
    render(<PhotoCard photo={photoNoAuthor} />);

    // There should be no <figcaption> because author is empty:
    expect(screen.queryByText(/©/)).toBeNull();

    // The component’s <figure> placeholder is present, but no <img> is rendered yet:
    expect(screen.getByRole("figure")).toBeInTheDocument();
    expect(screen.queryByRole("img")).toBeNull();

    // Verify that <h2> still shows the title "Some Title":
    expect(
      screen.getByRole("heading", { name: /Some Title/i })
    ).toBeInTheDocument();
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

  it("renders no Categories line when categories is empty or undefined", () => {
    // Case 1: categories = []
    const photoNoCats1: Photo = {
      ...basePhoto,
      categories: [],
    };
    const { rerender } = render(<PhotoCard photo={photoNoCats1} />);
    expect(screen.queryByText(/Categories:/i)).toBeNull();

    // Case 2: categories = undefined (omit the property)
    const { categories, ...partialPhoto } = basePhoto;
    rerender(<PhotoCard photo={partialPhoto as Photo} />);
    expect(screen.queryByText(/Categories:/i)).toBeNull();
  });
});
