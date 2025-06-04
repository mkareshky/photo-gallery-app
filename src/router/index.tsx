// src/router/index.tsx
 import React, { Suspense } from "react";
 import { createBrowserRouter } from "react-router-dom";

const GalleryPage = React.lazy(() => import("../pages/GalleryPage"));
const PhotoDetailPage = React.lazy(() => import("../pages/PhotoDetailPage"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <GalleryPage />
      </Suspense>
    ),
  },
  {
    path: "/photos/:id",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PhotoDetailPage />
      </Suspense>
    ),
  },
]);
