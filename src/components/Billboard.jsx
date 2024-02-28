import { useState, useEffect } from "react";
import { fetchLastFixtures, liveFixtures, getTeamNickname } from "../constants";

const Billboard = () => {
  // State to store scoreboard data
  const [boardScore, setBoardScore] = useState([]);
  // State to track whether the game is live
  const [isLive, setIsLive] = useState(false);

  // Effect to fetch live or last game data when component mounts
  useEffect(() => {
    const fetchLive = async () => {
      try {
        const liveData = await liveFixtures();
        if (liveData.length > 0) {
          setBoardScore(liveData);
          setIsLive(true);
        } else {
          const lastGameData = await fetchLastFixtures(1);
          setBoardScore(lastGameData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLive();
  }, []);

  return (
    <div className="rounded-3xl bg-pale-blue shadow-2xl p-4 md:w-96 md:h-96 lg:w-96 lg:h-96">
      {boardScore.length > 0 && (
        <div className="justify-center items-center">
          {/* League and Week Info */}
          <div className="flex-col text-left py-4">
            <div className="flex justify-between items-center">
              {/* League logo and name */}
              <span className="flex items-center">
                <img src={boardScore[0].league.logo} alt="League logo" className="w-8 h-8 ml-2" />
                <div className="flex items-center text-md font-semibold ml-2">
                  {boardScore[0].league.name}
                </div>
              </span>
              {/* Live status or game week */}
              <span id="live-status" className="whitespace-no-wrap mr-2">
                {isLive ? "Live" : "GW " + boardScore[0].league.round.slice(-2)}
              </span>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="flex items-center justify-between pt-4">
            {/* Home Team */}
            <div className="flex justify-center">
              <img
                src={boardScore[0].teams.home.logo}
                alt="home team logo"
                className="w-20 h-20 md:w-32 md:h-32 lg:w-50 lg:h-50"
              />
            </div>
            {/* Scores */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="text-lg md:text-2xl lg:text-3xl font-bold">{boardScore[0].goals.home}</div>
              <div className="flex-none flex items-center justify-center h-6 w-6 bg-gray-300 rounded-full">vs</div>
              <div className="text-lg md:text-2xl lg:text-3xl font-bold">{boardScore[0].goals.away}</div>
            </div>
            {/* Away Team */}
            <div className="flex justify-center">
              <img
                src={boardScore[0].teams.away.logo}
                alt="away team logo"
                className="w-20 h-20 md:w-32 md:h-32 lg:w-50 lg:h-50"
              />
            </div>
          </div>

          {/* Game Time */}
          <div className="font-bold text-sm md:text-base lg:text-lg">
            {boardScore[0].fixture && (boardScore[0].fixture.status.short ? boardScore[0].fixture.status.short : boardScore[0].fixture.status.elapsed)}
            <br />
            <span className="font-medium">{isLive ? "GW " + boardScore[0].league.round.slice(-2) : ""}</span>
          </div>

          {/* Lower Text, Team Name, Stadium */}
          <div className="text-center py-3 flex gap-2 md:gap-5">
            {/* Home team name */}
            <div className="flex-1 text-lg md:text-xl lg:text-2xl font-semibold">{getTeamNickname(boardScore[0].teams.home.name, 900)}</div>
            {/* Stadium */}
            <div className="text-xs md:text-sm lg:text-base leading-5 text-gray-600">{boardScore[0].fixture.venue.name}</div>
            {/* Away team name */}
            <div className="flex-1 text-lg md:text-xl lg:text-2xl font-semibold">{getTeamNickname(boardScore[0].teams.away.name, 900)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billboard;
