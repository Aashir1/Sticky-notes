# Sticky Notes

A drag-and-drop sticky notes board built with React, TypeScript, and Vite. Notes can be created, edited, moved, resized, and deleted, with everything persisted to the browser's localStorage so your board survives a page reload.

## Approach

The app keeps everything client-side with no backend: a `useNotes` hook owns all note data and persists it through a small generic `useLocalStorage` hook, so every component just calls simple actions like "add," "move," or "delete" without knowing anything about storage. For things that change quickly — typing, dragging, resizing — each note keeps its own local value for instant visual feedback, and only syncs that value up to shared storage after it settles for a moment, to avoid saving on every keystroke or pixel of movement.

## Assumptions

- A single user on a single browser/device is assumed — notes are stored in that browser's localStorage, not synced anywhere else.
- Deleting a note is done by dragging it onto the trash zone; there's no separate delete button.
- The "Add note" dialog collects a starting position and size; note text is then typed directly into the note after it's created.
- A note can't be resized smaller than 160×140px, to keep it usable.
- Changes made while typing/dragging/resizing are saved roughly 300ms after you stop, rather than on every single keystroke or pointer movement.

## Prerequisites

- Node.js

## Getting started

Install dependencies, then start the dev server:

```bash
npm install && npm run dev

# or
yarn install && yarn dev

# or
pnpm install && pnpm dev
```

Other scripts:

```bash
npm run build    # or: yarn build / pnpm build   — type-check and build for production
npm run preview  # or: yarn preview / pnpm preview — preview the production build locally
npm run lint     # or: yarn lint / pnpm lint       — run ESLint
```
