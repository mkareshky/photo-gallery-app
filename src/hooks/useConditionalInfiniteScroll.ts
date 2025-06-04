// src/hooks/useConditionalInfiniteScroll.ts
import { useEffect, useRef } from "react";

export function useConditionalInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  loading: boolean,
  isFiltering: boolean
) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Always disconnect old observer first
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.disconnect();
    }

    // Only set up a new observer if we’re _not_ filtering and not loading, and there’s more to load
    if (!isFiltering && !loading && hasMore && sentinelRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            onLoadMore();
          }
        },
        { root: null, rootMargin: "200px", threshold: 0.1 }
      );
      observerRef.current = observer;
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [onLoadMore, hasMore, loading, isFiltering]);

  return sentinelRef;
}
