// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { PhotoProvider } from "./context/PhotoContext";
import { PhotoRepositoryProvider } from "./context/PhotoRepositoryContext";
import { router } from "./router";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PhotoProvider>
      <PhotoRepositoryProvider>
        <RouterProvider router={router} />
      </PhotoRepositoryProvider>
    </PhotoProvider>
  </React.StrictMode>
);
