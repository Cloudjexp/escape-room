# Escape Room · The Haunted Castle

An interactive haunted-castle escape room built for English class. Plain HTML, CSS, and JavaScript — no framework, no build step, no Node.js required.

## Project structure

```text
/
├── index.html
├── story.html
├── challenge1.html … challenge5.html
├── final.html
├── css/
│   └── style.css
├── js/
│   ├── app.js         # sound effects, confetti, feedback banners, page bootstrap
│   ├── storage.js     # localStorage persistence
│   ├── progress.js     # progress/timer/navbar state
│   └── challenge1.js … challenge5.js
└── assets/
    ├── images/
    └── sounds/
```

## Running it

There is nothing to install and nothing to build. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with any static file server, e.g. `python3 -m http.server 8080`.

## Deploying to GitHub Pages

Push to `main` — `.github/workflows/pages.yml` publishes the repository as-is, with no build step. You can also enable Pages to deploy straight from the `main` branch in the repository settings, since there is no compiled output to generate.

## Gameplay

Solve five challenges (vocabulary, grammar, reading, logic, and a riddle) to collect five secret codes, then enter them on the final page to open the chest. Progress, the timer, and completed codes are saved automatically in `localStorage`, so players can leave and come back.
