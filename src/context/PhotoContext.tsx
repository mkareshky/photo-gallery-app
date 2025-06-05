// src/context/PhotoContext.tsx
import React, { createContext, useContext } from "react";
import { usePhotos } from "../hooks/usePhotos";
import type { PhotoContextType } from "../types";

export const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { photos, loading, error, loadMore, hasMore, retry } = usePhotos();

  return (
    <PhotoContext.Provider value={{ photos, loading, error, loadMore, hasMore, retry }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotoContext = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error("usePhotoContext must be used within a PhotoProvider");
  }
  return context;
};
