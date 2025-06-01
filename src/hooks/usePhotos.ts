import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import type { Photo } from "../types";
import addMetadataToPhotos from "../helper/addMetadataToPhotos";

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchedPages = useRef<Set<number>>(new Set());

  const fetchPhotos = useCallback(async (currentPage: number) => {
    if (fetchedPages.current.has(currentPage)) return; // Already fetched
    fetchedPages.current.add(currentPage);

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Photo[]>(
        `https://picsum.photos/v2/list?page=${currentPage}&limit=10`
      );
      if (response.data.length > 0) {
        const photosWithMetadata = addMetadataToPhotos(response.data);
        setPhotos(prev => [...prev, ...photosWithMetadata]);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to fetch photos. Please try again later.");
      console.error("Error fetching photos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos(page);
  }, [fetchPhotos, page]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return {
    photos,
    loading,
    error,
    loadMore,
    hasMore,
    fetchPhotos, // <-- expose temporarily for testing
  };
}
