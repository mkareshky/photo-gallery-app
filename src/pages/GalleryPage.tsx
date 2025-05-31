// src/pages/GalleryPage.tsx

import React, { useEffect, useRef, useCallback, useState } from "react";
import { css } from "../styled-system/css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";
import { usePhotoContext } from "../context/PhotoContext";
import type { categoriesUnion, Photo } from "../types";
import { FilterPanel } from "../components/ui/FilterPanel";
import { useDebounce } from "../hooks/useDebounce";

export const GalleryPage: React.FC = () => {
  const { photos, loading, error, loadMore, hasMore } = usePhotoContext();

  const [rawSearchTerm, setRawSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [uploadDate, setUploadDate] = useState<string>("");

  const debouncedSearchTerm = useDebounce(rawSearchTerm, 500);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [filterKey, setFilterKey] = useState<number>(0);

  useEffect(() => {
    setFilterKey((prev) => prev + 1);
  }, [debouncedSearchTerm, category, uploadDate]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        if (observerRef.current && sentinelRef.current) {
          observerRef.current.unobserve(sentinelRef.current);
        }
        loadMore();
      }
    },
    [hasMore, loading, loadMore]
  );

  useEffect(() => {
    const obs = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });
    observerRef.current = obs;
    return () => {
      obs.disconnect();
    };
  }, [handleObserver]);

  useEffect(() => {
    if (observerRef.current && sentinelRef.current) {
      observerRef.current.unobserve(sentinelRef.current);
    }
  }, [filterKey]);

  useEffect(() => {
    if (!loading && photos.length > 0 && hasMore) {
      if (observerRef.current && sentinelRef.current) {
        observerRef.current.observe(sentinelRef.current);
      }
    }
  }, [loading, photos.length, hasMore]);

  const filteredPhotos = photos.filter((photo: Photo) => {
    const matchesSearch =
      (photo.title || "")
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      photo.author.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

    const matchesCategory =
      category === "all"
        ? true
        : category
        ? (photo.categories || []).includes(category as categoriesUnion)
        : true;

    const matchesDate = uploadDate
      ? (photo.upload_date || "").startsWith(uploadDate)
      : true;

    return matchesSearch && matchesCategory && matchesDate;
  });

  if (error) {
    return (
      <div className={css({ p: "4", color: "red.600", textAlign: "center" })}>
        {error}
      </div>
    );
  }

  return (
    <main
      className={css({
        px: "4",
        py: "6",
        maxW: "7xl",
        mx: "auto",
      })}
    >
      <h1
        className={css({
          fontSize: "3xl",
          fontWeight: "bold",
          mb: "6",
          textAlign: "center",
        })}
      >
        Photo Gallery
      </h1>

      <FilterPanel
        searchTerm={rawSearchTerm}
        category={category}
        uploadDate={uploadDate}
        onSearchChange={setRawSearchTerm}
        onCategoryChange={setCategory}
        onDateChange={setUploadDate}
        onClearFilters={() => {
          setRawSearchTerm("");
          setCategory("all");
          setUploadDate("");
        }}
      />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: [
            "1fr",
            "1fr 1fr",
            "repeat(3, 1fr)",
            "repeat(4, 1fr)",
          ],
          gap: "6",
          mt: "6",
        })}
      >
        {filteredPhotos.map((photo: Photo, idx: number) => (
          <Tooltip.Provider key={`${photo.id}-${idx}`}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link
                  to={`/photos/${photo.id}`}
                  className={css({
                    display: "block",
                    rounded: "lg",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "gray.200",
                    _hover: { boxShadow: "md" },
                  })}
                >
                  <img
                    src={photo.download_url}
                    alt={photo.author}
                    className={css({
                      w: "full",
                      h: "auto",
                      aspectRatio: "1 / 1",
                      objectFit: "cover",
                    })}
                  />
                  <div className={css({ p: "3", bg: "gray.50", textAlign: "left" })}>
                    <p
                      className={css({
                        fontWeight: "semibold",
                        fontSize: "sm",
                        mb: "1",
                      })}
                    >
                      {photo.title || `Photo by ${photo.author}`}
                    </p>
                    <p className={css({ fontSize: "xs", color: "gray.600" })}>
                      Author: {photo.author}
                    </p>
                    <p className={css({ fontSize: "xs", color: "gray.500" })}>
                      {photo.upload_date
                        ? `Uploaded: ${new Date(photo.upload_date).toLocaleDateString()}`
                        : `Uploaded: Unknown`}
                    </p>
                  </div>
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className={css({
                    bg: "gray.900",
                    color: "white",
                    px: "3",
                    py: "2",
                    textStyle: "sm",
                    rounded: "md",
                    shadow: "md",
                    zIndex: "10",
                  })}
                >
                  Click to view details
                  <Tooltip.Arrow className={css({ fill: "gray.900" })} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
      </div>

      <div ref={sentinelRef} className={css({ h: "10px" })} />

      {loading && (
        <div
          className={css({
            mt: "6",
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          <p>Loading more photos...</p>
        </div>
      )}
      {!hasMore && !loading && (
        <div
          className={css({
            mt: "6",
            textAlign: "center",
            fontSize: "sm",
            color: "gray.400",
          })}
        >
          No more photos to load.
        </div>
      )}
    </main>
  );
};
