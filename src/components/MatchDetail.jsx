import { useEffect, useState } from "react";
import { fetchMatchCentre } from "../api/matchCentre";
import {
  formatDate,
  formatTime,
  getTeamNickname,
  statusLabel,
} from "../lib/format";

const TABS = ["Summary", "Timeline", "Stats", "Lineups"];

const MatchDetail = ({ match: seedMatch, onClose }) => {
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Summary");

  useEffect(() => {
    if (!seedMatch) return undefined;
    let cancelled = false;
    setLoading(true);
    setTab("Summary");
    // Show seed immediately so the drawer never feels empty/broken
    setSheet({
      ...seedMatch,
      timeline: [],
      stats: [],
      lineups: { home: { xi: [], bench: [] }, away: { xi: [], bench: [] } },
      sources: ["football-data"],
    });

    fetchMatchCentre(seedMatch)
      .then((data) => {
        if (!cancelled) setSheet(data);
      })
      .catch((err) => {
        console.error(err);
        // Keep seed scoreboard — don't hard-fail the panel
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [seedMatch]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (!seedMatch) return null;

  const match = sheet || seedMatch;
  const home = match.homeTeam;
  const away = match.awayTeam;
  const ft = match.score?.fullTime;
  const ht = match.score?.halfTime;
  const showScore = ft?.home != null && ft?.away != null;
  const timeline = match.timeline || [];
  const stats = match.stats || [];
  const homeXi = match.lineups?.home?.xi || [];
  const awayXi = match.lineups?.away?.xi || [];
  const homeBench = match.lineups?.home?.bench || [];
  const awayBench = match.lineups?.away?.bench || [];
  const referees = match.referees || [];
  const hasDeep =
    timeline.length > 0 ||
    stats.length > 0 ||
    homeXi.length > 0 ||
    awayXi.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close match detail"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-united-red/40 bg-pitch-950 shadow-jumbo animate-riseIn">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="text-left">
            <p className="section-label">Match centre</p>
            <p className="text-xs text-united-mist">
              {loading ? "Enriching sheet…" : (match.sources || []).join(" + ") || "free APIs"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-white/15 px-3 py-1 font-display text-2xl leading-none text-united-bone hover:border-united-red hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          <header className="board-frame rounded-sm px-4 py-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {match.competition?.emblem && (
                  <img
                    src={match.competition.emblem}
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                )}
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-united-mist">
                    {match.competition?.name}
                  </div>
                  <div className="font-display text-xl tracking-wider text-united-bone">
                    {match.matchday != null
                      ? `MD ${match.matchday}`
                      : (match.stage || "").replaceAll("_", " ")}
                  </div>
                </div>
              </div>
              <span className="bg-pitch-700 px-2 py-0.5 font-display text-xl tracking-widest text-united-gold">
                {statusLabel(match)}
              </span>
            </div>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <TeamMini team={home} />
              <div className="text-center">
                {showScore ? (
                  <div className="font-display text-5xl leading-none text-united-bone tabular-nums">
                    {ft.home}
                    <span className="mx-1 text-united-red">:</span>
                    {ft.away}
                  </div>
                ) : (
                  <div className="font-display text-4xl text-united-gold">
                    {formatTime(match.utcDate)}
                  </div>
                )}
                <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-united-mist">
                  {formatDate(match.utcDate)} · {formatTime(match.utcDate)} Syd
                </div>
                {ht?.home != null && (
                  <div className="mt-1 text-xs text-united-mist">
                    HT {ht.home}–{ht.away}
                  </div>
                )}
              </div>
              <TeamMini team={away} align="right" />
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-3 text-sm text-united-mist">
              <span>{match.venue || "Venue TBC"}</span>
              {match.attendance != null && (
                <span>Att. {match.attendance.toLocaleString()}</span>
              )}
            </div>
          </header>

          {match.thumb && (
            <div className="mt-4 overflow-hidden border border-white/10">
              <img
                src={match.thumb}
                alt=""
                className="h-36 w-full object-cover opacity-90"
              />
            </div>
          )}

          <div className="mt-4 flex gap-1 border border-white/10 bg-pitch-800/50 p-1">
            {TABS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                className={`flex-1 px-2 py-2 font-display text-lg tracking-wider transition ${
                  tab === name
                    ? "bg-united-red text-white"
                    : "text-united-mist hover:text-united-bone"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="mt-4 text-left">
            {tab === "Summary" && (
              <SummaryTab
                match={match}
                timeline={timeline}
                referees={referees}
                hasDeep={hasDeep}
                loading={loading}
              />
            )}
            {tab === "Timeline" && (
              <TimelineTab timeline={timeline} loading={loading} />
            )}
            {tab === "Stats" && <StatsTab stats={stats} loading={loading} />}
            {tab === "Lineups" && (
              <LineupsTab
                homeName={getTeamNickname(home?.shortName || home?.name, 900)}
                awayName={getTeamNickname(away?.shortName || away?.name, 900)}
                homeXi={homeXi}
                awayXi={awayXi}
                homeBench={homeBench}
                awayBench={awayBench}
                loading={loading}
              />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

function SummaryTab({ match, timeline, referees, hasDeep, loading }) {
  const goals = timeline.filter((e) => e.type === "goal" || e.type === "pen");
  return (
    <div className="space-y-5">
      {match.highlightsUrl && (
        <a
          href={match.highlightsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between border border-united-gold/40 bg-united-gold/10 px-3 py-3 font-display text-xl tracking-wider text-united-gold hover:bg-united-gold/20"
        >
          HIGHLIGHTS
          <span aria-hidden>↗</span>
        </a>
      )}

      <section>
        <p className="section-label mb-2">Goal feed</p>
        {goals.length === 0 && (
          <p className="text-sm text-united-mist">
            {loading
              ? "Pulling scorers…"
              : hasDeep
                ? "No goals logged."
                : "Scorers load from TheSportsDB when the match is in their free archive."}
          </p>
        )}
        <ul className="space-y-2">
          {goals.map((g, i) => (
            <li
              key={`goal-${i}`}
              className="flex items-center justify-between border border-white/10 bg-pitch-800/50 px-3 py-2 text-sm"
            >
              <span className="text-united-bone">
                {g.player || "Goal"}
                {g.assist ? (
                  <span className="text-united-mist"> (a. {g.assist})</span>
                ) : null}
              </span>
              <span className="font-display text-xl text-united-gold">
                {g.minute}
                {g.extra ? `+${g.extra}` : ""}'
                <span className="ml-2 text-sm text-united-mist">
                  {g.home ? "H" : "A"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {referees.length > 0 && (
        <section>
          <p className="section-label mb-2">Officials</p>
          <ul className="space-y-1 text-sm text-united-mist">
            {referees.map((r, i) => (
              <li key={`ref-${i}`}>
                <span className="text-united-bone">{r.name}</span>
                {r.type ? ` · ${String(r.type).replaceAll("_", " ")}` : ""}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function TimelineTab({ timeline, loading }) {
  if (!timeline.length) {
    return (
      <p className="text-sm text-united-mist">
        {loading ? "Loading events…" : "No timeline events for this match yet."}
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {timeline.map((e, i) => (
        <li
          key={`tl-${i}`}
          className="grid grid-cols-[3.25rem_1fr] gap-3 border border-white/10 bg-pitch-800/50 px-3 py-2"
        >
          <div className="font-display text-xl leading-none text-united-gold">
            {e.minute}
            {e.extra ? `+${e.extra}` : ""}'
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-united-mist">
              {e.label}
              {e.home ? " · home" : " · away"}
            </div>
            <div className="text-sm text-united-bone">
              {e.player}
              {e.assist ? (
                <span className="text-united-mist"> · {e.assist}</span>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatsTab({ stats, loading }) {
  if (!stats.length) {
    return (
      <p className="text-sm text-united-mist">
        {loading ? "Loading stats…" : "No match stats available on the free feed."}
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {stats.map((s) => {
        const total = (s.home || 0) + (s.away || 0) || 1;
        const homePct = Math.round((s.home / total) * 100);
        return (
          <li key={s.name}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold text-united-bone">{s.home}</span>
              <span className="text-united-mist">{s.name}</span>
              <span className="font-semibold text-united-bone">{s.away}</span>
            </div>
            <div className="flex h-1.5 overflow-hidden bg-pitch-700">
              <div
                className="bg-united-gold"
                style={{ width: `${homePct}%` }}
              />
              <div
                className="bg-united-red"
                style={{ width: `${100 - homePct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function LineupsTab({
  homeName,
  awayName,
  homeXi,
  awayXi,
  homeBench,
  awayBench,
  loading,
}) {
  if (!homeXi.length && !awayXi.length) {
    return (
      <p className="text-sm text-united-mist">
        {loading
          ? "Loading lineups…"
          : "Lineups aren’t on football-data free tier; TheSportsDB fills them when available."}
      </p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <LineupList title={homeName} xi={homeXi} bench={homeBench} />
      <LineupList title={awayName} xi={awayXi} bench={awayBench} />
    </div>
  );
}

function TeamMini({ team, align = "left" }) {
  if (!team) return <div />;
  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        align === "right" ? "sm:items-end" : "sm:items-start"
      }`}
    >
      <img src={team.crest} alt="" className="h-12 w-12 object-contain" />
      <div
        className={`font-display text-xl leading-none text-united-bone ${
          align === "right" ? "sm:text-right" : "sm:text-left"
        }`}
      >
        {getTeamNickname(team.shortName || team.name, 800)}
      </div>
    </div>
  );
}

function LineupList({ title, xi, bench }) {
  return (
    <div className="border border-white/10 bg-pitch-800/40 p-3">
      <div className="mb-2 font-display text-xl tracking-wider text-united-gold">
        {title}
      </div>
      <ol className="space-y-1 text-sm text-united-bone">
        {xi.map((p, i) => (
          <li key={`xi-${i}`} className="flex gap-2">
            <span className="w-6 text-united-mist">
              {p.number != null ? p.number : "·"}
            </span>
            <span>
              {p.name}
              {p.position ? (
                <span className="text-united-mist"> · {p.position}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
      {bench?.length > 0 && (
        <>
          <div className="mb-1 mt-3 text-[10px] uppercase tracking-[0.16em] text-united-mist">
            Bench
          </div>
          <ul className="space-y-1 text-xs text-united-mist">
            {bench.map((p, i) => (
              <li key={`bn-${i}`}>{p.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MatchDetail;
