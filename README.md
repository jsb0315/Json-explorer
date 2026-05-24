# Explorer UI

Reusable React + TypeScript component library for MongoDB-style data exploration UIs.

## What is included

- `DataExplorer` main container
- `ExplorerList`
- `ExplorerItem`
- `ExplorerHeader`
- `ExplorerSearch`
- `ExplorerEmptyState`
- `ExplorerLoadingState`

## Design goals

- Importable as a library from external projects
- Stateless by default and easy to wire to realtime sources
- Tailwind-based styling with minimal runtime helpers
- Optional socket-oriented integration surface via types only

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The library entry is exported from `src/index.ts`, and the package exposes the built module plus `styles.css` for consumers that need the bundled Tailwind output.

## Realtime usage pattern

Feed new records into the `items` prop from your socket layer. The explorer stays agnostic about the transport and only reacts to the array you pass in.
