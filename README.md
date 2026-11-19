# Seedling

The prototype of a time management and energy tracking app to help students, young adults, and those who struggle with mental health to gain a better grasp of their energy and time to better accomplish and manage their responsibilities and tasks.

**Live prototype:** https://y1ji3.github.io/seedling/

This repository is a clickable **React + Tailwind** prototype of the Seedling wireframes, made from the Figma file ([Prototype Wireframe → Iteration 2](https://www.figma.com/design/Er0LyA9msoFgsUYBRNd5ot/Prototype-Wireframe?node-id=139-671)). It runs in a "presentation mode": a black background with the app shown inside a phone frame, so the flows can be demoed and later moved into a real app.

## Getting started

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload      |
| `npm run build`   | Type-check and build to `dist/`           |
| `npm run preview` | Serve the production build locally        |

## Deployment

The site is published to GitHub Pages by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Every push to `main` builds the app and publishes `dist/`, so build output is never committed. The workflow can also be run manually from the **Actions** tab.

- **One-time setup:** in the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
- **Base path:** Pages serves the site from `/seedling/`, so `vite.config.ts` sets `base: '/seedling/'` for builds and `npm run preview` (open http://localhost:4173/seedling/). The dev server still runs at `/`. If the repo is renamed, update `base` to match.

## Using the prototype

- Click through it like the real app. It starts at **Login**.
- The **☰ menu** opens a side menu with Home, Tasks, Calendar, Journal, shortcuts to create items, and **Log out**.
- **Keyboard shortcuts:** `←` goes back, `R` restarts at Login, and `Esc` closes the menu.
- **Deep links:** open any screen directly with a URL hash, e.g. `/#calendar`.

| Screen            | Hash            | Screen             | Hash            |
| ----------------- | --------------- | ------------------ | --------------- |
| Login             | `#login`        | Event Details      | `#eventDetails` |
| Sign Up           | `#signup`       | Edit Event         | `#editEvent`    |
| Reset Password    | `#reset`        | Journal            | `#journal`      |
| Home              | `#home`         | Entry Details      | `#entryDetails` |
| Task Lists        | `#tasks`        | Edit Entry         | `#editEntry`    |
| Task Details      | `#taskDetails`  | New Task           | `#newTask`      |
| Edit Task         | `#editTask`     | New Event          | `#newEvent`     |
| Calendar          | `#calendar`     | New Journal Entry  | `#newJournal`   |
| Created (confirm) | `#created`      | Saved (confirm)    | `#saved`        |

Leaving an edit screen with ✕ or back opens the **"You have unsaved changes"** dialog. Fields can be typed in, tasks can be checked off, and sprouts can be tapped to set a rating. No data is saved; this is a front-end prototype only.

## Project structure

```
src/
├── App.tsx                 # Screen registry, navigation history, keyboard shortcuts
├── nav.tsx                 # Screen IDs and the navigation context (go / back / reset / openMenu)
├── index.css               # Design tokens: colours, type scale, safe areas, animations
├── components/
│   ├── PhoneFrame.tsx      # Black presentation stage, phone body, status bar, camera, home bar
│   ├── SideMenu.tsx        # Slide-in navigation menu with Log out
│   └── ui.tsx              # Shared UI: Screen layout, headers, buttons, fields, rows, dialog…
├── screens/
│   ├── auth.tsx            # Login, Sign Up, Reset Password
│   ├── home.tsx            # Home dashboard
│   ├── details.tsx         # Tasks, Calendar, Journal and their detail / edit screens
│   └── create.tsx          # New Task / Event / Journal Entry, and the confirmation screens
└── assets/                 # Icons exported from Figma
```

To add a screen, create a component in `src/screens/`, add its ID to `ScreenId` and `SCREEN_NAMES` in `nav.tsx`, and register it in `SCREENS` in `App.tsx`. Move between screens with `useNav().go('screenId')`.

## Design system

All tokens live in `src/index.css` and are used as Tailwind classes.

- **Colours:** `olive` (#657220) for primary actions, `rust` (#BB6528) for the add (+) button, plus `ink`, `muted`, `line`, `card` and `canvas` neutrals.
- **Type scale:** `text-display`, `text-title`, `text-section`, `text-body`, `text-label`, `text-caption`.
- **Spacing:** a 4/8 px scale with a 20 px screen margin. `safe-top` (54 px) and `safe-bottom` (34 px) keep content clear of the camera and home indicator.
- **Font:** the Figma design uses PTL Spekta, which isn't licensed for the web, so [Figtree](https://fonts.google.com/specimen/Figtree) is used instead. To change it, edit `--font-sans`.

## Notes

- Screen sizes match the Figma frames (402 × 874, iPhone 16 Pro). The phone frame scales down to fit smaller windows.
- Navigation between screens was inferred from the wireframes, since the Figma file had no prototype links. Each link is a single `go('…')` call, so they're easy to change.
- Built with React 18, TypeScript, Vite 6 and Tailwind CSS 4.
