import { css } from "../styled-system/css";
import { useParams, useNavigate } from "react-router-dom";
import { PhotoCard } from "../components/PhotoCard";
import { usePhotoContext } from "../context/PhotoContext";

export const PhotoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
const { photos } = usePhotoContext();
  const photoIndex = photos.findIndex((p) => p.id === id);
  const photo = photos[photoIndex];
  const navigate = useNavigate();

  if (!photo) return <div>Photo not found</div>;

  const goNext = () => {
    const next = photos[photoIndex + 1];
    // if next photo not exist got to first photo
    if (!next) navigate(`/photos/${photos[0].id}`);
    if (next) navigate(`/photos/${next.id}`);
  };

  const goPrev = () => {
    const prev = photos[photoIndex - 1];
    // if prev photo not exist got to last photo
    if (!prev) navigate(`/photos/${photos[photos.length - 1].id}`);
    if (prev) navigate(`/photos/${prev.id}`);
  };

  return (
    <div className={css({ p: "6", maxW: "5xl", mx: "auto" })}>
      <PhotoCard photo={photo} />
      <div
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
            rounded: "md",
            fontWeight: "medium",
            _hover: { bg: "gray.200" },
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
            rounded: "md",
            fontWeight: "medium",
            _hover: { bg: "gray.200" },
            transition: "all 0.2s",
            cursor: "pointer",
          })}
        >
          Next →
        </button>
      </div>
      <div className={css({ textAlign: "center" })}>
        <button
          onClick={() => navigate("/")}
          className={css({
            mt: "4",
            px: "6",
            py: "2",
            fontSize: "sm",
            fontWeight: "medium",
            bg: "blue.600",
            color: "white",
            rounded: "md",
            _hover: { bg: "blue.700" },
            transition: "all 0.2s",
            cursor: "pointer",
          })}
        >
          ← Back to Gallery
        </button>
      </div>
    </div>
  );
};
