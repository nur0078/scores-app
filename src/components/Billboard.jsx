import {
  formatDate,
  formatTime,
  getTeamNickname,
  statusLabel,
} from "../lib/format";

const Billboard = ({ match, isLive, loading, error, onSelectMatch }) => {
  if (loading) {
    return (
      <div className="board-frame rounded-sm px-6 py-16 text-united-mist animate-riseIn">
        Warming up the jumbotron…
      </div>
    );
  }

  if (error) {
    return (
      <div className="board-frame rounded-sm px-6 py-12 text-left animate-riseIn">
        <p className="section-label mb-2">Board offline</p>
        <p className="text-united-bone">{error}</p>
        <p className="mt-3 text-sm text-united-mist">
          Vercel: Project Settings → Environment Variables →{" "}
          <code className="text-united-gold">FOOTBALL_DATA_TOKEN</code> (no{" "}
          <code className="text-united-gold">VITE_</code> prefix), then Redeploy.
          Local: same key in <code className="text-united-gold">.env</code> +{" "}
          <code className="text-united-gold">npm run dev</code>.
        </p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="board-frame rounded-sm px-6 py-16 text-united-mist animate-riseIn">
        No recent United fixture in the current window.
      </div>
    );
  }

  const home = match.homeTeam;
  const away = match.awayTeam;
  const homeScore = match.score?.fullTime?.home ?? match.score?.regularTime?.home;
  const awayScore = match.score?.fullTime?.away ?? match.score?.regularTime?.away;
  const showScore = homeScore != null && awayScore != null;

  return (
    <section
      className="board-frame relative rounded-sm px-4 py-6 sm:px-8 sm:py-8 animate-riseIn"
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => match && onSelectMatch?.(match)}
        className="absolute inset-0 z-20 cursor-pointer rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-united-gold"
        aria-label="Open match centre"
      />
      <div className="relative z-10 pointer-events-none">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {match.competition?.emblem && (
              <img
                src={match.competition.emblem}
                alt=""
                className="h-8 w-8 object-contain"
              />
            )}
            <div className="text-left">
              <div className="text-xs uppercase tracking-[0.22em] text-united-mist">
                {match.competition?.name || "Match"}
              </div>
              <div className="font-display text-xl tracking-wider text-united-bone">
                {match.matchday != null
                  ? `Matchday ${match.matchday}`
                  : match.stage?.replaceAll("_", " ")}
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-sm px-3 py-1 font-display text-2xl tracking-widest ${
              isLive
                ? "bg-united-red text-white shadow-glow"
                : "bg-pitch-700 text-united-gold"
            }`}
          >
            {isLive && (
              <span className="h-2 w-2 rounded-full bg-white animate-pulseLive" />
            )}
            {isLive ? statusLabel(match) : showScore ? "FULL TIME" : "NEXT UP"}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          <TeamBlock team={home} align="left" />
          <div className="min-w-[7rem] text-center">
            {showScore ? (
              <div className="font-display text-6xl sm:text-8xl leading-none tracking-wide text-united-bone tabular-nums">
                <span className={isUnitedAccent(home) ? "text-united-gold" : ""}>
                  {homeScore}
                </span>
                <span className="mx-2 text-united-red">:</span>
                <span className={isUnitedAccent(away) ? "text-united-gold" : ""}>
                  {awayScore}
                </span>
              </div>
            ) : (
              <div className="font-display text-5xl sm:text-6xl leading-none text-united-gold">
                {formatTime(match.utcDate)}
              </div>
            )}
            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-united-mist">
              {isLive ? "Live from the theatre" : formatDate(match.utcDate)}
            </div>
          </div>
          <TeamBlock team={away} align="right" />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-sm text-united-mist">
          <span>{match.venue || "Venue TBC"}</span>
          <span className="text-united-gold">
            {isLive
              ? `Kick-off ${formatTime(match.utcDate)} Syd · tap for centre`
              : showScore
                ? `${statusLabel(match)} · tap for centre`
                : `${formatDate(match.utcDate)} · ${formatTime(match.utcDate)} Syd · tap for centre`}
          </span>
        </div>
      </div>
    </section>
  );
};

function isUnitedAccent(team) {
  return /manchester united/i.test(team?.name || "") || team?.tla === "MUN";
}

function TeamBlock({ team, align }) {
  return (
    <div
      className={`flex flex-col items-center gap-2 ${
        align === "right" ? "sm:items-end" : "sm:items-start"
      }`}
    >
      <img
        src={team.crest}
        alt=""
        className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
      />
      <div
        className={`font-display text-2xl sm:text-3xl tracking-wide leading-none ${
          isUnitedAccent(team) ? "text-united-gold" : "text-united-bone"
        } ${align === "right" ? "sm:text-right" : "sm:text-left"}`}
      >
        {getTeamNickname(team.shortName || team.name, 900)}
      </div>
    </div>
  );
}

export default Billboard;
