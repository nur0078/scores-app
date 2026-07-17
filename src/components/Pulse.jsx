import { formatNewsDate } from "../lib/format";

const Pulse = ({ items, loading }) => {
  if (loading) {
    return (
      <section className="mt-8 animate-riseIn" style={{ animationDelay: "120ms" }}>
        <p className="section-label mb-3">Club pulse</p>
        <p className="text-sm text-united-mist">Pulling United headlines…</p>
      </section>
    );
  }

  if (!items?.length) return null;

  const transfers = items.filter((i) => i.isTransfer);
  const rest = items.filter((i) => !i.isTransfer);

  return (
    <section className="mt-8 animate-riseIn" style={{ animationDelay: "120ms" }}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="section-label">Club pulse</p>
          <p className="mt-1 text-sm text-united-mist">
            Transfers &amp; chatter first — then the rest of the newsroom.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.18em] text-united-mist">
          BBC Sport · free
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[...transfers, ...rest].slice(0, 6).map((item, idx) => (
          <a
            key={`${item.link}-${idx}`}
            href={item.link}
            target="_blank"
            rel="noreferrer"
            className="group border border-white/10 bg-pitch-800/60 p-4 text-left transition duration-300 hover:border-united-red/60 hover:bg-pitch-700/80"
          >
            <div className="mb-2 flex items-center gap-2">
              {item.isTransfer && (
                <span className="rounded-sm bg-united-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-united-gold">
                  Transfer desk
                </span>
              )}
              <span className="text-[11px] text-united-mist">
                {formatNewsDate(item.pubDate)}
              </span>
            </div>
            <h3 className="font-semibold leading-snug text-united-bone group-hover:text-white">
              {item.title}
            </h3>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Pulse;
