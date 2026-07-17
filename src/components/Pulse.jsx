import { useState } from "react";
import { formatNewsDate } from "../lib/format";

const KIND_STYLE = {
  signed: "bg-emerald-500/15 text-emerald-300",
  sold: "bg-united-red/20 text-red-300",
  loan: "bg-sky-500/15 text-sky-300",
  linked: "bg-united-gold/15 text-united-gold",
  transfer: "bg-united-gold/15 text-united-gold",
  news: "bg-white/10 text-united-mist",
};

const Pulse = ({ items, loading }) => {
  const [open, setOpen] = useState(true);

  if (loading) {
    return (
      <section className="mt-8 animate-riseIn" style={{ animationDelay: "120ms" }}>
        <p className="section-label mb-3">Club pulse</p>
        <p className="text-sm text-united-mist">Pulling transfer desk &amp; headlines…</p>
      </section>
    );
  }

  if (!items?.length) return null;

  return (
    <section className="mt-8 animate-riseIn" style={{ animationDelay: "120ms" }}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="text-left">
          <p className="section-label">Club pulse</p>
          <p className="mt-1 text-sm text-united-mist">
            {open
              ? "What happened — signed, sold, linked — then open the article."
              : `${items.length} stor${items.length === 1 ? "y" : "ies"} · tap to expand`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-[0.18em] text-united-mist sm:inline">
            Google News · Guardian
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 border border-white/15 bg-pitch-800/80 px-3 py-1.5 font-display text-lg tracking-wider text-united-bone transition hover:border-united-red/60 hover:text-white"
          >
            {open ? "HIDE" : "SHOW"}
            <span
              className={`text-united-gold transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
              aria-hidden
            >
              ▾
            </span>
          </button>
        </div>
      </div>

      {open && (
        <ul className="divide-y divide-white/10 border border-white/10 bg-pitch-800/50">
          {items.map((item, idx) => (
            <li
              key={`${item.link}-${idx}`}
              className="flex flex-col gap-3 px-4 py-3.5 text-left transition duration-300 hover:bg-pitch-700/70 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                      KIND_STYLE[item.kind] || KIND_STYLE.news
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-united-mist">
                    {formatNewsDate(item.pubDate)}
                    {item.source ? ` · ${item.source}` : ""}
                  </span>
                </div>
                <h3 className="text-base font-semibold leading-snug text-united-bone sm:text-lg">
                  {item.title}
                </h3>
                {item.blurb && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-united-mist">
                    {item.blurb}
                  </p>
                )}
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center justify-center self-start border border-united-red/50 bg-united-red/15 px-3 py-2 font-display text-lg tracking-wider text-united-bone transition hover:border-united-red hover:bg-united-red hover:text-white sm:self-center"
              >
                READ
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Pulse;
