// src/services/PhotoService.ts
import { IPhotoRepository } from "./IPhotoRepository";
import { Photo } from "../types";

export class PhotoService implements IPhotoRepository {
  private photos: Photo[];

  constructor(photos: Photo[]) {
    this.photos = photos;
  }

  getPhotos(): Photo[] {
    return this.photos;
  }

  getPhotoById(id: string): Photo | undefined {
    return this.photos.find(p => p.id === id);
  }

  getNextPhotoId(currentId: string): string {
    const index = this.photos.findIndex(p => p.id === currentId);
    if (index === -1) return this.photos[0].id;
    const next = this.photos[index + 1] ?? this.photos[0];
    return next.id;
  }

  getPrevPhotoId(currentId: string): string {
    const index = this.photos.findIndex(p => p.id === currentId);
    if (index === -1) return this.photos[this.photos.length - 1].id;
    const prev = this.photos[index - 1] ?? this.photos[this.photos.length - 1];
    return prev.id;
  }
}
