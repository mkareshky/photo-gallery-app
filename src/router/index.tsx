import GalleryPage from "../pages/GalleryPage";
import PhotoDetailPage from "../pages/PhotoDetailPage";
import React from "react";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <GalleryPage /> },
  { path: "/photos/:id", element: <PhotoDetailPage /> },
]);
