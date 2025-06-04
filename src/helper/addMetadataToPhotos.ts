// src/heper/addMetadataToPhotos.ts
import { categoriesPool, type Photo } from "../types";
import generateRandomDate from "./generateRandomDate";

// Helper function to add metadata to photos
const addMetadataToPhotos = (photos: Photo[]): Photo[] => {
  return photos.map(photo => ({
    ...photo,
    title: `Photo by ${photo.author}`,
    upload_date: generateRandomDate(),
    categories: [
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)],
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)]
    ].filter((cat, idx, arr) => arr.indexOf(cat) === idx),// Ensure unique categories
  }));
}

export default addMetadataToPhotos;