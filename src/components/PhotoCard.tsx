import React from "react";
import { css } from "../styled-system/css";
import type { PhotoCardProps } from "../types";


export const PhotoCard: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div>
      {photo.download_url ? (
        <img
          src={photo.download_url}
          alt={photo.author}
          className={css({
            w: "full",
            maxH: "80vh",
            objectFit: "contain",
            rounded: "2xl",
            shadow: "lg",
            mb: "6",
          })}
        />
      ) : (
        <div
          className={css({
            p: "4",
            color: "blue.600",
            textAlign: "center",
            bg: "gray.50",
            rounded: "lg",
            shadow: "sm",
            fontWeight: "semibold",
            fontSize: "lg",
            width: "123vh",
            margin: "auto",
            height: "50vh",
          })}
        >
          Photo not found
        </div>
      )}

      <div
        className={css({
          textAlign: "center",
          p: "4",
          bg: "gray.50",
          rounded: "lg",
          shadow: "sm",
        })}
      >
        <h2 className={css({ fontSize: "2xl", fontWeight: "bold", mb: "2" })}>
          {photo.title || photo.author}
        </h2>
        <p className={css({ fontSize: "sm", color: "gray.600" })}>ID: {photo.id}</p>
        <p className={css({ fontSize: "sm", color: "gray.600", mb: "2" })}>
          Dimensions: {photo.width} × {photo.height}
        </p>
        <p className={css({ fontSize: "sm", color: "gray.600", mb: "2" })}>
          Uploaded:{" "}
          {photo.upload_date
            ? new Date(photo.upload_date).toLocaleDateString()
            : "Unknown"}
        </p>

        {photo.categories && photo.categories.length > 0 && (
          <p className={css({ fontSize: "sm", color: "gray.600", mb: "2" })}>
            Categories: {photo.categories.join(", ")}
          </p>
        )}

        <a
          href={photo.download_url}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            fontSize: "sm",
            color: "blue.600",
            textDecoration: "underline",
            _hover: { color: "blue.800" },
          })}
        >
          View Original
        </a>
      </div>
    </div>
  );
};
