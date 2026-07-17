import { useCallback, useEffect, useState } from "react";
import Billboard from "./Billboard";
import Standings from "./Standings";
import FixturesList from "./FixturesList";
import Pulse from "./Pulse";
import Nav from "./Nav";
import MatchDetail from "./MatchDetail";
import {
  fetchPremierLeagueTable,
  fetchUnitedMatches,
  fetchUnitedPulse,
} from "../api/football";

const LIVE_POLL_MS = 60_000;

const Home = () => {
  const [matches, setMatches] = useState({
    live: null,
    last: null,
    upcoming: [],
    recent: [],
  });
  const [table, setTable] = useState([]);
  const [pulse, setPulse] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [loadingPulse, setLoadingPulse] = useState(true);
  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const loadMatches = useCallback(async ({ quiet } = {}) => {
    if (!quiet) setLoadingMatches(true);
    try {
      const data = await fetchUnitedMatches();
      setMatches(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError(
        err.message?.includes("403") || err.message?.includes("400")
          ? "Free API token missing or rejected. Register at football-data.org and put FOOTBALL_DATA_TOKEN in .env."
          : "Could not load United fixtures from the free API."
      );
    } finally {
      if (!quiet) setLoadingMatches(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();

    fetchPremierLeagueTable()
      .then(setTable)
      .catch((err) => console.error(err))
      .finally(() => setLoadingTable(false));

    fetchUnitedPulse()
      .then(setPulse)
      .catch((err) => console.error(err))
      .finally(() => setLoadingPulse(false));
  }, [loadMatches]);

  useEffect(() => {
    if (!matches.live) return undefined;
    const id = setInterval(() => loadMatches({ quiet: true }), LIVE_POLL_MS);
    return () => clearInterval(id);
  }, [matches.live, loadMatches]);

  const boardMatch = matches.live || matches.last || matches.upcoming[0] || null;
  const isLive = Boolean(matches.live);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-10 font-body">
      <Nav />
      <Billboard
        match={boardMatch}
        isLive={isLive}
        loading={loadingMatches}
        error={error}
        onSelectMatch={setSelectedMatch}
      />
      <Pulse items={pulse} loading={loadingPulse} />
      <FixturesList
        upcoming={matches.upcoming}
        recent={matches.recent}
        loading={loadingMatches}
        onSelectMatch={setSelectedMatch}
      />
      <Standings table={table} loading={loadingTable} />
      <footer className="mt-12 border-t border-white/10 pt-4 text-left text-xs text-united-mist">
        Powered by free{" "}
        <a
          className="text-united-gold underline-offset-2 hover:underline"
          href="https://www.football-data.org/"
          target="_blank"
          rel="noreferrer"
        >
          football-data.org
        </a>
        , TheSportsDB, Google News &amp; The Guardian. No RapidAPI.
      </footer>

      {selectedMatch && (
        <MatchDetail
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </div>
  );
};

export default Home;
