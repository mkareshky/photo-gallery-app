// __tests__/PhotoList.test.tsx
/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PhotoList } from "../PhotoList";
import type { Photo } from "../../../src/types";

describe("PhotoList component", () => {
  const photos: Photo[] = [
    {
      id: "1",
      author: "Alice",
      download_url: "https://example.com/1.jpg",
      width: 500,
      height: 400,
      url: "https://picsum.photos/id/1/500/400",
      title: "First Photo",
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
      title: "Second Photo",
      upload_date: "2022-02-02T12:00:00.000Z",
      categories: ["City"],
    },
  ];

  it("renders a list of PhotoItem components", () => {
    render(
      <MemoryRouter>
        <PhotoList photos={photos} />
      </MemoryRouter>
    );

    // It should render both titles
    expect(screen.getByText(/First Photo/i)).toBeInTheDocument();
    expect(screen.getByText(/Second Photo/i)).toBeInTheDocument();

    // There should be two <li> items total
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(2);

    // Each <li> should contain a link to `/photos/{id}`
    expect(screen.getByRole("link", { name: /First Photo/i })).toHaveAttribute(
      "href",
      "/photos/1"
    );
    expect(screen.getByRole("link", { name: /Second Photo/i })).toHaveAttribute(
      "href",
      "/photos/2"
    );
  });
});
