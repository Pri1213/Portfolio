# Priyasnee Boolaky — Portfolio

Dark, data-driven 3D portfolio. F1 telemetry dashboard meets data engineering war room.
Live at **priyashnee.netlify.app**.

## Stack

- **React 18 + Vite** — app framework
- **React Three Fiber + Three.js** — hero 3D scene (data-node constellation, grid plane, speed lines)
- **Framer Motion** — scroll animations, boot sequence, achievement toasts
- **Tailwind CSS** — styling, custom design tokens
- **Recharts** — championship progression chart
- **Netlify Functions** — serverless API layer for live F1 data (Jolpica API, the maintained Ergast successor), with in-memory caching

## Quick start

```bash
npm install
npm run dev          # Vite dev server (the /api/* F1 endpoints won't work here — see below)
```

To run **with** the serverless functions locally:

```bash
npm install -g netlify-cli
netlify dev          # serves the site AND /api/* functions together
```

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git** → pick the repo.
3. Build settings are auto-detected from `netlify.toml` (build: `npm run build`, publish: `dist`, functions: `netlify/functions`). Just hit deploy.
4. Point it at the existing `priyashnee` site name to keep the domain.

That's it — `/api/*` automatically routes to the functions, and the SPA redirect is already configured.

## Before you ship — your TODO list

- [x] **CV** is already in place at `public/cv/Priyasnee_Boolaky_CV.pdf`.
- [x] **F1 picks** set: Verstappen & Antonelli — edit anytime in `src/components/f1/PriyasneePicks.jsx`.
- [x] **DJ page** written — setlist + commit-history mix notes in `src/components/dj/DJPage.jsx`.
- [ ] **OG image**: add a 1200×630 `public/og-image.png` for link previews (a screenshot of the hero works great).
- [ ] Optionally tweak team colours for new seasons in `src/components/f1/teamColours.js`.

## Architecture notes

```
Browser ──> /api/f1-*  ──> Netlify Function ──> Jolpica F1 API
                              │
                              └── in-memory cache (warm invocations)
                                  + Cache-Control headers (CDN/browser)
```

- `f1-standings.js` — driver/constructor standings (`?type=drivers|constructors`)
- `f1-schedule.js` — season calendar (feeds the countdown)
- `f1-results.js` — last race results, DNFs, fastest lap
- `f1-progression.js` — fetches **all** season results in one upstream call and computes cumulative points per round for the top 5 server-side (cheaper than a round-by-round fan-out)

## Performance & accessibility

- Three.js is **lazy-loaded** and split into its own chunk — it never blocks first paint.
- Mobile gets a CSS gradient hero instead of the 3D canvas.
- `prefers-reduced-motion` is respected everywhere: boot sequence skipped, counters jump to final values, visualizer renders a static frame.
- All interactive elements are keyboard navigable with visible focus rings.
- F1 panels show loading skeletons and graceful error states ("the pit wall is on it").

## Project structure

```
src/
├── components/
│   ├── layout/        Navbar (scroll progress bar), Footer
│   ├── sections/      Hero, About, Skills, Experience, Projects, Education, Contact
│   ├── f1/            Dashboard panels + team colours
│   ├── dj/            Off the Clock page + canvas visualizer
│   ├── three/         HeroScene, DataParticles, SpeedLines
│   └── ui/            BootSequence, Achievements, SectionHeading
├── hooks/             useCountUp, useF1Data, useIsMobile
└── pages/             Home, F1, DJ
netlify/functions/     f1-standings, f1-schedule, f1-results, f1-progression
```

## Spotify integration (DJ page — live "Now Playing")

The DJ page can show your real Spotify activity: currently playing track (with a live progress bar), last played, and your top 5 tracks from the last 4 weeks. The panel **hides itself automatically** until configured, so nothing breaks if you skip this.

### One-time setup

1. In the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard), open your app and add this Redirect URI:
   ```
   http://127.0.0.1:8888/callback
   ```
2. Mint a refresh token locally (your client secret never leaves your machine):
   ```bash
   SPOTIFY_CLIENT_ID=3e0a5913ad80415383daf0d33c9bfb1f \
   SPOTIFY_CLIENT_SECRET=your_secret_here \
   node scripts/get-refresh-token.js
   ```
   Open the printed URL, approve, and copy the refresh token from the terminal.
3. In Netlify → Site settings → Environment variables, add:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
4. Redeploy. Done — the panel appears on `/dj`.

### How it works

```
Browser ──> /api/spotify ──> Netlify Function
                               ├─ refreshes access token (cached across warm invocations)
                               ├─ currently-playing + recently-played + top-tracks (parallel)
                               └─ 30s payload cache (a burst of visitors = one Spotify call)
```

⚠️ The client ID is public by design. The **client secret and refresh token are not** — they live only in Netlify env vars. Never commit them or put them in frontend code.

## New features (round 3)

- **EN/FR language toggle** in the navbar — full French translation of the narrative sections (hero, about, headings, contact, quiz). Defaults to the visitor's browser language, remembers their choice. The F1 dashboard stays in English — telemetry is its own language. Edit all strings in `src/i18n.jsx`.
- **The Paddock Quiz** — a 5-question "how well do you know the driver?" game on the home page (before Contact). Each answer reveals a recruiter-friendly fun fact (the £600K find, Bobby, the black belt, bilingualism, the F1 obsession), with an F1-style final classification from P1 to pit lane start. Fully bilingual. Edit questions in `src/i18n.jsx` under `quiz`.
- **Bobby** 🐾 — paw button in the bottom-left corner. Click it and a hand-drawn SVG dachshund trots across the screen, tail wagging, with a "woof. (translation: hire her)" bubble. Respects reduced motion (woof only, no run). He also features in the quiz and has a track on the DJ setlist.
- **Karate black belt** now stated on the DJ setlist and in the quiz.

## Max Title Simulator (F1 page)

A live Monte Carlo widget: pulls Verstappen's real points/position and the remaining race count from the live APIs, then simulates 5,000 seasons client-side (form-weighted points distributions, 8% DNF chance) to produce a title probability, the points-per-race he needs, and a histogram of simulated final totals. Verdicts get progressively less serious as the probability drops, ending at the sim-racing-vlogger timeline. A live mood card reflects his actual championship position, and the **Pet Bobby** button adds +0.5% pace morale per pet (capped at +12%) — which genuinely re-runs the simulation. Pet count persists in localStorage. Methodology disclosed in the footer; Bobby coefficient not peer-reviewed.

## Design system v2 — F1 broadcast graphics

- **Type**: Saira Condensed (heavy italic uppercase display — the lean of a car under braking), Titillium Web body (the typeface F1.com used for years), Roboto Mono for timing data.
- **Official F1 red** `#E10600` for live elements; CV blue stays primary.
- **Surfaces**: chamfered timing-tower chips (clip-path corner cuts) instead of rounded cards, with a red→blue sector rail that slides in on hover and a racing-line light sweep.
- **Details**: broadcast lower-third section headings with skewed red/blue racing bars, timing-tower position boxes in the driver standings, a checkered finish-line divider above the footer, DRS-style pulsing live chips, chamfered "race chip" buttons.
- **Motion**: one easing curve everywhere — `cubic-bezier(0.16,1,0.3,1)` — and a race-start boot sequence: five red lights illuminate one by one, hold a randomised beat (just like the real start procedure), then lights out into the page.
