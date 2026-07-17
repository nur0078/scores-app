import { TEAM, TSDB_KEY } from "../config";

const FD = "/api/fd";
const TSDB = "/api/tsdb";

async function fdGet(path) {
  const res = await fetch(`${FD}${path}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`football-data ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

async function tsdbGet(endpoint) {
  const res = await fetch(`${TSDB}/${endpoint}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`thesportsdb ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

function stripClubSuffix(name = "") {
  return name
    .replace(/\bAFC\b/gi, "")
    .replace(/\bFC\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function underscoreName(name = "") {
  return stripClubSuffix(name).replace(/\s+/g, "_");
}

function leagueFilenameTokens(competitionName = "") {
  const base = [
    "English_Premier_League",
    "Premier_League",
    "UEFA_Champions_League",
    "UEFA_Europa_League",
    "FA_Cup",
    "EFL_Cup",
    "Football_League_Cup",
  ];
  if (competitionName) {
    base.unshift(competitionName.replace(/\s+/g, "_"));
    if (/premier league/i.test(competitionName)) {
      base.unshift("English_Premier_League");
    }
  }
  return [...new Set(base)];
}

/** Resolve a TheSportsDB event id that matches a football-data fixture. */
export async function findTsdbEvent(fdMatch) {
  if (!fdMatch?.utcDate) return null;
  const date = fdMatch.utcDate.slice(0, 10);
  const home = underscoreName(fdMatch.homeTeam?.name || fdMatch.homeTeam?.shortName);
  const away = underscoreName(fdMatch.awayTeam?.name || fdMatch.awayTeam?.shortName);
  if (!home || !away) return null;

  for (const league of leagueFilenameTokens(fdMatch.competition?.name)) {
    const filename = `${league}_${date}_${home}_vs_${away}`;
    try {
      const data = await tsdbGet(
        `${TSDB_KEY}/searchfilename.php?e=${encodeURIComponent(filename)}`
      );
      const hit = (data.event || []).find((e) => e?.idEvent);
      if (hit) return hit;
    } catch {
      /* try next league token */
    }
  }

  // Fallback: recent / next United list, match by calendar day + opponent
  try {
    const [last, next] = await Promise.all([
      tsdbGet(`${TSDB_KEY}/eventslast.php?id=${TEAM.tsdbId}`),
      tsdbGet(`${TSDB_KEY}/eventsnext.php?id=${TEAM.tsdbId}`),
    ]);
    const pool = [...(last.results || []), ...(next.events || [])];
    const homeClean = stripClubSuffix(fdMatch.homeTeam?.name).toLowerCase();
    const awayClean = stripClubSuffix(fdMatch.awayTeam?.name).toLowerCase();
    const hit = pool.find((e) => {
      if (e.dateEvent !== date) return false;
      const eh = (e.strHomeTeam || "").toLowerCase();
      const ea = (e.strAwayTeam || "").toLowerCase();
      return (
        (eh.includes(homeClean.split(" ")[0]) && ea.includes(awayClean.split(" ")[0])) ||
        (eh === homeClean && ea === awayClean)
      );
    });
    if (hit) return hit;
  } catch {
    /* ignore */
  }

  return null;
}

function mapTimeline(rows = []) {
  return rows
    .map((row) => {
      const typeRaw = (row.strTimeline || "").toLowerCase();
      let type = "event";
      if (typeRaw.includes("goal")) type = "goal";
      else if (typeRaw.includes("subst") || typeRaw.includes("sub")) type = "sub";
      else if (typeRaw.includes("yellow")) type = "yellow";
      else if (typeRaw.includes("red")) type = "red";
      else if (typeRaw.includes("var")) type = "var";
      else if (typeRaw.includes("pen")) type = "pen";

      return {
        minute: Number(row.intTime) || 0,
        extra: row.intTimeExtra ? Number(row.intTimeExtra) : null,
        type,
        label: row.strTimeline || row.strTimelineDetail || "Event",
        detail: row.strTimelineDetail || "",
        player: row.strPlayer || "",
        assist: row.strAssist || "",
        home: row.strHome === "Yes",
        cutout: row.strCutout || null,
      };
    })
    .sort((a, b) => a.minute - b.minute || (a.extra || 0) - (b.extra || 0));
}

function mapLineups(rows = []) {
  const split = (homeSide) => {
    const side = rows.filter((p) => (p.strHome === "Yes") === homeSide);
    const xi = side.filter((p) => p.strSubstitute !== "Yes");
    const bench = side.filter((p) => p.strSubstitute === "Yes");
    const mapPlayer = (p) => ({
      name: p.strPlayer,
      number: p.intSquadNumber,
      position: p.strPosition,
      cutout: p.strCutout || p.strThumb,
    });
    return { xi: xi.map(mapPlayer), bench: bench.map(mapPlayer) };
  };
  return { home: split(true), away: split(false) };
}

function mapStats(rows = []) {
  return (rows || [])
    .map((s) => ({
      name: s.strStat,
      home: Number(s.intHome) || 0,
      away: Number(s.intAway) || 0,
    }))
    .filter((s) => s.name);
}

/**
 * FotMob-style match centre:
 * - Seed from football-data list row (always shows)
 * - Optional FD detail (referees / HT)
 * - TheSportsDB enrichment (timeline, stats, lineups, venue, highlights)
 *
 * football-data FREE does NOT include goals/lineups/stats — confirmed.
 */
export async function fetchMatchCentre(seedMatch) {
  if (!seedMatch?.id && !seedMatch?.utcDate) {
    throw new Error("No match selected");
  }

  const centre = {
    id: seedMatch.id,
    utcDate: seedMatch.utcDate,
    status: seedMatch.status,
    matchday: seedMatch.matchday,
    stage: seedMatch.stage,
    venue: seedMatch.venue || null,
    competition: seedMatch.competition || null,
    homeTeam: seedMatch.homeTeam,
    awayTeam: seedMatch.awayTeam,
    score: seedMatch.score || null,
    referees: seedMatch.referees || [],
    timeline: [],
    stats: [],
    lineups: { home: { xi: [], bench: [] }, away: { xi: [], bench: [] } },
    highlightsUrl: null,
    thumb: null,
    sources: ["football-data"],
  };

  const tasks = [];

  if (seedMatch.id) {
    tasks.push(
      fdGet(`/matches/${seedMatch.id}`)
        .then((detail) => {
          centre.venue = detail.venue || centre.venue;
          centre.score = detail.score || centre.score;
          centre.referees = detail.referees || centre.referees;
          centre.status = detail.status || centre.status;
          centre.attendance = detail.attendance;
          if (detail.goals?.length) centre.fdGoals = detail.goals;
        })
        .catch((err) => {
          console.warn("FD match detail skipped:", err.message);
        })
    );
  }

  tasks.push(
    (async () => {
      const event = await findTsdbEvent(seedMatch);
      if (!event?.idEvent) return;

      centre.sources.push("thesportsdb");
      centre.tsdbEventId = event.idEvent;
      centre.venue = event.strVenue || centre.venue;
      centre.thumb = event.strThumb || event.strPoster || null;
      centre.highlightsUrl = event.strVideo || null;
      if (event.strOfficial) {
        centre.referees = centre.referees.length
          ? centre.referees
          : [{ name: event.strOfficial, type: "REFEREE" }];
      }
      // Prefer live TSDB score if FD score missing
      if (
        centre.score?.fullTime?.home == null &&
        event.intHomeScore != null &&
        event.intAwayScore != null
      ) {
        centre.score = {
          ...(centre.score || {}),
          fullTime: {
            home: Number(event.intHomeScore),
            away: Number(event.intAwayScore),
          },
        };
      }

      const id = event.idEvent;
      const [timeline, stats, lineup, full] = await Promise.all([
        tsdbGet(`${TSDB_KEY}/lookuptimeline.php?id=${id}`).catch(() => null),
        tsdbGet(`${TSDB_KEY}/lookupeventstats.php?id=${id}`).catch(() => null),
        tsdbGet(`${TSDB_KEY}/lookuplineup.php?id=${id}`).catch(() => null),
        tsdbGet(`${TSDB_KEY}/lookupevent.php?id=${id}`).catch(() => null),
      ]);

      centre.timeline = mapTimeline(timeline?.timeline || []);
      centre.stats = mapStats(stats?.eventstats || []);
      centre.lineups = mapLineups(lineup?.lineup || []);

      const fullEvent = full?.events?.[0];
      if (fullEvent) {
        centre.venue = fullEvent.strVenue || centre.venue;
        centre.thumb = fullEvent.strThumb || centre.thumb;
        centre.highlightsUrl = fullEvent.strVideo || centre.highlightsUrl;
        if (fullEvent.strHomeTeamBadge) {
          centre.homeTeam = {
            ...centre.homeTeam,
            crest: centre.homeTeam?.crest || fullEvent.strHomeTeamBadge,
          };
        }
        if (fullEvent.strAwayTeamBadge) {
          centre.awayTeam = {
            ...centre.awayTeam,
            crest: centre.awayTeam?.crest || fullEvent.strAwayTeamBadge,
          };
        }
      }
    })().catch((err) => {
      console.warn("TSDB enrichment skipped:", err.message);
    })
  );

  await Promise.all(tasks);
  return centre;
}
