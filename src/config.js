/** Personal board — inferred from the original app (team 33, Sydney TZ, no noise). */
export const TEAM = {
  id: 66, // Manchester United on football-data.org
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
