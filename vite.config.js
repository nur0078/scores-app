import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// Free APIs are proxied so the token stays server-side (dev/preview)
// and browser CORS never blocks upstream feeds.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const token = env.FOOTBALL_DATA_TOKEN || "";

  const attachFootballToken = (proxy) => {
    proxy.on("proxyReq", (proxyReq) => {
      if (token) {
        proxyReq.setHeader("X-Auth-Token", token);
      }
      proxyReq.setHeader("X-Unfold-Goals", "true");
      proxyReq.setHeader("X-Unfold-Bookings", "true");
      proxyReq.setHeader("X-Unfold-Subs", "true");
      proxyReq.setHeader("X-Unfold-Lineups", "true");
    });
  };

  const proxy = {
    "/api/fd": {
      target: "https://api.football-data.org/v4",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/fd/, ""),
      configure: attachFootballToken,
    },
    "/api/pulse-google": {
      target: "https://news.google.com",
      changeOrigin: true,
      rewrite: () =>
        "/rss/search?q=Manchester+United+(transfer+OR+signs+OR+signed+OR+joins+OR+joined+OR+loan+OR+deal+OR+bid)&hl=en-AU&gl=AU&ceid=AU:en",
    },
    "/api/pulse-guardian": {
      target: "https://www.theguardian.com",
      changeOrigin: true,
      rewrite: () => "/football/manchester-united/rss",
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
    preview: { proxy },
  };
});
