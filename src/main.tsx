// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { PhotoProvider } from "./context/PhotoContext";
import { PhotoRepositoryProvider } from "./context/PhotoRepositoryContext";
import { router } from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <PhotoProvider>
          <PhotoRepositoryProvider>
            <RouterProvider router={router} />
          </PhotoRepositoryProvider>
        </PhotoProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
