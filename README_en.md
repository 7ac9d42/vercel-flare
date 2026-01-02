This is an AI-translated version of the Chinese README.

# Vercel-Flare ✨
> Thanks to https://github.com/soulteary/docker-flare for the visual inspiration and data structure. This repository is a pure static, read-only navigation page designed for Vercel or any static hosting — it does not include online editing or a backend.

## Demo
- Live demo: [https://vercel-flare-demo.vercel.app](https://vercel-flare-demo.vercel.app)

## Features
- All data comes from `app/*.yml` and is read during build time to produce a static site
- No backend dependencies and no runtime write operations; commonly used SVG icons are bundled by default (additional icons are fetched during build on demand)
- Mobile layout adapts to a two-column design; empty categories are automatically hidden
- Upgraded Next.js to >=16.0.7 (fixes CVE-2025-66478)

## Directory conventions
- `app/*.yml`: project configuration files
- `frontend/public/icons`: SVG icons fetched on demand during build; please avoid manual additions or removals

## Quick start
1. Before deployment, edit the configuration files in `./app`
2. Follow the deployment instructions below
3. Enjoy using it 😉

## How to customize icons?
Visit https://pictogrammers.com/library/mdi/ to choose icons you like. Add the icon name to the corresponding field in the configuration file — the deployment process will automatically fetch required icons.

## Vercel deployment (recommended)
Automatic deployment:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/7ac9d42/vercel-flare)

Manual deployment:
1. Create your project from this template (private repos are recommended)
2. Prepare configuration (edit the default config files)
   - `apps.yml`: `links` list. `name`/`link` are required; `icon` and `desc` are optional
   - `bookmarks.yml`: `categories` (with `id` and `title`), `links` (with `name` and `link`; `icon` and `category` are optional)
   - `config.yml`: site title, description, whether to show the clock, open links in new tabs, footer toggle and copy
3. In Vercel select your project (the build process is pre-configured; just start the build)

The repository root `vercel.json` provides the default build flow:
```
buildCommand: "cd frontend && npm install && npm run build"
outputDirectory: "frontend/out"
```
Pushes trigger automatic rebuilds. For custom environment variables or domains, configure them in the Vercel dashboard.

## Local deployment
1) Install dependencies
```bash
cd frontend
npm install
```
2) Prepare configuration (edit the default config files)
   - `apps.yml`: `links` list. `name`/`link` are required; `icon` and `desc` are optional
   - `bookmarks.yml`: `categories` (with `id` and `title`), `links` (with `name` and `link`; `icon` and `category` are optional)
   - `config.yml`: site title, description, whether to show the clock, open links in new tabs, footer toggle and copy
3) Local development
```bash
cd frontend
npm run dev   # http://localhost:3000 — reads YAML files under ../app in real time
```
4) Production build and static preview
```bash
cd frontend
npm run lint
npm run build    # automatically downloads icons referenced in YAML to frontend/public/icons
npm run start    # serves frontend/out, default port 5005
```
The `frontend/out` directory can be uploaded to any static hosting.

## License
This project is released under the MIT License. See `LICENSE` for details.
