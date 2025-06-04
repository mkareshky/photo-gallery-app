// src/context/PhotoContext.tsx
import React, { createContext, useContext } from "react";
import { usePhotoData } from "../hooks/usePhotoData";
import type { PhotoContextType } from "../types";

// Now PhotoContext only provides the data layer (no retry)
export const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { photos, loading, error, loadMore, hasMore } = usePhotoData();
  // Provide a no-op retry so that PhotoContextType is satisfied
  const retry = () => {
    /* Optional: wire up real retry logic here */
  };

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
