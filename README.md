# Photo Gallery App

A responsive, accessible, and test-driven photo gallery application built with React, TypeScript, and Vite. The app fetches photos from a public REST API, displays them in an infinite‐scroll gallery, and allows users to click on any photo to see its full‐size version along with metadata. Accessibility best practices (WCAG 2.1 A) are applied throughout, and the codebase is architected following SOLID principles.

---

![How to use the app](./src/assets/guide.gif)

> **Note:** In this demo, the `categories` array is populated by picking two random entries from `categoriesPool`. As a result, a photo’s assigned categories are purely illustrative and do not necessarily correspond to the actual content of the image.

## Live Demo

Check out the deployed version here:
[photo-gallery-app](https://photo-gallery-app-mauve.vercel.app/)

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Running in Development Mode](#running-in-development-mode)
  * [Building for Production](#building-for-production)
  * [Previewing the Production Build](#previewing-the-production-build)
* [Mock Data](#mock-data)
* [Testing](#testing)
* [Architectural Decisions & Patterns](#architectural-decisions--patterns)
* [Accessibility](#accessibility)
* [Folder Layout](#folder-layout)
* [Scripts](#scripts)

---

## Features

* **Photo Gallery**

  * Fetches a grid of photos from a public REST API (e.g., [Picsum.photos](https://picsum.photos/) or [JSONPlaceholder](https://jsonplaceholder.typicode.com/)).
  * Displays photo thumbnails in a responsive, mobile-first grid via the `<PhotoList>` and `<PhotoItem>` components.
  * Implements infinite scroll through a custom `useInfiniteScroll` hook that loads more photos as the user scrolls.
  * Shows basic metadata (title, author, upload date) with each thumbnail, falling back to “Photo by {author}” or “Uploaded: Unknown” when fields are missing.

* **Photo Details Page**

  * Clicking on a thumbnail navigates to a detail view (React Router).
  * Displays the full-size image plus extended metadata (title, author, date, description).
  * “Next” / “Previous” navigation buttons to cycle through photos without returning to the gallery.

* **Search & Filter**

  * Text-based search (by title or author) handled by a `useDebounce` hook and filtered via `usePhotoFilter`.
  * Filter by category using a Radix UI combobox, hitting the branch where categories are mapped case-insensitively.
  * Filter by upload date—uses string matching with `.startsWith(...)` against `photo.upload_date`.
  * Clear search and filter controls reset all criteria and show the full photo list again.

* **Responsive Design**

  * Mobile-first CSS layout via Panda CSS, works on phones, tablets, and desktops.
  * Grid adapts from a single column on narrow screens to multiple columns on wider screens.

* **Error Handling & Loading States**

  * Graceful UI when the API call fails (error message and retry).
  * Loading indicator “Loading more photos…” displayed when `loading=true`.
  * “No more photos to load.” message when `hasMore=false` and not loading.

* **Testing**

  * Jest & React Testing Library for unit and integration tests.
  * Custom tests for components (`PhotoItem`, `PhotoList`) and hooks (`usePhotoFilter`, `useInfiniteScroll`).
  * Coverage target: ≥ 90%.

* **Code Quality**

  * TypeScript for type safety.
  * Panda CSS for utility-first styling (no class-name collisions).

---

## Tech Stack

* **Framework & Language**

  * React 18 + TypeScript
  * Vite (bundler & dev server)

* **State Management & Data**

  * React Context API (`PhotoContext`)
  * Custom React Hooks

    * `usePhotoFilter` (filters an array of `Photo`)
    * `useInfiniteScroll` (sets up IntersectionObserver for infinite loading)
    * `useDebounce` (debounces search input)

* **Routing**

  * React Router v6

* **Styling**

  * Panda CSS (utility-first, atomic-style approach)
  * Global resets & base styles in `index.css`

* **Component Primitives**

  * Radix UI (Tooltip, Select/Combobox, Dialog)

* **Testing**

  * Jest
  * React Testing Library
  * `@testing-library/jest-dom`

* **Tooling & Configuration**

  * Vite (`vite.config.ts`)
  * TypeScript (`tsconfig.json`)
  * ESLint + Prettier (`.eslintrc.js`)
  * Jest (`jest.config.js`, `jest.setup.js`)

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* Node.js ≥ 14.x
* npm or Yarn installed

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mkareshky/photo-gallery-app.git
   cd photo-gallery-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

### Running in Development Mode

```bash
npm run dev
# or
yarn dev
```

This starts the Vite dev server with hot module replacement.

### Building for Production

```bash
npm run build
# or
yarn build
```

Generates an optimized build in the `dist/` folder.

### Previewing the Production Build

After building, you can serve the `dist/` folder locally with a simple static server:

```bash
npx serve dist
```

or, if you have `serve` installed globally:

```bash
serve dist
```

Then visit `http://localhost:5000` (or whichever port is shown) to see the production bundle.

---

## Mock Data

For this demo, photo metadata (title, upload date, categories) is generated using mock data. In particular, the helper function below takes an array of photos (fetched from the API) and adds a random title, upload date, and one or two categories per photo. Because categories are chosen at random from a predefined pool, they may not actually match the photo content.

```ts
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
    ].filter((cat, idx, arr) => arr.indexOf(cat) === idx) // Ensure unique categories
  }));
};

export default addMetadataToPhotos;
```

---

## Testing

This project uses Jest + React Testing Library for unit and integration tests. Mocks are defined in the `__mocks__` folder to stub out static assets (images, CSS modules) and external services.

### Run All Tests

```bash
npm test
# or
yarn test
```

Runs Jest in watch mode by default (interactive).

### Run Tests Once & Generate Coverage Report

```bash
npm run test:ci
# or
yarn test:ci
```

* Runs tests a single time and outputs a pass/fail summary.
* Generates a coverage report (in `coverage/lcov-report/index.html`).
* Coverage threshold is set to 80%.

---

## Architectural Decisions & Patterns

1. **SOLID Principles**
   This project follows SOLID principles—each component or module has a single responsibility, and higher‐level components depend on abstractions (hooks and context) rather than concrete implementations. For a deeper dive into each principle and how they’re applied here, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

2. **Repository Pattern & Data Layer**

   * The `PhotoApiRepository` implements `IPhotoRepository` to fetch pages, apply filters, and return `{ photos, hasMore }`.
   * Helper functions (`addMetadataToPhotos.ts`, `generateRandomDate.ts`) isolate data transformations—including the mock‐data logic.
   * `PhotoContext.tsx` provides a global store for photo data, caching, pagination state, and filter values.

3. **Custom Hooks**

   * `useInfiniteScroll` handles setting up and tearing down an `IntersectionObserver` for infinite loading.
   * `usePhotoFilter` filters an array of `Photo` objects based on `searchTerm`, `category`, and `uploadDate`.
   * `useDebounce` debounces search/filter inputs to prevent excessive re-renders.

4. **Compound Components & Radix UI**

   * In the `components/ui` folder, atomic UI pieces (e.g., `<CategorySelect>`, `<FilterPanel>`) can be composed in parent components.
   * Radix primitives (Tooltip, Dialog, Select) ensure accessible dropdowns, dialogs, and tooltips.

5. **Separation of Concerns**

   * **UI Layer**: Presentational components (`PhotoItem`, `PhotoList`, `FilterPanel`) live under `src/components`.
   * **Business Logic / Data Layer**: Hooks (`usePhotos.ts`, `usePhotoFilter.ts`) and helper functions (`helper/*.ts`) manage API calls, data transformations, and state.
   * **Routing Layer**: `src/router/index.tsx` contains route definitions and layout boundaries (e.g., a common `<Layout>` with header/navigation).

6. **TypeScript & Type Safety**

   * Shared types live in `src/types/index.ts` (e.g., `Photo`, `FilterCriteria`, `IPhotoRepository`).
   * All components and hooks are strongly typed—no use of `any`.

7. **Panda CSS for Styling**

   * Utility‐first, atomic CSS classes auto‐generated by Panda.
   * Global styles (resets, fonts) in `index.css`.
   * Component‐level styles are applied via Panda’s atomic class names (no separate `.css` modules).

8. **Routing & Lazy Loading**

   * React Router v6’s `createBrowserRouter` is used.
   * Code‐splitting with `React.lazy` and `Suspense` for page components (`GalleryPage`, `PhotoDetailPage`) to minimize the initial bundle size.

---

## Accessibility

We have implemented several accessibility features to comply with WCAG 2.1 A:

* **Semantic HTML**
  Proper use of `<header>`, `<main>`, `<section>`, `<ul>`, `<li>`, `<button>`, etc.

* **ARIA Attributes & Roles**
  Where necessary (e.g., `<button aria-label="Close dialog">`, `<select aria-label="Category">`).

* **Keyboard Navigation**
  All interactive elements (buttons, links, form inputs) are reachable by Tab.
  Visible focus indicators for keyboard users.

* **Color Contrast**
  All text/background combinations ensure a minimum contrast ratio of 4.5:1.

* **Accessible Dialog for Photo Details**
  The `<Dialog>` component from Radix UI provides focus trapping, ARIA roles, and screen‐reader announcements.

---

## Folder Layout

```
src/
├── __mocks__/               # Mocks for Jest (images, CSS modules)
├── assets/                  # Raw images/icons or SVGs
├── components/              # Reusable UI components
├── context/                 # React Context (PhotoContext) for global state
├── helper/                  # Pure helper functions (data transformations, date utilities)
├── hooks/                   # Custom React hooks (useInfiniteScroll, usePhotoFilter, useDebounce)
├── pages/                   # Route-level pages (GalleryPage, PhotoDetailPage)
├── router/                  # React Router configuration (createBrowserRouter)
├── services/                # Service layer (PhotoApiRepository, IPhotoRepository)
├── types/                   # TypeScript interfaces/types (Photo, FilterCriteria, IPhotoRepository)
├── App.tsx                  # Root component (wraps Context + Router)
├── main.tsx                 # Entry point (renders <App /> to #root)
└── index.css                # Global CSS resets & base styles
```

---

## Scripts

* **`npm run dev`** (or `yarn dev`):
  Starts the Vite dev server with hot module replacement.

* **`npm run build`** (or `yarn build`):
  Bundles the app for production into the `dist/` folder.

* **`npm test`**:
  Runs Jest in watch mode for continuous testing.

* **`npm run test:ci`** (or `yarn test:ci`):
  Runs tests once, outputs results, and generates a coverage report.

---

**Thank you for trying out the Photo Gallery App!** If you encounter any issues or have ideas for improvements, please open an issue or submit a pull request.
