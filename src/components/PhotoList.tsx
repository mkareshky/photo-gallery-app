// src/components/PhotoList.tsx
import React from "react";
import { css } from "../styled-system/css";
import { PhotoItem } from "./PhotoItem";
import type { Photo } from "../types";

interface PhotoListProps {
  photos: Photo[];
}

export const PhotoList: React.FC<PhotoListProps> = ({ photos }) => {
  return (
    <ul
      className={css({
        display: "grid",
        gridTemplateColumns: [
          "1fr",
          "1fr 1fr",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ],
        gap: "6",
        listStyle: "none",
        p: 0,
        m: 0,
      })}
    >
      {photos.map((photo) => (
        <PhotoItem key={photo.id} photo={photo} />
      ))}
    </ul>
  );
};
