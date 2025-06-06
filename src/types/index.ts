// src/types/index.ts
export interface Photo {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
  url: string;
  title?: string;
  upload_date?: string;
  categories?: Category[];
}

export type categoriesUnion = "Nature" | "City" | "People" | "Animals" | "Tech" | "Food";

export const categoriesPool = ["Nature", "City", "People", "Animals", "Tech", "Food"] as const;

type Category = typeof categoriesPool[number];

export interface PhotoContextType {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
  retry: () => void;
}

export interface PhotoCardProps {
  photo: Photo;
}