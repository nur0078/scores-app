import { useEffect, useState } from "react";
import { getTeamNickname } from "../lib/format";
import { TEAM } from "../config";

const Standings = ({ table = [], loading }) => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const nameFor = (teamName) => {
    if (width >= 1024) return teamName;
    return getTeamNickname(teamName, width);
  };

  const zoneClass = (position) => {
    if (position <= 4) return "text-emerald-300/90";
    if (position === 5) return "text-sky-300/90";
    if (position >= 18) return "text-united-red";
    return "text-united-mist";
  };

  return (
    <section
      className="mt-12 animate-riseIn"
      style={{ animationDelay: "280ms" }}
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-label">Premier League</p>
          <p className="mt-1 text-sm text-united-mist">
            Your row stays lit. Form reads left → right (oldest → newest).
          </p>
        </div>
        <div className="flex gap-3 text-[11px] uppercase tracking-[0.14em] text-united-mist">
          <span className="text-emerald-300">1–4 UCL</span>
          <span className="text-sky-300">5 EL</span>
          <span className="text-united-red">18–20 ↓</span>
        </div>
      </div>

      {loading && (
        <p className="text-sm text-united-mist">Loading table…</p>
      )}

      {!loading && (
        <div className="overflow-x-auto border border-white/10 bg-pitch-800/40">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-pitch-950 text-left text-[11px] uppercase tracking-[0.16em] text-united-mist">
                <th className="px-3 py-3">#</th>
                <th className="px-3 py-3">Club</th>
                <th className="px-2 py-3 text-center">MP</th>
                <th className="px-2 py-3 text-center">W</th>
                <th className="px-2 py-3 text-center">D</th>
                <th className="px-2 py-3 text-center">L</th>
                <th className="px-2 py-3 text-center">GD</th>
                <th className="px-2 py-3 text-center">Pts</th>
                <th className="hidden px-3 py-3 md:table-cell">Form</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row) => {
                const united = row.team.id === TEAM.id;
                return (
                  <tr
                    key={row.team.id}
                    className={`border-t border-white/5 ${
                      united ? "united-row" : "hover:bg-white/[0.03]"
                    }`}
                  >
                    <td className={`px-3 py-2.5 font-display text-xl ${zoneClass(row.position)}`}>
                      {row.position}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={row.team.crest}
                          alt=""
                          className="h-5 w-5 object-contain"
                        />
                        <span
                          className={
                            united
                              ? "font-semibold text-united-gold"
                              : "text-united-bone"
                          }
                        >
                          {nameFor(row.team.shortName || row.team.name)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center text-united-mist">
                      {row.playedGames}
                    </td>
                    <td className="px-2 py-2.5 text-center">{row.won}</td>
                    <td className="px-2 py-2.5 text-center">{row.draw}</td>
                    <td className="px-2 py-2.5 text-center">{row.lost}</td>
                    <td className="px-2 py-2.5 text-center text-united-mist">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="px-2 py-2.5 text-center font-display text-xl text-united-bone">
                      {row.points}
                    </td>
                    <td className="hidden px-3 py-2.5 md:table-cell">
                      <FormPills form={row.form} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

function FormPills({ form }) {
  if (!form) return <span className="text-united-mist">—</span>;
  const chars = form.replace(/[^WDL]/g, "").slice(-5).split("");
  return (
    <div className="flex gap-1">
      {chars.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className={`flex h-6 w-6 items-center justify-center font-display text-sm leading-none ${
            c === "W"
              ? "bg-emerald-500/20 text-emerald-300"
              : c === "L"
                ? "bg-united-red/25 text-united-red"
                : "bg-united-gold/15 text-united-gold"
          }`}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export default Standings;
