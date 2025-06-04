// src/hooks/usePhotoFilter.ts
import { Photo } from "../types";

export interface FilterCriteria {
  searchTerm: string;
  category: string;
  uploadDate: string;
}

export function usePhotoFilter(photos: Photo[], { searchTerm, category, uploadDate }: FilterCriteria) {
  const term = searchTerm.toLowerCase();

  // Accept “YYYY”, “YYYY-MM”, or “YYYY-MM-DD”
  const partialDatePattern = /^\d{4}(-\d{2}){0,2}$/;
  const isValidPartialDate = partialDatePattern.test(uploadDate);

  return photos.filter((photo: Photo) => {
    const matchesSearch =
      (photo.title || "").toLowerCase().includes(term) ||
      photo.author.toLowerCase().includes(term);

    const matchesCategory =
      category === "all"
        ? true
        : (photo.categories || [])
          .map((c) => c.toLowerCase())
          .includes(category.toLowerCase());

    const matchesDate = isValidPartialDate
      ? (photo.upload_date || "").startsWith(uploadDate)
      : true;

    return matchesSearch && matchesCategory && matchesDate;
  });
}
