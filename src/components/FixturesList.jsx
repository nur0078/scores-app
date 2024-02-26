import { useState, useEffect } from "react";
import axios from 'axios';


const FixturesList = () => {
  const [fixturesData, setFixturesData] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
          params: {
            league: '39',
            team: '33',
            next: '50',
            timezone: 'Australia/Sydney' // or 'AEDT'
          },
          headers: {
            'X-RapidAPI-Key': 'aca8ddfae3mshc7b114110d6fd47p199982jsneb68fbb1d89b',
            'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
          }
        });
        setFixturesData(response.data.response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFixtures();
  }, []);

  // Function to format time to 24-hour format
  const formatTime = (timeString) => {
    const dateTime = new Date(timeString);
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="">
      <ul role="list" className="divide-y divide-gray-100  ">
        <div className="">
          {fixturesData.map((game) => (
            <li
              key={game.fixture.id}
              className="p-4 justify-between  border-2 border-slate-400 rounded-lg my-3 flex items-center"
            >
              {/* Home Team */}
              <div className="flex items-center gap-2">
                {/* Home team logo */}
                <img
                  id="homeLogo"
                  className="h-8 w-8 flex rounded-full bg-gray-50 "
                  src={game.teams.home.logo}
                  alt="home team logo"
                />
                {/* Home team name */}
                <h2 className=""> {game.teams.home.name}</h2>
              </div>

              {/* Game INFO  */}
              <div className="min-w-0 flex-auto flex-col items-center justify-center">
                {/* Kick-off Time */}
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {formatTime(game.fixture.date)}
                </p>
                <small className="text-xs leading-5 text-gray-500"> {game.fixture.venue.name}</small>
              </div>

              {/* Away TEAM */}
              <div className="flex items-center gap-2">
                {/* Away team name */}
                <h2 className=""> {game.teams.away.name}</h2>
                {/* Away team logo */}
                <img
                  id="awayLogo"
                  className="h-8 w-8 flex rounded-full bg-gray-50 "
                  src={game.teams.away.logo}
                  alt="away team logo"
                />
              </div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default FixturesList;
