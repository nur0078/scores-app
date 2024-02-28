import { useState, useEffect } from "react";
import { fetchLastFixtures, liveFixtures, getTeamNickname } from "../constants";

const Billboard = () => {
  const [boardScore, setBoardScore] = useState([]);
  const [isLive, setIsLive] = useState(false);

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
        console.error(error);
      }
    };
    fetchLive();
  }, []);

  console.log("boardScore", boardScore);

  return (
    <div className="rounded-3xl bg-pale-blue shadow-2xl p w-[400px] h-[400px] lg:h-[450px]">
      {boardScore.length > 0 && (
        <div className="justify-center items-center">
          {/*============ Top Bins ============ */}
          <div className="flex-col text-left py-4">
            {/* =========== League and Week Info =========== */}
            <div className="flex justify-between items-center ">
              <span className="flex items-center">
                <img
                  src={boardScore[0].league.logo}
                  alt="League logo"
                  className="w-[30px] ml-4"
                />
                <div className="flex items-center text-md font-semibold ml-2">
                  {boardScore[0].league.name}
                </div>
              </span>
              <span
                id="live-status"
                className="whitespace-no-wrap mr-4"
              >
                {isLive ? "Live" : "GW " + boardScore[0].league.round.slice(-2)}
              </span>
            </div>
          </div>

          {/* SCOREBOARD */}
          <div className="flex items-center justify-between pt-6">

            {/* HOME TEAM */}
            <div className="flex justify-center">
              <img
                src={boardScore[0].teams.home.logo}
                alt="home team logo"
                className="mx-2 w-[150px] h-[150px]"
              />
            </div>
            {/* SCORES */}
            <div className="flex items-center gap-4">
              {/* HOME GOALS */}
              <div className="text-4xl font-bold">
                {boardScore[0].goals.home}
              </div>
              <div className="flex-none flex items-center justify-center h-8 w-8 bg-gray-300 rounded-full">
                vs
              </div>
              {/* AWAY GOALS */}
              <div className="text-4xl font-bold">
                {boardScore[0].goals.away}
              </div>
            </div>

            {/* AWAY TEAM */}
            <div className="flex justify-center">
              <img
                src={boardScore[0].teams.away.logo}
                alt="away team logo"
                className="w-[150px] h-[150px]"
              />
            </div>
          </div>

          {/* Game Time */}
          <div className="font-bold">
            {boardScore[0].fixture &&
              (boardScore[0].fixture.status.short
                ? boardScore[0].fixture.status.short
                : boardScore[0].fixture.status.elapsed)}
            <br />
            <span className="font-medium">
              {isLive ? "GW " + boardScore[0].league.round.slice(-2) : ""}
            </span>
          </div>

          {/* Lower Text, Team Name Stadium */}
          <div className="text-center py-3 flex gap-5">
            {/* Home team name */}
            <div className="flex-1 text-2xl font-semibold">
              {getTeamNickname(boardScore[0].teams.home.name, 900)}
            </div>
            
            {/* Stadium */}
            <div className="text-sm leading-5 text-gray-600">
              {boardScore[0].fixture.venue.name}
            </div>

            {/* Away team name */}
            <div className="flex-1 text-2xl font-semibold">
            {getTeamNickname(boardScore[0].teams.away.name, 900)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billboard;
