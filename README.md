# Photo Gallery App

A responsive, accessible, and test-driven photo gallery application built with React, TypeScript, and Vite. The app fetches photos from a public REST API, displays them in a paginated/infinite-scroll gallery, and allows users to click on any photo to see its full-size version along with metadata. Accessibility best practices (WCAG 2.1 A) are applied throughout, and the codebase is architected following SOLID principles.

---


> **Note:** In this demo, the `categories` array is populated by picking two random entries from `categoriesPool`. As a result, a photo’s assigned categories are purely illustrative and do not necessarily correspond to the actual content of the image.


## Live Demo

Check out the deployed version here:  
[https://photo-gallery-app-mauve.vercel.app/](./src/assets/guide.gif)

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
  * Displays photo thumbnails in a responsive, mobile-first grid.
  * Implements infinite scroll (or pagination) to load more photos as the user scrolls.
  * Shows basic metadata (title, author, upload date) with each thumbnail.

* **Photo Details Page**
  * Clicking on a thumbnail navigates to a detail view (React Router).
  * Displays the full-size image plus extended metadata (title, author, date, description).
  * “Next” / “Previous” navigation buttons to cycle through photos without going back to the gallery.

* **Search & Filter**
  * Text-based search (by title or author).
  * Filter dropdowns (e.g., by upload date range or category).
  * Clear search and filter controls.

* **Responsive Design**
  * Mobile-first CSS layout, works on phones, tablets, and desktops.
  * Layout adapts from a single-column list on narrow screens to a multi-column grid on wider screens.

* **Error Handling & Loading States**
  * Graceful UI when the API call fails (error message and retry).
  * Skeleton loaders or spinner indicators while fetching.

* **Testing**
  * Jest & React Testing Library for unit and integration tests.
  * Test coverage target: ≥ 90%.
  * Mocks for REST API calls.

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
  * Custom React Hooks (`usePhotos`, `useDebounce`, etc.)

* **Routing**
  * React Router

* **Styling**
  * Panda CSS (utility-first, atomic-style approach)
  * Global resets & base styles in `index.css`

* **Component Primitives**
  * Radix UI

* **Testing**
  * Jest
  * React Testing Library
  * `@testing-library/jest-dom`
  * Mocks for file imports and styling modules (see `__mocks__`)

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

After building, you can serve the `dist/` folder locally with a simple static server. For example:

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

* Runs tests a single time, outputs pass/fail summary.
* Generates a coverage report (typically in `coverage/lcov-report/index.html`).
* Coverage threshold is set to 80%. You can open the HTML report in your browser to inspect uncovered lines.

---

## Architectural Decisions & Patterns

1. **SOLID Principles**
   This project follows SOLID principles—each component or module has a single responsibility, and higher-level components depend on abstractions (hooks and context) rather than concrete implementations. For a deeper dive into each principle and how they’re applied here, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

2. **Repository Pattern & Data Layer**

   * The `usePhotos.ts` hook encapsulates all REST API calls (fetching pages, applying filters).
   * Helper functions (`addMetadataToPhotos.ts`, `generateRandomDate.ts`) isolate data transformations—including the mock-data logic that generates titles, dates, and categories.
   * `PhotoContext.tsx` provides a global store for photo data, caching, and pagination state.

3. **Custom Hooks**

   * `usePhotos` manages data fetching, pagination, caching, and error/loading states.
   * `useDebounce` handles debouncing of search/filter inputs to prevent excessive API calls.

4. **Compound Components & Radix UI**

   * In the `ui` folder, atomic UI pieces (e.g., `<CategorySelect>`, `<FilterPanel>`) can be composed in parent components.
   * Radix primitives (Dialog, Select, Toast, etc.) ensure accessible dropdowns, modals, and notifications.

5. **Separation of Concerns**

   * **UI Layer**: Presentational components (`PhotoCard`, `CategorySelect`, `FilterPanel`) live under `src/components` or `src/components/ui`.
   * **Business Logic / Data Layer**: Hooks (`src/hooks/usePhotos.ts`) and helper functions (`src/helper/*.ts`) manage API calls, data transformations, and state.
   * **Routing Layer**: `src/router/index.tsx` contains route definitions and layout-level boundaries (e.g., a common `<Layout>` with header/navigation).

6. **TypeScript & Type Safety**

   * Shared types live in `src/types/index.ts` (e.g., `Photo`, `PhotoMetadata`, `FilterOptions`).
   * All components and hooks are strongly typed—no use of `any`.

7. **Panda CSS for Styling**

   * Utility-first, atomic CSS classes auto-generated by Panda.
   * Global styles (resets, fonts) in `index.css`.
   * Component-level styles are applied via Panda’s atomic class names (no separate `.css` modules).

8. **Routing & Lazy Loading**

   * React Router v6’s `createBrowserRouter` is used.
   * Code-splitting with `React.lazy` and `Suspense` for page components (`GalleryPage`, `PhotoDetailPage`) to minimize the initial bundle size.

---

## Accessibility

We have implemented several accessibility features to comply with WCAG 2.1 A:

* **Semantic HTML**
  Proper use of `<header>`, `<main>`, `<section>`, `<nav>`, `<ul>`, `<li>`, `<button>`, `<dialog>`, etc.

* **ARIA Attributes & Roles**
  Where necessary (e.g., `<button aria-label="Close dialog">`).

* **Keyboard Navigation**
  All interactive elements (buttons, links, form inputs) are reachable by Tab.
  Visible focus indicators for keyboard users.

* **Color Contrast**
  All text/background combinations ensure a minimum contrast ratio of 4.5:1.

* **Accessible Dialog for Photo Details**
  The `<Dialog>` component from Radix UI is used to provide focus trapping, ARIA roles, and screen-reader announcements.

---

## Folder Layout

```
src/
├── __mocks__/               # Mocks for Jest (images, CSS modules, styled-system)
├── assets/                  # Raw images/icons or SVGs
├── components/              # Reusable UI components
│   ├── ui/                  # Lower-level, atomic UI primitives
│   └── PhotoCard.tsx
├── context/                 # React Context (PhotoContext) for global state
├── helper/                  # Pure helper functions (data transformations, date utilities)
├── hooks/                   # Custom React hooks (data fetching, debounce)
├── pages/                   # Route-level pages (GalleryPage, PhotoDetailPage)
├── router/                  # React Router configuration (createBrowserRouter)
├── types/                   # TypeScript interfaces/types
├── App.tsx                  # Root component (wraps Context + Router)
├── main.tsx                 # Entry point (renders <App /> to #root)
└── index.css                # Global CSS resets & base styles
```

---

## Scripts

* `npm run dev` (or `yarn dev`): Starts the Vite dev server with hot module replacement.
* `npm run build` (or `yarn build`): Bundles the app for production into the `dist/` folder.
* `npm test`: Runs Jest in watch mode for continuous testing.
* `npm run test:ci` (or `yarn test:ci`): Runs tests once, outputs results, and generates a coverage report.

---

**Thank you for trying out the Photo Gallery App!** If you encounter any issues or have ideas for improvements, please open an issue or submit a pull request.
