import React from "react";
import { css } from "../styled-system/css";
import { useParams, useNavigate } from "react-router-dom";
import { PhotoCard } from "../components/PhotoCard";
import { usePhotoContext } from "../context/PhotoContext";

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { photos } = usePhotoContext();
  const photoIndex = photos.findIndex((p) => p.id === id);
  const photo = photos[photoIndex];
  const navigate = useNavigate();

  if (!photo) {
    return <main className={css({ p: "6", maxW: "5xl", mx: "auto" })}><p>Photo not found.</p></main>;
  }

  const goNext = () => {
    const next = photos[photoIndex + 1];
    if (!next) {
      navigate(`/photos/${photos[0].id}`);
      return;
    }
    navigate(`/photos/${next.id}`);
  };

  const goPrev = () => {
    const prev = photos[photoIndex - 1];
    if (!prev) {
      navigate(`/photos/${photos[photos.length - 1].id}`);
      return;
    }
    navigate(`/photos/${prev.id}`);
  };

  return (
    <main className={css({ p: "6", maxW: "5xl", mx: "auto" })}>
      {/* PHOTO CONTENT */}
      <article>
        <PhotoCard photo={photo} />
      </article>

      {/* PREVIOUS / NEXT NAVIGATION */}
      <nav
        aria-label="Photo navigation"
        className={css({
          mt: "6",
          display: "flex",
          justifyContent: "space-between",
        })}
      >
        <button
          onClick={goPrev}
          className={css({
            px: "5",
            py: "2",
            bg: "gray.100",
            color: "black",
            rounded: "md",
            fontWeight: "medium",
            _hover: { bg: "gray.200" },
            _focusVisible: {
              outline: "2px solid",
              outlineColor: "blue.500",
              outlineOffset: "2px",
            },
            transition: "all 0.2s",
            cursor: "pointer",
          })}
        >
          ← Previous
        </button>

        <button
          onClick={goNext}
          className={css({
            px: "5",
            py: "2",
            bg: "gray.100",
            color: "black",
            rounded: "md",
            fontWeight: "medium",
            _hover: { bg: "gray.200" },
            _focusVisible: {
              outline: "2px solid",
              outlineColor: "blue.500",
              outlineOffset: "2px",
            },
            transition: "all 0.2s",
            cursor: "pointer",
          })}
        >
          Next →
        </button>
      </nav>

      {/* BACK TO GALLERY */}
      <nav aria-label="Return to gallery" className={css({ textAlign: "center", mt: "4" })}>
        <button
          onClick={() => navigate("/")}
          className={css({
            px: "6",
            py: "2",
            fontSize: "sm",
            fontWeight: "medium",
            bg: "blue.600",
            color: "white",
            rounded: "md",
            _hover: { bg: "blue.700" },
            _focusVisible: {
              outline: "2px solid",
              outlineColor: "blue.300",
              outlineOffset: "2px",
            },
            transition: "all 0.2s",
            cursor: "pointer",
          })}
        >
          ← Back to Gallery
        </button>
      </nav>
    </main>
  );
};

export default PhotoDetailPage;
