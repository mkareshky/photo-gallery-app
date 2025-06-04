// __tests__/usePhotoFilter.test.ts

import { usePhotoFilter, FilterCriteria } from "../usePhotoFilter";
import type { Photo } from "../../../src/types";

describe("usePhotoFilter function", () => {
  const photos: Photo[] = [
    {
      id: "1",
      author: "Alice",
      download_url: "https://example.com/1.jpg",
      width: 500,
      height: 400,
      url: "https://picsum.photos/id/1/500/400",
      title: "Hello World",
      upload_date: "2021-01-01T00:00:00.000Z",
      categories: ["Nature", "People"],
    },
    {
      id: "2",
      author: "Bob",
      download_url: "https://example.com/2.jpg",
      width: 600,
      height: 450,
      url: "https://picsum.photos/id/2/600/450",
      title: "Tech Photo",
      upload_date: "2022-02-02T00:00:00.000Z",
      categories: ["Tech", "City"],
    },
    {
      id: "3",
      author: "Charlie",
      download_url: "https://example.com/3.jpg",
      width: 300,
      height: 200,
      url: "https://picsum.photos/id/3/300/200",
      title: "",
      upload_date: undefined,
      categories: undefined,
    },
  ];

  it("returns all photos when no filters are applied", () => {
    const criteria: FilterCriteria = {
      searchTerm: "",
      category: "all",
      uploadDate: "",
    };
    const result = usePhotoFilter(photos, criteria);
    expect(result).toHaveLength(3);
  });

  it("filters by searchTerm (case‐insensitive, matches title or author)", () => {
    const r1 = usePhotoFilter(photos, {
      searchTerm: "hello",
      category: "all",
      uploadDate: "",
    });
    expect(r1).toHaveLength(1);
    expect(r1[0].id).toBe("1");

    const r2 = usePhotoFilter(photos, {
      searchTerm: "bob",
      category: "all",
      uploadDate: "",
    });
    expect(r2).toHaveLength(1);
    expect(r2[0].id).toBe("2");

    const r3 = usePhotoFilter(photos, {
      searchTerm: "xyz",
      category: "all",
      uploadDate: "",
    });
    expect(r3).toHaveLength(0);
  });

  it("filters by category (case‐insensitive); category='all' returns all", () => {
    const allRes = usePhotoFilter(photos, {
      searchTerm: "",
      category: "all",
      uploadDate: "",
    });
    expect(allRes).toHaveLength(3);

    const natureRes = usePhotoFilter(photos, {
      searchTerm: "",
      category: "Nature",
      uploadDate: "",
    });
    expect(natureRes).toHaveLength(1);
    expect(natureRes[0].id).toBe("1");

    const techRes = usePhotoFilter(photos, {
      searchTerm: "",
      category: "tech",
      uploadDate: "",
    });
    expect(techRes).toHaveLength(1);
    expect(techRes[0].id).toBe("2");

    const emptyCategory = usePhotoFilter(photos, {
      searchTerm: "",
      category: "Foo",
      uploadDate: "",
    });
    expect(emptyCategory).toHaveLength(0);
  });

  it("filters by uploadDate.startsWith(...) when uploadDate is provided", () => {
    const dateMatch = usePhotoFilter(photos, {
      searchTerm: "",
      category: "all",
      uploadDate: "2021-01-01",
    });
    expect(dateMatch).toHaveLength(1);
    expect(dateMatch[0].id).toBe("1");

    const noneMatch = usePhotoFilter(photos, {
      searchTerm: "",
      category: "all",
      uploadDate: "2020-01-01",
    });
    expect(noneMatch).toHaveLength(0);
  });

  it("respects all criteria together", () => {
    const result = usePhotoFilter(photos, {
      searchTerm: "Tech",
      category: "Tech",
      uploadDate: "2022-02",
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });
});
