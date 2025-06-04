# Photo Gallery App

A responsive, accessible, and test-driven photo gallery application built with React, TypeScript, and Vite. The app fetches photos from a public REST API, displays them in an infinite-scroll gallery, and allows users to click on any photo to see its full-size version along with metadata. The codebase follows SOLID principles, using a Repository Pattern (`IPhotoRepository` + `PhotoService`) for data access, and key UI components (e.g., `<PhotoNavigationButtons>`, `<LazyImage>`) are fully covered by Jest tests.

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

### Photo Gallery

* **Fetch & Display**
  Retrieves a grid of photos from a public REST API (e.g., [Picsum.photos](https://picsum.photos/) or [JSONPlaceholder](https://jsonplaceholder.typicode.com/)).
* **Infinite Scroll**
  Custom `useInfiniteScroll` hook sets up an `IntersectionObserver` to load more photos as the user scrolls.
* **Search & Filter**

  * Text-based search (by title or author) is debounced via `useDebounce` and filtered by `usePhotoFilter`.
  * Filter by category (Radix UI combobox) and by upload date (string-based).
  * Clear controls reset all criteria and show the full photo list again.
* **Responsive Layout**
  CSS is written with Panda CSS utility classes. The grid adapts from one column on small screens to multiple columns on larger devices.
* **Error & Loading States**

  * Shows a “Loading more photos…” indicator while fetching.
  * Displays “No more photos to load.” once `hasMore=false`.
  * Graceful fallback on API errors with a retry button.

### Photo Details Page

* **Routing**
  Clicking a thumbnail navigates to a detail view via React Router v6.
* **Metadata**
  Displays full-size image plus extended metadata (title, author, upload date, categories, etc.).
* **Next/Previous Navigation**
  `<PhotoNavigationButtons>` component cycles through photos without returning to the gallery.
* **Repository Pattern**
  A `PhotoService` class implements `IPhotoRepository` (getPhotos, getPhotoById, getNextPhotoId, getPrevPhotoId). This abstraction ensures UI components depend on an interface, not on concrete API calls.

### Lazy Loading Images

* `<LazyImage>` component uses `IntersectionObserver` to only load `<img>` when it scrolls into view.
* Before the image is visible, a placeholder `<div>` of configurable height/background is rendered.

### Accessibility

* **Semantic HTML & ARIA**
  Proper use of `<header>`, `<main>`, `<section>`, `<nav>`, and `<button>` with appropriate ARIA labels (e.g., `aria-label="Photo navigation"`).
* **Keyboard Navigation**
  All interactive elements (buttons, links, inputs) are focusable via Tab with visible focus styles.
* **Color Contrast**
  All text/background combos meet a minimum 4.5:1 contrast ratio.
* **Responsive Dialog (Radix UI)**
  The `<Dialog>` used in Photo Details handles focus trapping, ARIA roles, and announcements for screen readers.

---

## Tech Stack

* **Framework & Language**

  * React 18 + TypeScript
  * Vite (bundler & dev server)
* **State & Data Layer**

  * React Context API (`PhotoContext` + `PhotoRepositoryContext`)
  * Repository Pattern (`IPhotoRepository` + `PhotoService`)
  * Helper functions (`addMetadataToPhotos.ts`, `generateRandomDate.ts`)
* **Custom Hooks**

  * `useInfiniteScroll` (IntersectionObserver)
  * `usePhotoFilter` (text/category/date filters)
  * `useDebounce` (search input)
* **Routing**

  * React Router v6 (`src/router/index.tsx`)
* **Styling**

  * Panda CSS (utility-first)
  * Global resets & base styles in `index.css`
* **Component Primitives**

  * Radix UI (Select/Combobox, Dialog, Tooltip)
* **Testing**

  * Jest
  * React Testing Library
  * `@testing-library/jest-dom`
  * Custom tests cover components (`LazyImage`, `PhotoNavigationButtons`, `PhotoItem`, `PhotoList`), services (`PhotoService`), hooks, and context providers
* **Tooling**

  * ESLint + Prettier
  * TypeScript (`tsconfig.json`)
  * Jest config (`jest.config.cjs`, `jest.setup.js`)

---

## Getting Started

Follow these steps to set up the project locally.

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

Starts the Vite dev server ([http://localhost:5173](http://localhost:5173) by default) with hot-module replacement.

### Building for Production

```bash
npm run build
# or
yarn build
```

Bundles the app into the `dist/` folder.

### Previewing the Production Build

Serve the `dist/` folder with a static server:

```bash
npx serve dist
# or
serve dist  # if `serve` is installed globally
```

Then visit the indicated port (e.g., [http://localhost:5000](http://localhost:5000)).

---

## Mock Data

Photo metadata (title, upload date, categories) is generated via helper functions. For example, in `src/helper/addMetadataToPhotos.ts`:

```ts
import { categoriesPool, type Photo } from "../types";
import generateRandomDate from "./generateRandomDate";

// Adds a random title, upload_date, and 1–2 unique categories per photo
const addMetadataToPhotos = (photos: Photo[]): Photo[] =>
  photos.map(photo => ({
    ...photo,
    title: `Photo by ${photo.author}`,
    upload_date: generateRandomDate(),
    categories: [
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)],
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)],
    ].filter((cat, idx, arr) => arr.indexOf(cat) === idx),
  }));

export default addMetadataToPhotos;
```

Since categories are picked randomly, they may not match the actual photo content.

---

## Testing

This project uses Jest and React Testing Library for comprehensive coverage.

### Run All Tests

```bash
npm test
# or
yarn test
```

Launches Jest in watch mode.

### Run Tests Once & Generate Coverage

```bash
npm run test:ci
# or
yarn test:ci
```

* Runs tests a single time, outputs results.
* Generates a coverage report (`coverage/lcov-report/index.html`).
* Coverage target: ≥ 80% by default.

---

## Architectural Decisions & Patterns

1. **SOLID Principles**

   * **Single Responsibility**: Each component, hook, or service does one thing (e.g., `PhotoService` handles only photo data lookup; `<LazyImage>` handles only lazy loading).
   * **Open/Closed**: Interfaces (`IPhotoRepository`) allow extension without modifying existing code. Custom `PhotoApiRepository` can be added without changing UI components.
   * **Liskov Substitution**: Any class implementing `IPhotoRepository` (e.g., `PhotoService` or a future `MockRepository`) can be substituted without breaking consumers.
   * **Interface Segregation**: Narrow interfaces (`IPhotoRepository`) expose only the methods needed by UI.
   * **Dependency Inversion**: UI components rely on abstractions (`IPhotoRepository`), not concrete implementations. `PhotoRepositoryContext` injects `PhotoService`.

2. **Repository Pattern & Data Layer**

   * `IPhotoRepository` (interface) defines:

     ```ts
     getPhotos(): Photo[];
     getPhotoById(id: string): Photo | undefined;
     getNextPhotoId(currentId: string): string;
     getPrevPhotoId(currentId: string): string;
     ```
   * `PhotoService` implements these methods, indexing an in-memory array fetched from `PhotoContext`.
   * `PhotoRepositoryProvider` (in `src/context/PhotoRepositoryContext.tsx`) wraps children and supplies a `PhotoService` instance via React Context.

3. **Custom Hooks**

   * **`useInfiniteScroll`**: Sets up `IntersectionObserver` for paging.
   * **`usePhotoFilter`**: Filters based on search term, selected category, and upload date.
   * **`useDebounce`**: Prevents excessive re-rendering for text inputs.

4. **Compound Components & Radix UI**

   * UI components like `<CategorySelect>` (Radix Combobox) and `<FilterPanel>` are composed in `<GalleryPage>`.
   * Radix primitives (Tooltip, Dialog, Select) ensure accessible dropdowns/dialogs.

5. **Separation of Concerns**

   * **UI Layer**: Presentational components (`PhotoItem`, `PhotoList`, `FilterPanel`) under `src/components`.
   * **Business Logic / Data Layer**: Hooks (`usePhotos.ts`, `usePhotoFilter.ts`) and helpers (`addMetadataToPhotos.ts`, `generateRandomDate.ts`) under `src/hooks` and `src/helper`.
   * **Routing Layer**: `src/router/index.tsx` contains route definitions, wrapped by `PhotoProvider` and `PhotoRepositoryProvider`.

6. **TypeScript & Type Safety**

   * Shared types live in `src/types/index.ts` (e.g., `Photo`, `FilterCriteria`, `IPhotoRepository`).
   * No use of `any`—all components and hooks are strongly typed.

7. **Panda CSS for Styling**

   * Atomic utility classes generated by Panda CSS.
   * Global resets and base typography in `index.css`.

8. **Lazy Loading & Performance**

   * `<LazyImage>` uses an `IntersectionObserver` polyfill in tests and native API in browsers to defer loading offscreen images.
   * Code splitting via `React.lazy` & `Suspense` for `<GalleryPage>` and `<PhotoDetailPage>`.

---

## Accessibility

* **Semantic Markup**
  Proper use of `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<button>`, and `<ul>/<li>`.
* **ARIA Attributes**

  * `<nav aria-label="Photo navigation">` for the previous/next buttons.
  * `<button aria-label="Clear Filters">` on filter controls.
* **Keyboard Navigation**
  All interactive elements are reachable via Tab; focus states are visible.
* **Color Contrast**
  All text/background combinations meet at least 4.5:1 contrast.
* **Accessible Dialog**
  The Radix `<Dialog>` used in Photo Details provides focus trapping, ARIA roles, and announcements.

---

## Folder Layout

```
src/
├── __mocks__/                    # Jest mocks for static assets (images, CSS modules)
├── assets/                       # Raw images/icons or SVGs (e.g., guide.gif)
├── components/                   # Reusable UI components
├── context/                      # React Context providers
├── helper/                       # Pure helper functions (data transforms, date utils)
├── hooks/                        # Custom React hooks
├── pages/                        # Route-level pages
├── router/                       # React Router configuration
├── services/                     # Service / Repository layer
├── types/                        # TypeScript types & interfaces
│   └── index.ts                  # Photo, FilterCriteria, categoriesPool, etc.
├── main.tsx                      # Entry point (renders <RouterProvider> under Contexts)
├── index.css                     # Global CSS resets & base styles
└── vite.config.ts                # Vite configuration
```

> **Note:** There is no `App.tsx`—`main.tsx` wraps `PhotoProvider` and `PhotoRepositoryProvider` around the router.

---

## Scripts

* **`npm run dev`** (or `yarn dev`)
  Starts Vite dev server with HMR ([http://localhost:5173](http://localhost:5173)).
* **`npm run build`** (or `yarn build`)
  Bundles for production into `dist/`.
* **`npm run serve`** (or `yarn serve`)
  Serves `dist/` folder locally (if you have `serve` installed).
* **`npm test`**
  Runs Jest in watch mode.
* **`npm run test:ci`** (or `yarn test:ci`)
  Runs all tests once and generates a coverage report.

---

**Thank you for exploring the Photo Gallery App!**
Feel free to open an issue or submit a pull request for improvements or bug fixes.
