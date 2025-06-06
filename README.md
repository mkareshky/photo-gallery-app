# Photo Gallery App

_A responsive, accessible, test-driven photo gallery built as a coding challenge._

This project fetches photos from a public API (Picsum.photos / JSONPlaceholder), enriches them with metadata (title, upload date, categories), and displays them in an infinite-scrolling grid. It was created to showcase SOLID architecture, a custom Repository Pattern (`IPhotoRepository` → `PhotoService`), Panda CSS styling, Radix UI primitives for a fully accessible UI, and Jest tests covering UI components, services, and hooks.

---

![How to use the app](./src/assets/guide.gif)

> **Note:** In this demo, the `categories` array is populated by picking two random entries from `categoriesPool`. As a result, a photo’s assigned categories are purely illustrative and do not necessarily correspond to the actual content of the image. If you want deterministic categories for testing, see the `__tests__` folder for how `addMetadataToPhotos` is mocked.

---

## Live Demo

Check out the deployed version here:  
[photo-gallery-app](https://photo-gallery-app-mauve.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running in Development Mode](#running-in-development-mode)  
  - [Building for Production](#building-for-production)  
  - [Previewing the Production Build](#previewing-the-production-build)  
- [Mock Data](#mock-data)
- [Testing](#testing)
- [Architectural Decisions & Patterns](#architectural-decisions--patterns)
- [Accessibility](#accessibility)
- [Folder Layout](#folder-layout)
- [Scripts](#scripts)
- [Deliverables](#deliverables)
- [Troubleshooting & Linting](#troubleshooting--linting)
- [Thank You](#thank-you)

---

## Features

### Photo Gallery

- **Fetch & Display**  
  Retrieves a grid of photos from a public REST API (e.g., [Picsum.photos](https://picsum.photos/) or [JSONPlaceholder](https://jsonplaceholder.typicode.com/)).
- **Infinite Scroll**  
  A custom `useInfiniteScroll` hook sets up an `IntersectionObserver` to load more photos as the user scrolls.  
  - The observer logic is consolidated into a single `useEffect`, which attaches or detaches the sentinel observer based on `loading`, `hasMore`, and `isFiltering` state, ensuring that filters correctly disable infinite scroll without redundant unobservations.
- **Search & Filter**  
  - Text-based search (by title or author) is debounced via `useDebounce` and filtered by `usePhotoFilter`.  
  - Filter by category (Radix UI combobox) and by upload date (native `<input type="date" />`).  
  - Clear controls reset all criteria and show the full photo list again.
- **Fallback Title Logic**  
  If a photo’s `title` is an empty string, the UI displays a fallback such as “Photo by {author}” inside `<PhotoCard>`, ensuring every card always shows a meaningful title.
- **Responsive Layout**  
  CSS is written with Panda CSS utility classes. The grid adapts from one column on small screens to multiple columns on larger devices.
- **Error & Loading States**  
  - Shows a “Loading more photos…” indicator while fetching more pages.  
  - Displays “No more photos to load.” once `hasMore = false`.  
  - Graceful fallback on API errors with a retry button.

### Photo Details Page

- **Routing**  
  Clicking a thumbnail navigates to a detail view via React Router v6.
- **Metadata**  
  Displays full-size image plus extended metadata (title, author, upload date, categories, etc.). If `title` is missing, the fallback logic ensures “Photo by {author}” appears.
- **Next/Previous Navigation**  
  `<PhotoNavigationButtons>` component cycles through photos without returning to the gallery, using wrap-around logic in `PhotoService`.

### Lazy Loading Images

- `<LazyImage>` component uses `IntersectionObserver` to only load `<img>` when it scrolls into view.  
- Before the image is visible, a placeholder `<div>` of configurable height/background is rendered.

---

## Tech Stack

- **Framework & Language**  
  - React 18 + TypeScript  
  - Vite (bundler & dev server)
- **State & Data Layer**  
  - React Context API (`PhotoContext` + `PhotoRepositoryContext`)  
  - Repository Pattern (`IPhotoRepository` + `PhotoService`)  
  - Helper functions (`addMetadataToPhotos.ts`, `generateRandomDate.ts`)
- **Custom Hooks**  
  - `useInfiniteScroll` (IntersectionObserver)  
  - `usePhotoFilter` (text/category/date filters)  
  - `useDebounce` (search input)
- **Routing**  
  - React Router v6 (`src/router/index.tsx`)
- **Styling**  
  - Panda CSS (utility-first)  
  - Global resets & base styles in `index.css`
- **Component Primitives**  
  - Radix UI (Select/Combobox, Dialog, Tooltip)
- **Testing**  
  - Jest  
  - React Testing Library  
  - `@testing-library/jest-dom`  
  - Custom tests cover components (`LazyImage`, `PhotoNavigationButtons`, `PhotoItem`, `PhotoList`), services (`PhotoService`), hooks, and context providers.
- **Tooling**  
  - ESLint + Prettier  
  - TypeScript (`tsconfig.json`)  
  - Jest config (`jest.config.cjs`, `jest.setup.js`)

---

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js ≥ 14.x  
- npm or Yarn installed

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/mkareshky/photo-gallery-app.git
   cd photo-gallery-app
   ````

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
    // Fallback title logic: always “Photo by {author}” if original title is empty
    title: photo.title || `Photo by ${photo.author}`,
    upload_date: generateRandomDate(),
    categories: [
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)],
      categoriesPool[Math.floor(Math.random() * categoriesPool.length)],
    ].filter((cat, idx, arr) => arr.indexOf(cat) === idx),
  }));

export default addMetadataToPhotos;
```

Since categories are picked randomly, they may not match the actual photo content.
If you need consistent categories for testing, see how `addMetadataToPhotos` is mocked in `src/helper/__tests__/addMetadataToPhotos.test.ts`.

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

* Runs tests a single time and outputs results.
* Generates a coverage report at `coverage/lcov-report/index.html`.
* Coverage target: ≥ 80% by default.

---

## Architectural Decisions & Patterns

1. **SOLID Principles**

   1. **Single Responsibility (SRP)**
      Each component, hook, or service does one thing—for example, `PhotoService` handles only photo data lookup; `<LazyImage>` handles only lazy loading.
   2. **Open/Closed (OCP)**
      Interfaces (`IPhotoRepository`) allow extension without modifying existing code. We can add a new `MockRepository` without touching UI components.
   3. **Liskov Substitution (LSP)**
      Any class implementing `IPhotoRepository` (e.g., `PhotoService` or a future `MockRepository`) can be substituted without breaking consumers.
   4. **Interface Segregation (ISP)**
      Narrow interfaces (`IPhotoRepository`) expose only the methods needed by UI.
   5. **Dependency Inversion (DIP)**
      UI components rely on abstractions (`IPhotoRepository`), not concrete implementations. `PhotoRepositoryContext` injects `PhotoService`.

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

   * **`useInfiniteScroll`**
     Consolidated `IntersectionObserver` logic into one `useEffect` for attaching/detaching the sentinel.
   * **`usePhotoFilter`**
     Filters based on search term, selected category, and upload date.
   * **`useDebounce`**
     Prevents excessive re-rendering for text inputs.

4. **Fallback Title Handling**
   Inside `<PhotoCard>` (and `<PhotoList>`), if `photo.title` is falsy, display `"Photo by {photo.author}"` to ensure every card shows a title.

5. **Compound Components & Radix UI**

   * UI components like `<CategorySelect>` (Radix Combobox) and `<FilterPanel>` are composed in `<GalleryPage>`.
   * Radix primitives (Tooltip, Dialog, Select) ensure accessible dropdowns/dialogs.
   * The category filter is implemented with `role="combobox"` and an accessible label “All Categories,” and the date filter uses a native `<input type="date" />` for compatibility with testing and screen readers.

6. **Separation of Concerns**

   * **UI Layer:** Presentational components (`PhotoItem`, `PhotoList`, `FilterPanel`) under `src/components`.
   * **Business Logic / Data Layer:** Hooks (`usePhotos.ts`, `usePhotoFilter.ts`) and helpers (`addMetadataToPhotos.ts`, `generateRandomDate.ts`) under `src/hooks` and `src/helper`.
   * **Routing Layer:** `src/router/index.tsx` contains route definitions, wrapped by `PhotoProvider` and `PhotoRepositoryProvider`.

7. **TypeScript & Type Safety**

   * Shared types live in `src/types/index.ts` (e.g., `Photo`, `FilterCriteria`, `IPhotoRepository`).
   * No use of `any`—all components and hooks are strongly typed.

8. **Panda CSS for Styling**

   * Atomic utility classes generated by Panda CSS.
   * Global resets and base typography in `index.css`.

9. **Lazy Loading & Performance**

   * `<GalleryPage>` and `<PhotoDetailPage>` are dynamically loaded using `React.lazy` and `Suspense` to reduce the initial bundle size.
   * `<LazyImage>` uses an `IntersectionObserver` polyfill in tests and native API in browsers to defer loading offscreen images.

---

## Accessibility

* **Semantic Markup**
  Proper use of `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<button>`, and `<ul>/<li>`.
* **ARIA Attributes**

  * `<nav aria-label="Photo navigation">` for the previous/next buttons.
  * `<button aria-label="Clear Filters">` on filter controls.
  * `<div role="combobox" aria-label="All Categories">` for the category selector.
* **Keyboard Navigation**
  All interactive elements are reachable via Tab; focus states are visible.
* **Color Contrast**
  All text/background combinations meet at least 4.5:1 contrast.
* **Accessible Dialog**
  The Radix `<Dialog>` used in Photo Details provides focus trapping, ARIA roles, and announcements.
* **WCAG 2.1 A Compliance**
  Focus management, visible focus indicators, and semantic labeling ensure basic WCAG compliance.

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
├── main.tsx                      # Entry point (renders <RouterProvider> under Contexts)
├── index.css                     # Global CSS resets & base styles
└── vite.config.ts                # Vite configuration
```

> **Note:** There is no `App.tsx`—`main.tsx` wraps `PhotoProvider` and `PhotoRepositoryProvider` around the router.

---

## Scripts

| Script             | Description                                                                       |
| ------------------ | --------------------------------------------------------------------------------- |
| `npm run dev`      | Starts Vite dev server with HMR at [http://localhost:5173](http://localhost:5173) |
| `npm run build`    | Bundles for production into `dist/`                                               |
| `npm run serve`    | Serves the `dist/` folder locally (if `serve` is installed)                       |
| `npm test`         | Runs Jest in watch mode                                                           |
| `npm run test:ci`  | Runs all tests once and generates a coverage report (≥ 80% coverage)              |
| `npm run lint`     | Runs ESLint to check for linting issues                                           |
| `npm run lint:fix` | Runs ESLint with `--fix` to automatically fix fixable lint errors (if configured) |

---

## Deliverables

1. **Source Code**
   The complete React + TypeScript application resides in this repository.
2. **README.md**
   (This file—contains setup instructions, architectural decisions, and documentation.)
3. **Tests**
   All components, hooks, and services are covered by Jest and React Testing Library, with ≥ 80% coverage (see `coverage/lcov-report/index.html`).
4. **Live Demo**
   [photo-gallery-app](https://photo-gallery-app-mauve.vercel.app/)
5. **Repository Link**
   [https://github.com/mkareshky/photo-gallery-app](https://github.com/mkareshky/photo-gallery-app)

---

## Troubleshooting & Linting

* **Common Issues**

  * If you see CORS errors when fetching from the Picsum API, ensure you have an internet connection and no browser extensions blocking the request.
  * If the date picker doesn’t display as expected, make sure your browser supports `<input type="date" />` in ISO format (`YYYY-MM-DD`).
* **Linting & Formatting**

  * ESLint and Prettier are configured. You can run:

    ```bash
    npm run lint
    # or
    npm run lint:fix
    ```

    to check and automatically fix lint issues (if `lint:fix` is set up in `package.json`).
  * If your IDE or code editor integrates with ESLint/Prettier, enable “Format On Save” to keep the code consistent.

---

## Thank You

Thank you for exploring the Photo Gallery App! Feel free to open an issue or submit a pull request for improvements, bug fixes, or additional features. Good luck and have fun!

