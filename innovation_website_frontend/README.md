# Innovation Website Frontend (Mock JSON)

A frontend-only React app for showcasing and tracking innovations using JSON mock data (no backend required). Built with a modern **Ocean Professional** theme (blue + amber), responsive layout, and accessibility-minded components.

## Features

- Header with navigation (Home, Favorites)
- Home page:
  - Innovations grid
  - Search across title/description/owner/tags
  - Filters (status, category)
  - Sorting (last updated, title)
- Innovation detail view in an accessible modal
- Create/Edit innovation via modal form
- Local persistence:
  - Innovations and favorites stored in `localStorage`
  - Initial seed comes from JSON under `/public/mock/innovations.json`
- Favorites shortlist stored in `localStorage`
- Responsive design + reduced-motion support

## Getting Started

From this directory:

```bash
npm start
```

Open http://localhost:3000

## Mock Data

### Seed file

The app loads initial innovations from:

- `public/mock/innovations.json`

On first successful load, it caches the innovations into `localStorage`. After that, local edits persist across refresh.

### Resetting data

To reset to the original seed:

1. Open DevTools → Application → Local Storage
2. Remove keys:
   - `innovation_showcase__innovations`
   - `innovation_showcase__favorites`
3. Refresh the page

### Optional environment variable

- `REACT_APP_API_BASE` (optional):
  - If set, the app fetches mock data from `${REACT_APP_API_BASE}/mock/innovations.json`
  - Otherwise it defaults to `/mock/innovations.json` (local public asset)

Example:

```bash
REACT_APP_API_BASE=https://example-cdn.com npm start
```

## Scripts

- `npm start` - dev server
- `npm test` - tests
- `npm run build` - production build
"""
