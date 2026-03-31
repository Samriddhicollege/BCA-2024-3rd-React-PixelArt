# Pixel Studio

A modern pixel art editor built with React + Vite.

Pixel Studio lets you draw on high-resolution grids, manage multiple layers, save artwork in local storage, and export creations as PNG files. The app includes a landing experience, a full editor workspace, and a gallery with built-in sample artworks.

## Features

- Multi-tool editor: brush, eraser (size control), and flood fill
- Adjustable canvas dimensions from 1x1 up to 256x256
- Multi-layer workflow:
	- Add/delete layers
	- Rename layers
	- Toggle layer visibility
	- Select active layer for editing
- Undo/redo history support
- Save artwork with title metadata
- Autosafe persistence using browser local storage
- Gallery view to load, delete, and export artwork
- PNG export with layer compositing
- Seed/sample artworks included
- Keyboard shortcuts:
	- Ctrl/Cmd + Z: Undo
	- Ctrl/Cmd + Shift + Z: Redo
	- Ctrl/Cmd + Y: Redo
	- Ctrl/Cmd + S: Save

## Performance Notes

This project is optimized for high-resolution drawing.

- During stroke operations, pixel updates are applied using direct DOM mutation and refs to avoid expensive React re-renders per cell.
- React state is synchronized after stroke completion to keep undo/redo and saved data consistent.
- Canvas cells are memoized with `React.memo` to reduce unnecessary reconciliation.

This approach keeps drawing responsive even on large grids.

## Tech Stack

- React 19
- Vite 8
- React Router
- Framer Motion
- React Toastify
- React Icons
- ESLint 9

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Install

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Lint

```bash
pnpm lint
```

## Project Structure

```text
src/
	components/
		features/
			Canvas.jsx
			ColorPalette.jsx
			LayerPanel.jsx
			SavedGallery.jsx
			SaveModal.jsx
			Toolbar.jsx
		layout/
			Drawer.jsx
		ui/
			Button.jsx
			Card.jsx
			Input.jsx
			PixelSprite.jsx
	hooks/
		useLocalStorage.js
	pages/
		LandingPage.jsx
		EditorPage.jsx
		GalleryPage.jsx
	utils/
		helpers.js
		seedData.js
	App.jsx
	main.jsx
	index.css
```

## App Routes

- `/` - Landing page
- `/editor` - New artwork editor
- `/editor/:id` - Edit an existing artwork
- `/gallery` - Saved and seed artwork gallery

## Data Model

Artworks are stored in local storage under `pixel-arts`.

Typical saved object shape:

```json
{
	"id": "string",
	"title": "My Artwork",
	"width": 32,
	"height": 32,
	"layers": [
		{
			"id": "layer-id",
			"name": "Layer 1",
			"isVisible": true,
			"grid": [["#3b82f6", "transparent"]]
		}
	],
	"createdAt": "ISO date",
	"updatedAt": "ISO date"
}
```

## Usage Flow

1. Open the editor from the landing page.
2. Choose tool and color.
3. Resize canvas if needed.
4. Draw and manage layers.
5. Save artwork with a title.
6. Open gallery to reload, export, or delete saved items.

## Notes

- Seed artworks are included for demonstration and cannot be deleted.
- All data is browser-local; clearing local storage removes saved works.

## License

This project currently has no explicit license file. Add a `LICENSE` file if you plan to distribute it publicly.
