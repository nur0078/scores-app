const UNFOLD = {
  "X-Unfold-Goals": "true",
  "X-Unfold-Bookings": "true",
  "X-Unfold-Subs": "true",
  "X-Unfold-Lineups": "true",
};

export default async function handler(req, res) {
  const segments = req.query.path;
  const subpath = Array.isArray(segments)
    ? segments.join("/")
    : segments || "";

  const qIndex = req.url.indexOf("?");
  const search = qIndex >= 0 ? req.url.slice(qIndex) : "";
  const upstream = `https://api.football-data.org/v4/${subpath}${search}`;

  try {
    const upstreamRes = await fetch(upstream, {
      headers: {
        "X-Auth-Token": process.env.FOOTBALL_DATA_TOKEN || "",
        ...UNFOLD,
      },
    });
    const body = await upstreamRes.text();
    const contentType =
      upstreamRes.headers.get("content-type") || "application/json";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(upstreamRes.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream football-data request failed" });
  }
}
