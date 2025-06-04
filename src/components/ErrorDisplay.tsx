// src/components/ErrorDisplay.tsx
import React from "react";
import { usePhotos } from "../hooks/usePhotos";

export const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => {
  const { retry } = usePhotos();
  return (
    <div role="alert">
      <p>{message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  );
};
