import {
  TEAM,
  LEAGUE,
  LIVE_STATUSES,
  UPCOMING_STATUSES,
  FINISHED_STATUSES,
} from "../config";

const FD = "/api/fd";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function windowAroundToday({ daysBack = 90, daysAhead = 90 } = {}) {
  const from = new Date();
  from.setDate(from.getDate() - daysBack);
  const to = new Date();
  to.setDate(to.getDate() + daysAhead);
  return { dateFrom: isoDate(from), dateTo: isoDate(to) };
}

async function fdGet(path) {
  const res = await fetch(`${FD}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`football-data ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

/** One request for live / next / past — stays within free-tier rate limits. */
export async function fetchUnitedMatches() {
  const { dateFrom, dateTo } = windowAroundToday();
  const data = await fdGet(
    `/teams/${TEAM.id}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  const matches = data.matches || [];

  const live = matches.filter((m) => LIVE_STATUSES.has(m.status));
  const upcoming = matches
    .filter((m) => UPCOMING_STATUSES.has(m.status))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  const recent = matches
    .filter((m) => FINISHED_STATUSES.has(m.status))
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

  return {
    live: live[0] || null,
    last: recent[0] || null,
    upcoming: upcoming.slice(0, 6),
    recent: recent.slice(0, 6),
  };
}

export async function fetchPremierLeagueTable() {
  const data = await fdGet(`/competitions/${LEAGUE.code}/standings`);
  const total = (data.standings || []).find((s) => s.type === "TOTAL");
  return total?.table || [];
}

function decodeXml(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function tag(xml, name) {
  const re = new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i");
  const m = xml.match(re);
  return m ? decodeXml(m[1].trim()) : "";
}

const TRANSFER_HINT =
  /\b(transfer|signs?|signed|joins?|joined|loan|deal|contract|depart|leaves?|left|bid|fee|unveiled)\b/i;

/** Free BBC Sport Man Utd RSS — no key. Surfaced as board “pulse”. */
export async function fetchUnitedPulse(limit = 8) {
  const res = await fetch("/api/united-news");
  if (!res.ok) throw new Error(`BBC RSS ${res.status}`);
  const xml = await res.text();
  const chunks = xml.split(/<item[\s>]/i).slice(1);

  const items = chunks.map((chunk) => {
    const title = tag(chunk, "title");
    const link = tag(chunk, "link");
    const pubDate = tag(chunk, "pubDate");
    const description = tag(chunk, "description").replace(/<[^>]+>/g, "");
    return {
      title,
      link,
      pubDate,
      description,
      isTransfer: TRANSFER_HINT.test(`${title} ${description}`),
    };
  });

  // Transfer chatter first, then newest headlines — what a fan checks between matches.
  return items
    .filter((i) => i.title)
    .sort((a, b) => Number(b.isTransfer) - Number(a.isTransfer))
    .slice(0, limit);
}
