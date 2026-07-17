export default async function handler(req, res) {
  const segments = req.query.path;
  const subpath = Array.isArray(segments)
    ? segments.join("/")
    : segments || "";

  const qIndex = req.url.indexOf("?");
  const search = qIndex >= 0 ? req.url.slice(qIndex) : "";
  const upstream = `https://www.thesportsdb.com/api/v1/json/${subpath}${search}`;

  try {
    const upstreamRes = await fetch(upstream, {
      headers: { "User-Agent": "GloryBoard/1.0" },
    });
    const body = await upstreamRes.text();
    res.setHeader(
      "Content-Type",
      upstreamRes.headers.get("content-type") || "application/json"
    );
    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=300");
    res.status(upstreamRes.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "TheSportsDB request failed" });
  }
}
