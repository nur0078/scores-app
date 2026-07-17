export default async function handler(req, res) {
  const url =
    "https://news.google.com/rss/search?q=Manchester+United+(transfer+OR+signs+OR+signed+OR+joins+OR+joined+OR+loan+OR+deal+OR+bid)&hl=en-AU&gl=AU&ceid=AU:en";

  try {
    const upstreamRes = await fetch(url, {
      headers: { "User-Agent": "GloryBoard/1.0" },
    });
    const body = await upstreamRes.text();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(upstreamRes.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: "Google News feed failed" });
  }
}
