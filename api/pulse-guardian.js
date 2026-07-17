export default async function handler(req, res) {
  const url = "https://www.theguardian.com/football/manchester-united/rss";

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
    res.status(502).json({ error: "Guardian feed failed" });
  }
}
