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

/** Single-match sheet for the detail drawer (FotMob-style). */
export async function fetchMatchDetail(matchId) {
  // Unfold headers ask for events/XI when the free token allows them.
  const res = await fetch(`${FD}/matches/${matchId}`, {
    headers: {
      "X-Unfold-Goals": "true",
      "X-Unfold-Bookings": "true",
      "X-Unfold-Subs": "true",
      "X-Unfold-Lineups": "true",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`football-data ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

function decodeXml(text) {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function tag(xml, name) {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i");
  const m = xml.match(re);
  return m ? decodeXml(m[1].trim()) : "";
}

function stripHtml(html) {
  return decodeXml(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRssItems(xml) {
  return xml
    .split(/<item[\s>]/i)
    .slice(1)
    .map((chunk) => {
      const rawTitle = tag(chunk, "title");
      const link = tag(chunk, "link");
      const pubDate = tag(chunk, "pubDate") || tag(chunk, "dc:date");
      const description = stripHtml(tag(chunk, "description"));
      const sourceTag = tag(chunk, "source");
      return { rawTitle, link, pubDate, description, sourceTag };
    })
    .filter((i) => i.rawTitle && i.link);
}

/** Google titles look like: "United sign X - The Guardian" */
function splitGoogleTitle(rawTitle) {
  const parts = rawTitle.split(/\s+[-–—]\s+/);
  if (parts.length < 2) {
    return { title: rawTitle.trim(), source: "" };
  }
  const source = parts.pop().trim();
  return { title: parts.join(" - ").trim(), source };
}

function classifyPulse(title, description) {
  const text = `${title} ${description}`;
  if (/\b(complet(e|es|ed)|confirm(s|ed)|signs?|signed|seals?|unveils?|announces?)\b/i.test(text) &&
      /\b(sign|deal|transfer|arrival|from|join)/i.test(text)) {
    return { label: "Signed", kind: "signed" };
  }
  if (/\b(sells?|sold|departs?|leaves?|left|exit|exits|offloaded)\b/i.test(text)) {
    return { label: "Sold / left", kind: "sold" };
  }
  if (/\b(loan|loaned)\b/i.test(text)) {
    return { label: "Loan", kind: "loan" };
  }
  if (/\b(bid|linked|target|interest|close to|set to|in talks|race for|rumour|rumor|want[s]?)\b/i.test(text)) {
    return { label: "Linked", kind: "linked" };
  }
  if (/\b(transfer|deal|contract|fee)\b/i.test(text)) {
    return { label: "Transfer desk", kind: "transfer" };
  }
  return { label: "Club news", kind: "news" };
}

function normalizeItem(raw, fallbackSource) {
  const { title, source: titleSource } = splitGoogleTitle(raw.rawTitle);
  // Skip useless stubs like a bare team name
  if (/^manchester united$/i.test(title.trim())) return null;

  const source = raw.sourceTag || titleSource || fallbackSource;
  const blurb = raw.description
    .replace(title, "")
    .replace(source, "")
    .replace(/^[-–—:\s]+/, "")
    .trim();
  const { label, kind } = classifyPulse(title, blurb);
  const isTransfer = kind !== "news";

  return {
    title,
    link: raw.link,
    pubDate: raw.pubDate,
    blurb: blurb.slice(0, 160),
    source,
    label,
    kind,
    isTransfer,
  };
}

function dedupeKey(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(man utd|man united|manchester united)\b/g, "united")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/**
 * Free global pulse: Google News (AU) + Guardian RSS.
 * No BBC geo walls — article links open the publisher page via Google/Guardian.
 */
export async function fetchUnitedPulse(limit = 10) {
  const settled = await Promise.allSettled([
    fetch("/api/pulse-google").then(async (res) => {
      if (!res.ok) throw new Error(`Google News ${res.status}`);
      return parseRssItems(await res.text()).map((r) =>
        normalizeItem(r, "Google News")
      );
    }),
    fetch("/api/pulse-guardian").then(async (res) => {
      if (!res.ok) throw new Error(`Guardian ${res.status}`);
      return parseRssItems(await res.text()).map((r) =>
        normalizeItem(r, "The Guardian")
      );
    }),
  ]);

  const merged = [];
  for (const result of settled) {
    if (result.status === "fulfilled") {
      merged.push(...result.value.filter(Boolean));
    } else {
      console.error(result.reason);
    }
  }

  if (!merged.length) {
    throw new Error("Could not load club pulse feeds");
  }

  const seen = new Set();
  const unique = [];
  for (const item of merged) {
    const key = dedupeKey(item.title);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  const rank = { signed: 0, sold: 1, loan: 2, linked: 3, transfer: 4, news: 5 };
  return unique
    .sort((a, b) => {
      const kindDiff = (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9);
      if (kindDiff !== 0) return kindDiff;
      return new Date(b.pubDate) - new Date(a.pubDate);
    })
    .slice(0, limit);
}
