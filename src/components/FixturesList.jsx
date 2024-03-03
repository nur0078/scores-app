import { useState, useEffect } from "react";
import { fetchNextFixtures, formatDate, formatTime, getTeamNickname } from '../constants';

// FixturesList component displays a list of upcoming fixtures
const FixturesList = () => {
  // State to store fixtures data
  const [fixturesData, setFixturesData] = useState([]);

  // Fetch fixtures data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch next 4 fixtures
        const data = await fetchNextFixtures(4);
        setFixturesData(data);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      }
    };
    fetchData();
  }, []);

  // Render FixturesList UI
  return (
    <div className="flex px-2 ">
      {/* Render list of fixtures */}
      <ul role="list" className="divide-y divide-gray-100 ">
        {fixturesData.map((game) => (
          <li
            key={game.fixture.id}
            className="justify-between my-3 grid grid-cols-3 items-center shadow-md rounded-lg min-w-fit bg-pale-blue"
          >
            {/* Home Team */}
            <div className="flex items-center">
              {/* Home team logo */}
              <img
                id="homeLogo"
                className="h-10 w-10 mx-2 rounded-full bg-gray-50"
                src={game.teams.home.logo}
                alt="home team logo"
              />
              {/* Home team name */}
              <h2 className="md:ml-1">{getTeamNickname(game.teams.home.name, 1000)}</h2>
            </div>

            {/* Game INFO  */}
            <div className="">
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
            <div className="flex items-center justify-end mx-2">
              {/* Away team name */}
              <h2 className="md:mr-2">{getTeamNickname(game.teams.away.name, 1000)}</h2>
              {/* Away team logo */}
              <img
                id="awayLogo"
                className="h-10 w-10 flex rounded-full bg-gray-50 mx-1"
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