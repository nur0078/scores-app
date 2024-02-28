import { useState, useEffect } from "react";
import { fetchLastFixtures, liveFixtures, getTeamNickname } from "../constants";

// Billboard component displays live or last game data
const Billboard = () => {
    // State to store scoreboard data
    const [boardScore, setBoardScore] = useState([]);
    // State to track whether the game is live
    const [isLive, setIsLive] = useState(false);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch live game data
                const liveData = await liveFixtures();
                if (liveData.length > 0) {
                    // Set board score and mark as live if live data available
                    setBoardScore(liveData);
                    setIsLive(true);
                } else {
                    // If no live data, fetch last game data
                    const lastGameData = await fetchLastFixtures(1);
                    setBoardScore(lastGameData);
                }
            } catch (error) {
                // Log any errors that occur during data fetching
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Render Billboard UI
    return (
        <div className="rounded-3xl bg-pale-blue shadow-2xl mx-3">
            {boardScore.length > 0 && (
                <div className="justify-center items-center">
                    {/* Render League Info */}
                    <div className="flex-col text-left py-4">
                        <div className="flex justify-between items-center">
                            {/* League Logo and Name */}
                            <span className="flex items-center">
                                <img src={boardScore[0].league.logo} alt="League logo" className="w-8 ml-4" />
                                <div className="flex items-center text-md font-semibold ml-2">
                                    {boardScore[0].league.name}
                                </div>
                            </span>
                            {/* Live status or Game week */}
                            <span id="live-status" className="font-semibold pr-6">
                                {isLive ? "Live" : "GW " + boardScore[0].league.round.slice(-2)}
                            </span>
                        </div>
                    </div>
                    {/* Render Scoreboard */}
                    <div className="flex items-center justify-between">
                        {/* Home Team */}
                        <div className="ml-2">
                            <img src={boardScore[0].teams.home.logo} alt="home team logo" />
                        </div>
                        {/* Scores */}
                        <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold mx-2 pl-2">{boardScore[0].goals.home}</div>
                            <div className="flex items-center justify-center h-8 w-8 bg-gray-300 rounded-full">vs</div>
                            <div className="text-4xl font-bold ">{boardScore[0].goals.away}</div>
                        </div>
                        {/* Away Team */}
                        <div>
                            <img src={boardScore[0].teams.away.logo} alt="away team logo" />
                        </div>
                    </div>
                    {/* Render Game Time */}
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
                    {/* Render Team Details */}
                    <div className="items-center pb-3 px-2 flex gap-3">
                        {/* Home Team Name */}
                        <div className="flex-1 text-xl md:text-2xl font-semibold">
                            {getTeamNickname(boardScore[0].teams.home.name, 900)}
                        </div>
                        {/* Stadium */}
                        <div className="text-sm leading-5 text-gray-600">
                            {boardScore[0].fixture.venue.name}
                        </div>
                        {/* Away Team Name */}
                        <div className="flex-1 text-xl md:text-2xl font-semibold">
                            {getTeamNickname(boardScore[0].teams.away.name, 900)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billboard;
