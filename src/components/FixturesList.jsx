import { useState, useEffect } from "react";
import { fetchNextFixtures, formatDate, formatTime, getTeamNickname } from '../constants';

const FixturesList = () => {
  // State to store fixtures data
  const [fixturesData, setFixturesData] = useState([]);

  useEffect(() => {
    // Fetch fixtures data when component mounts
    const fetchData = async () => {
      try {
        const data = await fetchNextFixtures(4);
        setFixturesData(data);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      {/* Render list of fixtures */}
      <ul role="list" className="divide-y divide-gray-100">
        {fixturesData.map((game) => (
          <li key={game.fixture.id} className="flex items-center justify-between my-3 shadow-md rounded-lg">
            {/* Home Team */}
            <div className="flex items-center">
              {/* Home team logo */}
              <img
                className="h-10 w-10 mx-2 rounded-full bg-gray-50"
                src={game.teams.home.logo}
                alt="home team logo"
              />
              {/* Home team name */}
              <h2>{getTeamNickname(game.teams.home.name)}</h2>
            </div>
  
            {/* Game INFO */}
            <div className="py-4 mx-6">
              {/* Date */}
              <div className="text-lg leading-6 text-gray-600">{formatDate(game.fixture.date)}</div>
              {/* League name */}
              <div className="text-sm font-semibold">{game.league.name}</div>
              {/* Kick-off Time */}
              <p className="text-sm font-semibold leading-6 text-gray-900 py-2">
                {formatTime(game.fixture.date)}
              </p>
              {/* Stadium */}
              <small className="text-sm leading-5 text-gray-500">{game.fixture.venue.name}</small>
            </div>
  
            {/* Away TEAM */}
            <div className="flex items-center">
              {/* Away team name */}
              <h2>{getTeamNickname(game.teams.away.name)}</h2>
              {/* Away team logo */}
              <img
                className="h-10 w-10 mx-2 rounded-full bg-gray-50"
                src={game.teams.away.logo}
                alt="away team logo"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FixturesList;
