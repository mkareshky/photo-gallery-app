// src/hooks/usePhotoFilter.ts
import { Photo } from "../types";

export interface FilterCriteria {
  searchTerm: string;
  category: string;
  uploadDate: string;
}

export function usePhotoFilter(photos: Photo[], { searchTerm, category, uploadDate }: FilterCriteria) {
  const term = searchTerm.toLowerCase();

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

    const matchesDate = uploadDate
      ? (photo.upload_date || "").startsWith(uploadDate)
      : true;

    return matchesSearch && matchesCategory && matchesDate;
  });
}
