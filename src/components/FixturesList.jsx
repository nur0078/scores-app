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
    <div className="">
      <ul role="list" className="divide-y divide-gray-100 ">
        {fixturesData.map((game) => (
          <li
            key={game.fixture.id}
            className="justify-around  my-3 flex items-center shadow-md rounded-lg w-full"
          >
            {/* Home Team */}
            <div className="flex items-center gap-2 min-w-[0%]">
              {/* Home team logo */}
              <img
                id="homeLogo"
                className="h-12 w-12 flex rounded-full bg-gray-50"
                src={game.teams.home.logo}
                alt="home team logo"
              />
              {/* Home team name */}
              <h2 className="pl-4">{game.teams.home.name}</h2>
            </div>
  
            {/* Game INFO  */}
            
            <div className="min-w-[20%]">
              {/* Date */}
              <div className="font-semibold leading-6 text-gray-900">{formatDate(game.fixture.date)}</div>
              {/* Kick-off Time */}
              <p className="text-sm font-semibold leading-6 text-gray-900 py-2">
                {formatTime(game.fixture.date)}
              </p>
              <small className="text-xs leading-5 text-gray-500">{game.fixture.venue.name}</small>
            </div>
  
            {/* Away TEAM */}
            <div className="flex items-center gap-2 min-w-[20%]">
              {/* Away team name */}
              <h2>{game.teams.away.name}</h2>
              {/* Away team logo */}
              <img
                id="awayLogo"
                className="h-12 w-12 flex rounded-full bg-gray-50"
                src={game.teams.away.logo}
                alt="away team logo"
              />
            </div>
          </li>
          
        ))}
      </ul>
    </div>
    
  );
        }  

export default FixturesList;
