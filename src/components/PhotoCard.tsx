import React from "react";
import { css } from "../styled-system/css";
import type { PhotoCardProps } from "../types";

export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <article
      className={css({
        maxW: "2xl",
        mx: "auto",
        my: "8",
        rounded: "2xl",
        shadow: "lg",
        bg: "white",
      })}
    >
      {/* FIGURE: image + caption */}
      <figure>
        {photo.download_url ? (
          <img
            src={photo.download_url}
            alt={photo.author || "Photo"}
            className={css({
              w: "full",
              maxH: "80vh",
              objectFit: "contain",
              rounded: "2xl 2xl 0 0",
            })}
          />
        ) : (
          <div
            className={css({
              p: "6",
              color: "blue.600",
              textAlign: "center",
              bg: "gray.50",
              rounded: "2xl 2xl 0 0",
              shadow: "sm",
              fontWeight: "semibold",
              fontSize: "lg",
              w: "full",
              h: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            Photo not found
          </div>
        )}

        {photo.author && (
          <figcaption
            className={css({
              px: "4",
              py: "2",
              fontSize: "sm",
              color: "gray.600",
              textAlign: "right",
              bg: "gray.50",
              rounded: "0 0 2xl 2xl",
            })}
          >
            © {photo.author}
          </figcaption>
        )}
      </figure>

      {/* HEADER: title + metadata + action link */}
      <header
        className={css({
          textAlign: "center",
          p: "6",
          bg: "gray.50",
          rounded: "0 0 2xl 2xl",
        })}
      >
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "2" })}>
          {photo.title || photo.author}
        </h2>
        <p className={css({ fontSize: "sm", color: "gray.600", mb: "1" })}>
          ID: {photo.id}
        </p>
        <p className={css({ fontSize: "sm", color: "gray.600", mb: "1" })}>
          Dimensions: {photo.width} × {photo.height}
        </p>
        <p className={css({ fontSize: "sm", color: "gray.600", mb: "1" })}>
          Uploaded:{" "}
          {photo.upload_date
            ? new Date(photo.upload_date).toLocaleDateString()
            : "Unknown"}
        </p>


        {photo.categories && photo.categories.length > 0 && (
          <ul
            className={css({
              listStyleType: "disc",
              listStylePosition: "inside",
              fontSize: "sm",
              color: "gray.600",
              mb: "2",
              textAlign: "left",
              px: { base: "4", md: "8" },
            })}
          >
            <p>
              Categories: {photo.categories.join(", ")}
            </p>
          </ul>
        )}

        <a
          href={photo.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            mt: "4",
            display: "inline-block",
            fontSize: "sm",
            color: "blue.600",
            textDecoration: "underline",
            _hover: { color: "blue.800" },
            _focusVisible: {
              outline: "2px solid",
              outlineColor: "blue.500",
            },
          })}
        >
          View Original
        </a>
      </header>
    </article>
  );
};
