// src/components/PhotoItem.tsx
import React from "react";
import { css } from "../styled-system/css";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link } from "react-router-dom";
import { LazyImage } from "./LazyImage";
import type { Photo } from "../types";

interface PhotoItemProps {
  photo: Photo;
}

export const PhotoItem: React.FC<PhotoItemProps> = ({ photo }) => {
  return (
    <li key={photo.id}>
      <Tooltip.Provider>
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
                _focus: {
                  outline: "2px solid",
                  outlineColor: "blue.500",
                  outlineOffset: "2px",
                },
              })}
            >
              <LazyImage
                src={photo.download_url}
                alt={photo.title || `Photo by ${photo.author}`}
                className={css({
                  w: "full",
                  h: "auto",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                })}
                placeholderHeight={250}
              />

              <div
                className={css({
                  p: "3",
                  bg: "gray.50",
                  textAlign: "left",
                })}
              >
                <p
                  className={css({
                    fontWeight: "semibold",
                    fontSize: "sm",
                    mb: "1",
                    color: "gray.700",
                  })}
                >
                  {photo.title || `Photo by ${photo.author}`}
                </p>
                <p
                  className={css({
                    fontSize: "xs",
                    color: "gray.600",
                  })}
                >
                  Author: {photo.author}
                </p>
                <p
                  className={css({
                    fontSize: "xs",
                    color: "gray.500",
                  })}
                >
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
    </li>
  );
};
