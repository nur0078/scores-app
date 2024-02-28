import { useState, useEffect } from "react";
import axios from "axios";
import { getTeamNickname, qualifiedLeague } from "../constants";

const Standings = () => {
  const [tableData, setTableData] = useState([]);
  const [userWidth, setUserWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setUserWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchTable = async () => {
      try {
        const response = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/standings",
          {
            params: {
              season: (new Date().getFullYear() - 1).toString(),
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
        console.error("Error fetching table data:", error);
      }
    };
    fetchTable();
  }, []);

  const isRelegated = (rank) => {
    let setStyle = "border-b-2 border-gray-200 text-center font-inter text-sm ";

    if (rank > 17) {
      setStyle += "bg-red-100 text-red-700";
    } else if (rank < 5) {
      setStyle += "bg-green-100 text-green-700";
    } else if (rank < 7) {
      setStyle += "bg-yellow-100 text-yellow-700";
    } else {
      setStyle += "bg-gray-100 text-gray-700";
    }
    return setStyle;
  };

  const isLogoNeeded = (rank) => {
    if (rank < 6 || rank > 17) {
      return (
        <div className="flex w-full  h-full">
          <img
            src={qualifiedLeague(rank)}
            className=""
            alt="cup logo"
            width="15px"
            height="15px"
          />
        </div>
      );
    }
  };

  const renderTeamName = (teamName) => {
    if (userWidth >= 1024) {
      return teamName;
    } else if (userWidth >= 768) {
      return getTeamNickname(teamName, userWidth);
    } else {
      return getTeamNickname(teamName, userWidth).substr(0, 3);
    }
  };

  return (
    <div id="standings-child" className="flex text-sm pt-10">
      <div className="overflow-x-auto w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2">#</th>
              <th className="py-2 text-left">Club</th>
              <th className="py-2">MP</th>
              <th className="py-2">W</th>
              <th className="py-2">D</th>
              <th className="py-2">L</th>
              <th className="py-2">GD</th>
              <th className="py-2">Pts</th>
              <th className="py-2 text-left hidden md:table-cell">Form</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((club) => (
              <tr key={club.rank} className={isRelegated(club.rank)}>
                <td className="py-2">{club.rank}</td>
                <td className="py-2 flex items-center text-left">
                  <div>{renderTeamName(club.team.name)}</div>
                  <div className="ml-auto">{isLogoNeeded(club.rank)}</div>
                </td>
                <td className="py-2 text-center">{club.all.played}</td>
                <td className="py-2 text-center">{club.all.win}</td>
                <td className="py-2 text-center">{club.all.draw}</td>
                <td className="py-2 text-center">{club.all.lose}</td>
                <td className="py-2 text-center">{club.goalsDiff}</td>
                <td className="py-2 font-bold text-center">{club.points}</td>
                <td className="py-2 font-bold hidden md:table-cell text-left">
                  {club.form}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Standings;
