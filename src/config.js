/** Personal board — inferred from the original app (team 33, Sydney TZ, no noise). */
export const TEAM = {
  id: 66, // Manchester United on football-data.org
  tsdbId: "133612", // Manchester United on TheSportsDB (free match centre)
  name: "Manchester United",
  shortName: "Man United",
  tla: "MUN",
  crest: "https://crests.football-data.org/66.png",
};

export const LEAGUE = {
  code: "PL",
  name: "Premier League",
};

export const TIMEZONE = "Australia/Sydney";

/** Free TheSportsDB key (public test key). Override via THESPORTSDB_KEY if you register. */
export const TSDB_KEY = "123";

export const LIVE_STATUSES = new Set([
  "IN_PLAY",
  "PAUSED",
  "LIVE",
  "HALF_TIME",
]);

export const UPCOMING_STATUSES = new Set([
  "SCHEDULED",
  "TIMED",
  "POSTPONED",
]);

export const FINISHED_STATUSES = new Set(["FINISHED", "AWARDED"]);
