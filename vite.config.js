import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

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
    });
  };

  const proxy = {
    "/api/fd": {
      target: "https://api.football-data.org/v4",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/fd/, ""),
      configure: attachFootballToken,
    },
    // Globally available aggregated headlines (works in AU)
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
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  };
});
