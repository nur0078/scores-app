import { useState, useEffect } from "react";
import { fetchLastFixtures, formatDate, liveFixtures } from "../constants";

const Billboard = () => {
  const [boardScore, setBoardScore] = useState([]);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const liveData = await liveFixtures();
        if (liveData.length > 0) {
          setBoardScore(liveData);
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
    <div className="rounded-3xl bg-pale-blue shadow-2xl w-[400px] h-[400px] lg:h-[450px] border-2 border-yellow-500">
      {boardScore.length > 0 && (
        <div className="justify-center items-center">
          {/*============ Top Bins ============ */}
          <div className="flex-col text-left py-4">
            {/* =========== League and Week Info =========== */}
            <div id="leagueName" className="">
              <div className="flex justify-center border-2 border-red-500 items-center">
                <span className="flex justify-around mx-4 w-full ">
                  <img
                    src={boardScore[0].league.logo}
                    alt="League logo"
                    className="w-[60px] "
                  />
                  <div className="border-2 flex-1 text-center border-blue-500 text-md my-4">
                    {boardScore[0].league.name}
                  </div>
                </span>
                <span className="text-right mx-4">Live</span>
              </div>
              {/* ========== GameWeek ========== */}
              <small className="ml-4 text-sm">
                Gameweek {boardScore[0].league.round.slice(-2)}
              </small>
            </div>
          </div>

          {/* SCOREBOARD */}
          <div className="border-2 border-purple-500 flex items-center justify-between">
            {/* HOME TEAM */}
            <div className="border-2 border-blue-500 flex justify-center">
              <img
                src={boardScore[0].teams.home.logo}
                alt="home team logo"
                className="mx-2 w-[150px] h-[150px]"
              />
            </div>
            {/* SCORES */}
            <div className="flex items-center gap-4">
              {/* HOME GOALS */}
              <div className="text-4xl font-bold">{boardScore[0].goals.home}</div>
              <div className="flex-none flex items-center justify-center h-8 w-8 bg-gray-300 rounded-full">
                vs
              </div>
              {/* AWAY GOALS */}
              <div className="text-4xl font-bold">{boardScore[0].goals.away}</div>
            </div>

            {/* AWAY TEAM */}
            <div className="border-2 border-blue-500 flex justify-center">
              <img
                src={boardScore[0].teams.away.logo}
                alt="away team logo"
                className="w-[150px] h-[150px]"
              />
            </div>
          </div>

          {/* Game Time */}
          <div>
            {boardScore[0].fixture && (
              boardScore[0].fixture.status.short
                ? boardScore[0].fixture.status.short
                : (boardScore[0].fixture.status.elapsed)
            )}
          </div>

          {/* Lower Text, Team Name Stadium */}
          <div className="text-center py-3 flex gap-5 border-2 border-red-500 ">
            <div className="flex-1 font-bold">{boardScore[0].teams.home.name}</div>
            <div className="text-sm leading-5 text-gray-600">{boardScore[0].fixture.venue.name}</div>
            <div className="flex-1 font-bold">{boardScore[0].teams.away.name}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billboard;