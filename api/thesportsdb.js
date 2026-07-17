/**
 * Flat Vercel function for TheSportsDB.
 * Rewritten from /api/tsdb/* via vercel.json
 * Query: path=123/lookupevent.php&id=...
 */
export default async function handler(req, res) {
  const pathParam = req.query.path;
  const subpath = Array.isArray(pathParam)
    ? pathParam.filter(Boolean).join("/")
    : String(pathParam || "").replace(/^\/+/, "");

  if (!subpath) {
    res.status(400).json({ error: "Missing path" });
    return;
  }

  const incoming = new URL(req.url, "http://localhost");
  incoming.searchParams.delete("path");
  const search = incoming.searchParams.toString();
  const upstream = `https://www.thesportsdb.com/api/v1/json/${subpath}${
    search ? `?${search}` : ""
  }`;

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
