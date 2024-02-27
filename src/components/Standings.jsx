import { useState, useEffect } from "react";
import axios from "axios";
import { getTeamNickname, qualifiedLeague } from '../constants'

// Dynamic league season
var currentDate = new Date();
// Get the current year
var currentYear = currentDate.getFullYear();

// Row color for relegation
const isRelegated = (rank) => {
  let setStyle = "justify-between pb-4 grid grid-cols-9 md:divide-y md:divide-gray-800  font-inter text-md "

  if (rank > 17) {
    setStyle = setStyle + "bg-red-300"
    
  } else if (rank < 5 ) {
    setStyle = setStyle + "bg-green-200"
  } else if (rank < 7) {
    setStyle = setStyle + 'bg-orange-100'

  } else {
    setStyle = setStyle + "bg-slate-100"
  }
  return setStyle
}

//Qualified League logo
const isLogoNeeded = (rank) => {
    if (rank < 6 && rank < 18) {
    return (
      <span className="w-8 h-8 pl-2 pt-1"> 
        <img
          src={qualifiedLeague(rank)}
          className="invisible md:visible"
          alt="cup logo" 
          width='15px'
          height='15px'
          />
      </span> 
    )
  }
}



const Standings = () => {
  const [tableData, setTableData] = useState([]);
  const [userWidth, setUserWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setUserWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/standings",
          {
            params: {
              season: (currentYear-1) ? (currentYear-1).toString() : (currentYear-2).toString(),
              league: "39",
            },
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
          }
        );
        setTableData(response.data.response[0].league.standings[0]);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTable();
  }, []);

  return (
    <div id="standings-child" className="flex text-sm pt-10">
      <table className="">
        <thead>
          <tr className="justify-between grid grid-cols-9 w-full py-5 shadow-md text-xl text-white font-inter bg-slate-400">
            <th >#</th>
            <th>Club</th>
            <th>MP</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
            <th className="invisible md:visible">Form</th>
          </tr>
        </thead>
        {tableData.map((club) => (
          <tr
            key={club.rank}
            className={isRelegated(club.rank)}>
            <td>{club.rank}</td>
            <td className=" flex text-left font-bold ">
              {getTeamNickname(club.team.name, userWidth)}  
              {isLogoNeeded(club.rank)}
              </td>
            <td className="text-right md:text-center">{club.all.played}</td>
            <td>{club.all.win}</td>
            <td >{club.all.draw}</td>
            <td >{club.all.lose}</td>
            <td >{club.goalsDiff}</td>
            <td className="font-bold">{club.points}</td>
            <td className="text-center invisible md:visible">{club.form}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
export default Standings;
