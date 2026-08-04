# RYMCU BigSmart Docs Site

This directory contains the Nuxt UI documentation site for `BigSmart-Open`.

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

For the GitHub Pages project site, build with the repository base path:

```bash
pnpm build:pages
```

This wraps `NUXT_APP_BASE_URL=/BigSmart-Open/ nuxt build --preset github_pages` so it works on any shell. Preview the generated GitHub Pages artifact locally with the same repository base path:

```bash
pnpm preview:pages
```

Then open `http://127.0.0.1:4173/BigSmart-Open/zh`.

The GitHub Actions workflow in `.github/workflows/pages.yml` deploys `site/.output/public` to GitHub Pages on pushes to `main`.

## Content Layout

- `content/1.zh/` - Chinese documentation
- `content/2.en/` - English documentation
- `public/images/` - images used by the generated site

Large firmware binaries and desktop tools stay outside the generated Pages artifact. Link to the repository raw files or GitHub Releases instead of copying them into `public/`.
