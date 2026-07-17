import { useEffect, useState } from "react";
import { fetchMatchDetail } from "../api/football";
import {
  formatDate,
  formatTime,
  getTeamNickname,
  statusLabel,
} from "../lib/format";

const MatchDetail = ({ matchId, onClose }) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!matchId) return undefined;
    let cancelled = false;
    setLoading(true);
    setError("");
    setMatch(null);

    fetchMatchDetail(matchId)
      .then((data) => {
        if (!cancelled) setMatch(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setError("Couldn’t load match detail from the free API.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [matchId]);

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

  if (!matchId) return null;

  const home = match?.homeTeam;
  const away = match?.awayTeam;
  const ft = match?.score?.fullTime;
  const ht = match?.score?.halfTime;
  const showScore = ft?.home != null && ft?.away != null;
  const goals = Array.isArray(match?.goals) ? match.goals : [];
  const bookings = Array.isArray(match?.bookings) ? match.bookings : [];
  const subs = Array.isArray(match?.substitutions) ? match.substitutions : [];
  const homeLineup = match?.homeTeam?.lineup || [];
  const awayLineup = match?.awayTeam?.lineup || [];
  const homeBench = match?.homeTeam?.bench || [];
  const awayBench = match?.awayTeam?.bench || [];
  const referees = match?.referees || [];

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
            <p className="text-xs text-united-mist">FotMob-style sheet · free API</p>
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
          {loading && (
            <p className="text-united-mist">Loading match sheet…</p>
          )}
          {error && <p className="text-united-red">{error}</p>}

          {!loading && match && (
            <div className="space-y-6 text-left">
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

              {goals.length > 0 && (
                <Section title="Goals">
                  <ul className="space-y-2">
                    {goals.map((g, i) => (
                      <li
                        key={`g-${i}`}
                        className="flex items-center justify-between border border-white/10 bg-pitch-800/50 px-3 py-2 text-sm"
                      >
                        <span className="text-united-bone">
                          {g.scorer?.name || "Goal"}
                          {g.assist?.name ? (
                            <span className="text-united-mist">
                              {" "}
                              (a. {g.assist.name})
                            </span>
                          ) : null}
                        </span>
                        <span className="font-display text-xl text-united-gold">
                          {g.minute}
                          {g.injuryTime ? `+${g.injuryTime}` : ""}'
                          {g.team?.tla ? ` · ${g.team.tla}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {bookings.length > 0 && (
                <Section title="Cards">
                  <ul className="space-y-2">
                    {bookings.map((b, i) => (
                      <li
                        key={`b-${i}`}
                        className="flex items-center justify-between border border-white/10 bg-pitch-800/50 px-3 py-2 text-sm"
                      >
                        <span className="text-united-bone">
                          {b.player?.name}
                          <span className="text-united-mist">
                            {" "}
                            · {b.team?.tla || b.team?.name}
                          </span>
                        </span>
                        <span
                          className={
                            b.card === "RED_CARD"
                              ? "text-united-red"
                              : "text-united-gold"
                          }
                        >
                          {b.minute}' · {b.card === "RED_CARD" ? "Red" : "Yellow"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {subs.length > 0 && (
                <Section title="Subs">
                  <ul className="space-y-2">
                    {subs.map((s, i) => (
                      <li
                        key={`s-${i}`}
                        className="border border-white/10 bg-pitch-800/50 px-3 py-2 text-sm text-united-bone"
                      >
                        <span className="text-united-mist">{s.minute}'</span>{" "}
                        {s.playerOut?.name}
                        <span className="text-united-mist"> → </span>
                        {s.playerIn?.name}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {(homeLineup.length > 0 || awayLineup.length > 0) && (
                <Section title="Lineups">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <LineupList
                      title={getTeamNickname(home?.shortName || home?.name, 900)}
                      xi={homeLineup}
                      bench={homeBench}
                    />
                    <LineupList
                      title={getTeamNickname(away?.shortName || away?.name, 900)}
                      xi={awayLineup}
                      bench={awayBench}
                    />
                  </div>
                </Section>
              )}

              {referees.length > 0 && (
                <Section title="Officials">
                  <ul className="space-y-1 text-sm text-united-mist">
                    {referees.map((r, i) => (
                      <li key={`r-${i}`}>
                        <span className="text-united-bone">{r.name}</span>
                        {r.type ? ` · ${r.type.replaceAll("_", " ")}` : ""}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {!goals.length &&
                !bookings.length &&
                !subs.length &&
                !homeLineup.length &&
                !referees.length && (
                  <p className="border border-white/10 bg-pitch-800/40 px-3 py-3 text-sm text-united-mist">
                    Free tier gave the scoreboard sheet (teams, score/time, venue,
                    competition). Deeper events/lineups aren’t always included —
                    still enough to know the night at a glance.
                  </p>
                )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};

function Section({ title, children }) {
  return (
    <section>
      <p className="section-label mb-2">{title}</p>
      {children}
    </section>
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
          <li key={`xi-${i}`}>
            <span className="text-united-mist">
              {p.shirtNumber != null ? `${p.shirtNumber}. ` : ""}
            </span>
            {p.name || p.player?.name}
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
              <li key={`bn-${i}`}>{p.name || p.player?.name}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default MatchDetail;
