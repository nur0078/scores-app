import {
  formatDate,
  formatTime,
  getTeamNickname,
  scoreLabel,
  unitedResult,
} from "../lib/format";
import { TEAM } from "../config";

const FixturesList = ({
  upcoming = [],
  recent = [],
  loading,
  onSelectMatch,
}) => {
  return (
    <section
      className="mt-10 grid gap-8 lg:grid-cols-2 animate-riseIn"
      style={{ animationDelay: "200ms" }}
    >
      <MatchColumn
        title="Upcoming"
        subtitle="Next on the calendar · tap for match centre"
        matches={upcoming}
        loading={loading}
        mode="upcoming"
        onSelectMatch={onSelectMatch}
      />
      <MatchColumn
        title="Results"
        subtitle="Most recent nights · tap for match centre"
        matches={recent}
        loading={loading}
        mode="recent"
        onSelectMatch={onSelectMatch}
      />
    </section>
  );
};

function MatchColumn({ title, subtitle, matches, loading, mode, onSelectMatch }) {
  return (
    <div>
      <p className="section-label">{title}</p>
      <p className="mb-4 mt-1 text-sm text-united-mist">{subtitle}</p>

      {loading && (
        <p className="text-sm text-united-mist">Loading fixtures…</p>
      )}

      {!loading && !matches.length && (
        <p className="text-sm text-united-mist">Nothing in this window yet.</p>
      )}

      <ul className="space-y-3">
        {matches.map((match) => {
          const result = mode === "recent" ? unitedResult(match) : null;
          const opponent =
            match.homeTeam.id === TEAM.id ? match.awayTeam : match.homeTeam;
          const venue = match.homeTeam.id === TEAM.id ? "H" : "A";

          return (
            <li key={match.id}>
              <button
                type="button"
                onClick={() => onSelectMatch?.(match)}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border border-white/10 bg-pitch-800/50 px-3 py-3 text-left transition duration-300 hover:border-united-red/60 hover:bg-pitch-700/60"
              >
                <div className="w-12">
                  <div className="text-xs uppercase tracking-wider text-united-mist">
                    {formatDate(match.utcDate)}
                  </div>
                  <div className="font-display text-xl leading-none text-united-bone">
                    {mode === "upcoming"
                      ? formatTime(match.utcDate)
                      : scoreLabel(match)}
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={opponent.crest}
                    alt=""
                    className="h-8 w-8 object-contain"
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-united-bone">
                      {getTeamNickname(opponent.shortName || opponent.name, 1000)}
                    </div>
                    <div className="truncate text-xs text-united-mist">
                      {match.competition?.name}
                      {match.venue ? ` · ${match.venue}` : ""}
                    </div>
                  </div>
                </div>

                <div
                  className={`font-display text-2xl leading-none ${
                    result === "W"
                      ? "text-emerald-400"
                      : result === "L"
                        ? "text-united-red"
                        : result === "D"
                          ? "text-united-gold"
                          : "text-united-mist"
                  }`}
                >
                  {result || venue}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FixturesList;
