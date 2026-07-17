import { TIMEZONE, TEAM } from "../config";

const NICKNAMES = {
  arsenal: ["ARS", "Arsenal", "Arsenal"],
  "aston villa": ["AVL", "A. Villa", "Aston Villa"],
  bournemouth: ["BOU", "B'mouth", "Bournemouth"],
  brighton: ["BRI", "Brighton", "Brighton"],
  "brighton & hove albion": ["BRI", "Brighton", "Brighton"],
  brentford: ["BRE", "Brentford", "Brentford"],
  burnley: ["BUR", "Burnley", "Burnley"],
  chelsea: ["CHE", "Chelsea", "Chelsea"],
  "crystal palace": ["CRY", "C. Palace", "Crystal Palace"],
  everton: ["EVE", "Everton", "Everton"],
  fulham: ["FUL", "Fulham", "Fulham"],
  "leeds united": ["LEE", "Leeds", "Leeds United"],
  liverpool: ["LIV", "Liverpool", "Liverpool"],
  luton: ["LUT", "Luton", "Luton"],
  "manchester city": ["MCI", "Man City", "Manchester City"],
  "man city": ["MCI", "Man City", "Manchester City"],
  "manchester united": ["MUN", "Man Utd", "Manchester United"],
  "man united": ["MUN", "Man Utd", "Manchester United"],
  newcastle: ["NEW", "Newcastle", "Newcastle United"],
  "newcastle united": ["NEW", "Newcastle", "Newcastle United"],
  "nottingham forest": ["NFO", "Nott'm", "Nottingham Forest"],
  "sheffield utd": ["SHU", "Sheffield", "Sheffield United"],
  "sheffield united": ["SHU", "Sheffield", "Sheffield United"],
  tottenham: ["TOT", "Spurs", "Tottenham"],
  "tottenham hotspur": ["TOT", "Spurs", "Tottenham"],
  "west ham": ["WHU", "West Ham", "West Ham United"],
  "west ham united": ["WHU", "West Ham", "West Ham United"],
  "wolverhampton wanderers": ["WOL", "Wolves", "Wolves"],
  wolves: ["WOL", "Wolves", "Wolves"],
};

export function getTeamNickname(teamName, viewPort = 1024) {
  const key = (teamName || "").toLowerCase();
  const row = NICKNAMES[key];
  if (!row) return teamName;
  if (viewPort < 768) return row[0];
  if (viewPort < 1024) return row[1];
  return row[2];
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    month: "short",
    day: "2-digit",
  }).format(new Date(dateString));
}

export function formatTime(dateString) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

export function formatNewsDate(dateString) {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-AU", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(dateString));
}

export function isUnited(team) {
  return team?.id === TEAM.id || /manchester united/i.test(team?.name || "");
}

export function unitedResult(match) {
  if (!match?.score?.fullTime) return null;
  const home = match.score.fullTime.home;
  const away = match.score.fullTime.away;
  if (home == null || away == null) return null;
  const unitedHome = isUnited(match.homeTeam);
  const u = unitedHome ? home : away;
  const o = unitedHome ? away : home;
  if (u > o) return "W";
  if (u < o) return "L";
  return "D";
}

export function scoreLabel(match) {
  const ft = match?.score?.fullTime;
  if (ft?.home == null || ft?.away == null) return "–";
  return `${ft.home} – ${ft.away}`;
}

export function statusLabel(match) {
  if (!match) return "";
  if (match.status === "IN_PLAY" || match.status === "LIVE") {
    return match.minute != null ? `${match.minute}'` : "LIVE";
  }
  if (match.status === "PAUSED" || match.status === "HALF_TIME") {
    return "HT";
  }
  if (match.status === "FINISHED") return "FT";
  if (match.status === "TIMED" || match.status === "SCHEDULED") {
    return formatTime(match.utcDate);
  }
  return match.status.replaceAll("_", " ");
}
