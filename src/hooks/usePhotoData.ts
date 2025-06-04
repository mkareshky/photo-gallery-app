// src/hooks/usePhotoData.ts
import { usePhotos } from "./usePhotos";

export function usePhotoData() {
  const { photos, loading, error, loadMore, hasMore } = usePhotos();
  return { photos, loading, error, loadMore, hasMore };
}
