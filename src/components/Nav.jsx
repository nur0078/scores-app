import { TEAM } from "../config";

const Nav = () => {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-riseIn">
      <div className="text-left">
        <p className="section-label mb-1">Personal board · Sydney time</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-none tracking-wide text-united-bone">
          GLORY{" "}
          <span className="text-united-red">BOARD</span>
        </h1>
        <p className="mt-2 max-w-md text-sm text-united-mist">
          No noise. Just {TEAM.shortName} — live score up top, then the pulse,
          fixtures, and the table.
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-sm border border-white/10 bg-pitch-800/70 px-3 py-2">
        <img
          src={TEAM.crest}
          alt={TEAM.name}
          className="h-10 w-10 object-contain"
        />
        <div className="text-left leading-tight">
          <div className="font-display text-2xl tracking-wider text-united-bone">
            {TEAM.tla}
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-united-mist">
            Old Trafford
          </div>
        </div>
      </div>
    </header>
  );
};

export default Nav;
