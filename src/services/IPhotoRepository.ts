// src/services/IPhotoRepository.ts

import { Photo } from "../types";

export interface IPhotoRepository {
  getPhotos(): Photo[];
  getPhotoById(id: string): Photo | undefined;
  getNextPhotoId(currentId: string): string;
  getPrevPhotoId(currentId: string): string;
}
