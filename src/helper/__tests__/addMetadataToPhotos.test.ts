/**
 * @jest-environment jsdom
 */

import addMetadataToPhotos from "../addMetadataToPhotos";
import { categoriesPool, type Photo } from "../../types";

// Mock generateRandomDate to return a fixed, known date string
jest.mock("../generateRandomDate", () => ({
  __esModule: true,
  default: jest.fn(() => "2021-01-01T00:00:00.000Z"),
}));

describe("addMetadataToPhotos", () => {
  const originalMathRandom = Math.random;

  afterEach(() => {
    // Restore Math.random after each test
    Math.random = originalMathRandom;
    jest.clearAllMocks();
  });

  it("should add title, upload_date, and unique categories to each photo", () => {
    // Prepare a sample input array of Photo objects
    const inputPhotos: Photo[] = [
      {
        id: "1",
        author: "Alice",
        download_url: "https://example.com/1.jpg",
        width: 500,
        height: 400,
        url: "https://picsum.photos/id/1/500/400",
        // title, upload_date, and categories are absent in the incoming objects
      },
      {
        id: "2",
        author: "Bob",
        download_url: "https://example.com/2.jpg",
        width: 600,
        height: 450,
        url: "https://picsum.photos/id/2/600/450",
      },
    ];

    // Make Math.random deterministic:
    // On first call → 0 → categoriesPool[0]
    // On second call → 0 → categoriesPool[0] (duplicate, filtered out)
    // For the second photo, next two calls → 0.5 and 0.75 → pick two different categories
    let callCount = 0;
    Math.random = () => {
      callCount++;
      switch (callCount) {
        case 1:
        case 2:
          return 0; // both draw the same category for photo 1
        case 3:
          return 0.5; // pick middle of categoriesPool for photo 2
        case 4:
          return 0.75; // pick later index for photo 2
        default:
          return 0;
      }
    };

    const result = addMetadataToPhotos(inputPhotos);

    // Result array length should remain the same as input
    expect(result).toHaveLength(inputPhotos.length);

    // Check first photo
    const first = result[0];
    expect(first.id).toBe("1");
    // Title should be "Photo by <author>"
    expect(first.title).toBe("Photo by Alice");
    // upload_date should be the mocked value
    expect(first.upload_date).toBe("2021-01-01T00:00:00.000Z");
    // Categories should be filtered to a single unique entry
    expect(Array.isArray(first.categories)).toBe(true);
    expect(first.categories).toHaveLength(1);
    expect(categoriesPool).toContain(first.categories![0]);
    // Because Math.random returned 0 twice, both picks are categoriesPool[0]

    // Check second photo
    const second = result[1];
    expect(second.id).toBe("2");
    expect(second.title).toBe("Photo by Bob");
    expect(second.upload_date).toBe("2021-01-01T00:00:00.000Z");
    // Categories should contain two distinct entries:
    expect(Array.isArray(second.categories)).toBe(true);
    expect(second.categories).toHaveLength(2);
    // We forced Math.random to return 0.5 and 0.75, so:
    const idxA = Math.floor(0.5 * categoriesPool.length);
    const idxB = Math.floor(0.75 * categoriesPool.length);
    expect(second.categories).toContain(categoriesPool[idxA]);
    expect(second.categories).toContain(categoriesPool[idxB]);
    expect(idxA).not.toBe(idxB);
  });

  it("should preserve all original Photo fields besides adding metadata", () => {
    const inputPhotos: Photo[] = [
      {
        id: "42",
        author: "Charlie",
        download_url: "https://example.com/42.jpg",
        width: 1024,
        height: 768,
        url: "https://picsum.photos/id/42/1024/768",
      },
    ];

    // Make Math.random always zero so we get a single category
    Math.random = () => 0;

    const result = addMetadataToPhotos(inputPhotos);

    const out = result[0];
    // Original fields unchanged:
    expect(out.id).toBe("42");
    expect(out.author).toBe("Charlie");
    expect(out.download_url).toBe("https://example.com/42.jpg");
    expect(out.width).toBe(1024);
    expect(out.height).toBe(768);
    expect(out.url).toBe("https://picsum.photos/id/42/1024/768");

    // Added fields:
    expect(out.title).toBe("Photo by Charlie");
    expect(out.upload_date).toBe("2021-01-01T00:00:00.000Z");
    expect(Array.isArray(out.categories)).toBe(true);
    // Since Math.random returns 0 twice, categoriesPool[0] is selected twice and filtered to one
    expect(out.categories).toEqual([categoriesPool[0]]);
  });
});
