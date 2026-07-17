# Glory Board (scores-app)

Personal Manchester United jumbotron — live match up top, club pulse (transfers/news), upcoming fixtures, recent results, and the Premier League table. Built for one fan, no noise.

## Free APIs (no RapidAPI / no paid plan)

| Source | What it gives you | Cost |
| --- | --- | --- |
| [football-data.org](https://www.football-data.org/) | Live/upcoming/past United matches + PL standings | **Free** token (10 req/min) |
| Google News RSS + The Guardian RSS | Transfer / club headlines (global, works in AU) | **Free**, no key |

The old RapidAPI `api-football` integration is gone.

## Setup

1. Register for a free token:  
   https://www.football-data.org/client/register
2. Copy the env file and paste your token:

```bash
cp .env.example .env
```

```env
FOOTBALL_DATA_TOKEN=your_token_here
```

3. Install and run:

```bash
npm install
npm run dev
```

Vite proxies `/api/fd` → football-data.org and injects your token **server-side** (dev + `npm run preview`). The token is not exposed as a `VITE_` client variable.

## What you’ll see

1. **Jumbotron** — live United match when available, otherwise last result / next kick-off (Sydney time)
2. **Club pulse** — Google News + Guardian headlines (signed / sold / linked first), each with a Read link
3. **Upcoming + results** — next fixtures and recent scorelines
4. **Premier League table** — your row highlighted

While a match is live, the board quietly refreshes every 60 seconds.

## Notes

- Free football-data.org coverage is strongest for major European competitions (PL, etc.).
- Keep `.env` out of git (already in `.gitignore`).
- If the board says the token was rejected, restart the dev server after editing `.env`.
