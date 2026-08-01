## Project

This is a plain HTML/CSS/JavaScript static site — no framework, no build step, no Node.js dependency at runtime.

- Pages: `index.html`, `story.html`, `challenge1.html`–`challenge5.html`, `final.html` (all at the repo root, linked with plain relative `href`s).
- Styles: `css/style.css`.
- Scripts: `js/storage.js` (localStorage persistence), `js/progress.js` (progress/timer/nav state), `js/app.js` (sound effects, confetti, feedback banners, page bootstrap), `js/challenge1.js`–`js/challenge5.js` (per-challenge puzzle logic).
- Assets: `assets/images/`, `assets/sounds/`.

## Development

There is no build step. Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```
python3 -m http.server 8080
```

## Deployment

GitHub Pages deploys the repository as-is via `.github/workflows/pages.yml` — no build/install step is required.
