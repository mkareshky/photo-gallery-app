// src/services/__tests__/PhotoService.test.ts
import { PhotoService } from "../PhotoService";
import type { Photo } from "../../types";

describe("PhotoService", () => {
  const samplePhotos: Photo[] = [
    {
      id: "a",
      author: "Author A",
      download_url: "https://example.com/a.jpg",
      width: 100,
      height: 100,
      url: "https://picsum.photos/id/a/100/100",
      title: "Photo A",
      upload_date: "2021-01-01T00:00:00.000Z",
      categories: ["City", "Nature"],
    },
    {
      id: "b",
      author: "Author B",
      download_url: "https://example.com/b.jpg",
      width: 200,
      height: 200,
      url: "https://picsum.photos/id/b/200/200",
      title: "Photo B",
      upload_date: "2021-02-01T00:00:00.000Z",
      categories: ["Nature", "People"],
    },
    {
      id: "c",
      author: "Author C",
      download_url: "https://example.com/c.jpg",
      width: 300,
      height: 300,
      url: "https://picsum.photos/id/c/300/300",
      title: "Photo C",
      upload_date: "2021-03-01T00:00:00.000Z",
      categories: ["Animals", "City"],
    },
  ];

  let service: PhotoService;

  beforeEach(() => {
    service = new PhotoService(samplePhotos);
  });

  it("getPhotos returns the original array", () => {
    expect(service.getPhotos()).toEqual(samplePhotos);
  });

  it("getPhotoById returns the correct photo when it exists", () => {
    const photoB = service.getPhotoById("b");
    expect(photoB).toEqual(samplePhotos[1]);
  });

  it("getPhotoById returns undefined when the ID does not exist", () => {
    expect(service.getPhotoById("nonexistent")).toBeUndefined();
  });

  describe("getNextPhotoId", () => {
    it("returns the next ID in sequence", () => {
      expect(service.getNextPhotoId("a")).toBe("b");
      expect(service.getNextPhotoId("b")).toBe("c");
    });

    it("wraps around to the first ID if called on the last photo", () => {
      expect(service.getNextPhotoId("c")).toBe("a");
    });

    it("returns the first ID if the currentId is not found", () => {
      expect(service.getNextPhotoId("nonexistent")).toBe("a");
    });
  });

  describe("getPrevPhotoId", () => {
    it("returns the previous ID in sequence", () => {
      expect(service.getPrevPhotoId("b")).toBe("a");
      expect(service.getPrevPhotoId("c")).toBe("b");
    });

    it("wraps around to the last ID if called on the first photo", () => {
      expect(service.getPrevPhotoId("a")).toBe("c");
    });

    it("returns the last ID if the currentId is not found", () => {
      expect(service.getPrevPhotoId("nonexistent")).toBe("c");
    });
  });
});
