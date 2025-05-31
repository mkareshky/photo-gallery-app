import React, { useEffect, useRef, useCallback } from "react";
import { css } from "../styled-system/css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";
import { usePhotoContext } from "../context/PhotoContext";

export const GalleryPage: React.FC = () => {
  const { photos, loading: isLoading, error, loadMore, hasMore } = usePhotoContext();
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        loadMore();
      }
    },
    [hasMore, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 1.0,
    });

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [handleObserver]);

  if (error)
    return (
      <div className={css({ p: "4", color: "red.600" })}>
        Error loading photos
      </div>
    );

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

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: ["1fr", "1fr 1fr", "repeat(3, 1fr)", "repeat(4, 1fr)"],
          gap: "6",
        })}
      >
        {photos.map((photo) => (
          <Tooltip.Provider key={photo.id}>
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
                    <p className={css({ fontWeight: "semibold", fontSize: "sm", mb: "1" })}>
                      {photo.title || `Photo by ${photo.author}`}
                    </p>
                    <p className={css({ fontSize: "xs", color: "gray.600" })}>Author: {photo.author}</p>
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

      {/* Observer target for infinite scroll */}
      <div ref={observerRef} className={css({ h: "10px" })} />

      {isLoading && (
        <div className={css({ mt: "6", textAlign: "center", fontSize: "sm", color: "gray.500" })}>
          <p>Loading more photos...</p>
        </div>
      )}
      {!hasMore && (
        <div className={css({ mt: "6", textAlign: "center", fontSize: "sm", color: "gray.400" })}>
          No more photos to load.
        </div>
      )}
    </main>
  );
};
