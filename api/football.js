const UNFOLD = {
  "X-Unfold-Goals": "true",
  "X-Unfold-Bookings": "true",
  "X-Unfold-Subs": "true",
  "X-Unfold-Lineups": "true",
};

/**
 * Flat Vercel function (catch-all [...path] folders 404 on this Vite setup).
 * Rewritten from /api/fd/* via vercel.json
 * Query: path=teams/66/matches&dateFrom=...
 */
export default async function handler(req, res) {
  const pathParam = req.query.path;
  const subpath = Array.isArray(pathParam)
    ? pathParam.filter(Boolean).join("/")
    : String(pathParam || "").replace(/^\/+/, "");

  if (!subpath) {
    res.status(400).json({
      error: "Missing path. Use /api/fd/teams/66 or ?path=teams/66",
    });
    return;
  }

  const incoming = new URL(req.url, "http://localhost");
  incoming.searchParams.delete("path");
  const search = incoming.searchParams.toString();
  const upstream = `https://api.football-data.org/v4/${subpath}${
    search ? `?${search}` : ""
  }`;

  const token = process.env.FOOTBALL_DATA_TOKEN;
  if (!token) {
    res.status(500).json({
      error:
        "FOOTBALL_DATA_TOKEN is not set in Vercel Environment Variables. Add it (no VITE_ prefix) and redeploy.",
    });
    return;
  }

  try {
    const upstreamRes = await fetch(upstream, {
      headers: {
        "X-Auth-Token": token,
        ...UNFOLD,
      },
    });
    const body = await upstreamRes.text();
    res.setHeader(
      "Content-Type",
      upstreamRes.headers.get("content-type") || "application/json"
    );
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(upstreamRes.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Upstream football-data request failed" });
  }
}
