import { useState, useEffect } from "react";
import axios from 'axios';
import { getTeamNickname } from '../constants'


const FixturesList = () => {
  const [fixturesData, setFixturesData] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
          params: {
            league: '39',
            team: '33',
            next: '5',
            timezone: 'Australia/Sydney'
          },
          headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY,
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

  // Format for date
  const formatDate = (dateString) => {
    const dateTime = new Date(dateString);
    const month = dateTime.toLocaleString('default', { month: 'short' });
    const day = dateTime.getDate().toString().padStart(2, '0');
    return `${month} ${day}`;
  };

  // Function to format time to 24-hour format
  const formatTime = (timeString) => {
    const dateTime = new Date(timeString);
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="flex">
      <ul role="list" className="divide-y divide-gray-100 ">
        {fixturesData.map((game) => (
          <li
            key={game.fixture.id}
            className="justify-between my-3  grid grid-cols-3 items-center shadow-md rounded-lg min-w-fit "
          >
            {/* Home Team */}
            <div className="flex items-center ">
              {/* Home team logo */}
              <img
                id="homeLogo"
                className="h-10 w-10 mx-2 rounded-full bg-gray-50 "
                src={game.teams.home.logo}
                alt="home team logo"
              />
              {/* Home team name */}
              <h2 className="">{getTeamNickname(game.teams.home.name)}</h2>
            </div>
  
            {/* Game INFO  */}
            <div className="py-4 mx-6">
              {/* Date */}
              <div className=" text-lg leading-6 text-gray-600">{formatDate(game.fixture.date)}</div>
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
              <h2>{getTeamNickname(game.teams.away.name)}</h2>
              {/* Away team logo */}
              <img
                id="awayLogo"
                className="h-10 w-10 flex rounded-full bg-gray-50 mx-1"
                src={game.teams.away.logo}
              />
            </div>
          </li>
          
        ))}
      </ul>
    </div>
    
  );
        }  

export default FixturesList;
