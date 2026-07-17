# Glory Board (scores-app)

Personal Manchester United jumbotron — live match up top, club pulse (transfers/news), upcoming fixtures, recent results, and the Premier League table.

## Runtime

- **Node.js 24.x** (required — Vercel discontinued 18.x)
- Pinned via `package.json` `engines` + `.nvmrc`

## Free APIs

| Source | What it gives you | Cost |
| --- | --- | --- |
| [football-data.org](https://www.football-data.org/) | Fixtures, live/next/past, PL table, referees | **Free** token |
| [TheSportsDB](https://www.thesportsdb.com/) | Match centre: timeline, stats, lineups, highlights | **Free** (key `123`) |
| Google News RSS + The Guardian RSS | Transfer / club headlines | **Free**, no key |

> football-data **free** does **not** include goals/lineups/stats — Match Centre enriches from TheSportsDB.

## Setup

1. Register: https://www.football-data.org/client/register  
2. Copy env and paste token:

```bash
cp .env.example .env
```

```env
FOOTBALL_DATA_TOKEN=your_token_here
```

3. Use Node 24, install, run:

```bash
nvm use   # or ensure node -v is v24.x
npm install
npm run dev
```

Locally, Vite proxies `/api/*`. On Vercel, serverless functions under `api/` do the same — set `FOOTBALL_DATA_TOKEN` in Project → Environment Variables, and set **Node.js Version to 24.x** in Project Settings if the dashboard still shows 18.x.

## Stack

- React 19 + Vite 8
- Tailwind CSS 4 (`@tailwindcss/vite`)
- ESLint 9 flat config
