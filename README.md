# vite-plugin-deploy-copy

A Vite plugin to safely copy build artifacts to a deployment directory.  
Typically used when your frontend project is part of a larger monorepo or backend framework (e.g., Laravel, Rails, Django) and needs to deploy built assets to a public directory outside the Vite root.

## Features

- 🚀 **Type-Safe**: Full TypeScript support.
- 🛡️ **Safe Copy**: Checks if source exists and safely cleans destination before copying.
- ♻️ **Preserve Files**: Option to preserve specific files/folders in the destination directory (e.g., `.git`, `.gitignore`).
- ⚡ **Build Hook**: Runs automatically on `closeBundle` (after build completes).

## Installation

```bash
npm install vite-plugin-deploy-copy --save-dev
# or
yarn add vite-plugin-deploy-copy -D
# or
pnpm add vite-plugin-deploy-copy -D
```

## Usage

Register the plugin in your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import deployCopy from 'vite-plugin-deploy-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    deployCopy({
      targets: [
        {
          // Source directory (usually your 'dist' folder)
          src: 'dist', 
          // Destination directory
          dest: '../public/assets', 
          // Optional: Files/Folders to preserve in destination
          preserve: ['.gitkeep', 'logo.png'] 
        }
      ]
    })
  ]
});
```

## Configuration

### `PluginOptions`

| Option | Type | Description |
|Path | Type | Description |
|---|---|---|
| `targets` | `Target[]` | Array of copy targets. |

### `Target` Interface

| Property | Type | Default | Description |
|---|---|---|---|
| `src` | `string` | **Required** | Source directory path (relative to `process.cwd()` or absolute). |
| `dest` | `string` | **Required** | Destination directory path (relative to `process.cwd()` or absolute). |
| `preserve` | `string[]` | `[]` | List of filenames/folders in `dest` to preserve during cleanup. |

## License

MIT
