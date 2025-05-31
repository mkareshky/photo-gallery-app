import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import type { Photo } from "../types";

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Photo[]>(
        `https://picsum.photos/v2/list?page=${page}&limit=10`
      );
      if (response.data.length > 0) {
        setPhotos(prev => [...prev, ...response.data]);
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
  }, [page]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

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
  };
}
