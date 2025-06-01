import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { GalleryPage } from "../pages/GalleryPage";
import { PhotoDetailPage } from "../pages/PhotoDetailPage";

export const router = createBrowserRouter([
  { path: "/", element: <GalleryPage /> },
  { path: "/photos/:id", element: <PhotoDetailPage /> },
]);
