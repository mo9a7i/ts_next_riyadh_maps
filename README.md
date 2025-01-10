# Riyadh Metro Map

An interactive web map showing Riyadh's metro system and city districts using React, Next.js, and Leaflet.

## Features

- Interactive map layers:
  - City Districts with dynamic colors
  - Metro Lines with color-coded routes
  - Metro Stations with line-based coloring
- Layer controls:
  - Toggle individual layers
  - Toggle specific metro lines
  - Indeterminate state for partial line selection
- District features:
  - Unique color per district (hash-based)
  - Hover effects with increased opacity
  - Popup with district names

## Technical Stack

- Next.js
- React
- Leaflet
- TypeScript
- @tmcw/togeojson for KML parsing

## Project Structure

```bash
src/
├── components/
│   └── RiyadhMap.tsx    # Main map component
├── config/
│   └── mapLayers.ts     # Map layer configurations
├── types/
│   └── map.ts          # TypeScript interfaces
└── app/
    └── page.tsx        # Next.js page component
```

## Data Sources

- KML files from ArcGIS exports:
  - City districts
  - Metro lines
  - Metro stations

## Setup

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## Configuration

Map layers and styles can be configured in `src/config/mapLayers.ts`:

```typescript
export const kmlFiles: MapLayer[] = [
  {
    url: "...",
    name: "City Districts",
    // ...configuration
  }
];
```

Metro line colors and names are defined in `initialMetroLines`.

## Deployment

The project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on push to main branch
2. Builds the project using Next.js static export
3. Deploys to GitHub Pages

To deploy manually:

```bash
# Build for production
pnpm build

# The static files will be in the 'out' directory
```

View the live deployment at: https://[your-username].github.io/riyadh-metro-map
