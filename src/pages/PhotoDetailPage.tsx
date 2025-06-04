// src/pages/PhotoDetailPage.tsx
import React from "react";
import { css } from "../styled-system/css";
import { useNavigate, useParams } from "react-router-dom";
import { PhotoCard } from "../components/PhotoCard";
import { usePhotoRepository } from "../context/PhotoRepositoryContext";
import { PhotoNavigationButtons } from "../components/PhotoNavigationButtons";

const PhotoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const repo = usePhotoRepository();

  if (!id) {
    return (
      <main className={css({ p: "6", maxW: "5xl", mx: "auto" })}>
        <p>Photo id not found</p>
      </main>
    );
  }

  const photo = repo.getPhotoById(id);
  if (!photo) {
    return (
      <main className={css({ p: "6", maxW: "5xl", mx: "auto" })}>
        <p>Photo not found</p>
      </main>
    );
  }

  const goNext = () => {
    const nextId = repo.getNextPhotoId(photo.id);
    navigate(`/photos/${nextId}`);
  };

  const goPrev = () => {
    const prevId = repo.getPrevPhotoId(photo.id);
    navigate(`/photos/${prevId}`);
  };

  return (
    <main className={css({ p: "6", maxW: "5xl", mx: "auto" })}>

      <article>
        <PhotoCard photo={photo} />
      </article>


      <PhotoNavigationButtons goNext={goNext} goPrev={goPrev} />


      <nav
        aria-label="Return to gallery"
        className={css({ textAlign: "center", mt: "4" })}
      >
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
