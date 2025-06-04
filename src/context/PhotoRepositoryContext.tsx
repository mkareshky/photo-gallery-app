// src/context/PhotoRepositoryContext.tsx
import React, { createContext, useContext } from "react";
import { IPhotoRepository } from "../services/IPhotoRepository";
import { usePhotoContext } from "./PhotoContext";
import { PhotoService } from "../services/PhotoService";

const PhotoRepositoryContext = createContext<IPhotoRepository | null>(null);

export const PhotoRepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { photos } = usePhotoContext();
  const repo = new PhotoService(photos);
  return (
    <PhotoRepositoryContext.Provider value={repo}>
      {children}
    </PhotoRepositoryContext.Provider>
  );
};

export const usePhotoRepository = (): IPhotoRepository => {
  const repo = useContext(PhotoRepositoryContext);
  if (!repo) {
    throw new Error("PhotoRepositoryContext is not provided");
  }
  return repo;
};
