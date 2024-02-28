import axios from 'axios';

// Function to fetch live fixtures
export async function liveFixtures() {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
        live:'all',
        team: '33',
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY, // Access RapidAPI key from environment variables
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });
    return response.data.response; // Return live fixtures data
  } catch (error) {
    console.error(error);
    return null; // Return null or handle error as needed
  }
}

// Function to fetch next (numOfFixtures) fixtures
export async function fetchNextFixtures(numOfFixtures) {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
          team: '33',
          next: JSON.stringify(numOfFixtures),
          timezone: 'Australia/Sydney'
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });
    return response.data.response; // Return next fixtures data
  } catch (error) {
    console.error(error);
    return null; // Return null or handle error as needed
  }
}

// Function to fetch last (numOfFixtures) fixtures.. eg: for Billboard, numOfFixtures=1
export async function fetchLastFixtures(numOfFixtures) {
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: {
          team: '33',
          last: JSON.stringify(numOfFixtures),
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_REACT_APP_RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      }
    });
    return response.data.response; // Return last fixtures data
  } catch (error) {
    console.error(error);
    return null; // Return null or handle error as needed
  }
}
 
// Function to get team nickname based on viewport size
export function getTeamNickname(teamName, viewPort) {
    const isTablet = viewPort < 1024; // Adjust the tablet threshold according to your requirements
    const isMobile = viewPort < 768; // Adjust the mobile threshold according to your requirements

    switch (teamName.toLowerCase()) {
        case "arsenal":
            return isMobile ? "ARS" : (isTablet ? "Arsenal" : "Arsenal");
        case "aston villa":
            return isMobile ? "AVL" : (isTablet ? "A. Villa" : "Aston Villa");
        case "bournemouth":
            return isMobile ? "BOU" : (isTablet ? "B'mouth" : "Bournemouth");
        case "brighton":
            return isMobile ? "BRI" : (isTablet ? "Brighton" : "Brighton");
        case "brentford":
            return isMobile ? "BRE" : (isTablet ? "Brentford" : "Brentford");
        case "burnley":
            return isMobile ? "BUR" : (isTablet ? "Burnley" : "Burnley");
        case "chelsea":
            return isMobile ? "CHE" : (isTablet ? "Chelsea" : "Chelsea");
        case "crystal palace":
            return isMobile ? "CRY" : (isTablet ? "C. Palace" : "Crystal Palace");
        case "everton":
            return isMobile ? "EVE" : (isTablet ? "Everton" : "Everton");
        case "fulham":
            return isMobile ? "FUL" : (isTablet ? "Fulham" : "Fulham");
        case "leeds united":
            return isMobile ? "LEE" : (isTablet ? "Leeds" : "Leeds United");
        case "liverpool":
            return isMobile ? "LIV" : (isTablet ? "Liverpool" : "Liverpool");
        case "luton":
            return isMobile ? "LUT" : (isTablet ? "Luton" : "Luton");
        case "manchester city":
        case "man city":
            return isMobile ? "MCI" : (isTablet ? "Man City" : "Manchester City");
        case "manchester united":
            return isMobile ? "MUN" : (isTablet ? "Man Utd" : "Manchester United");
        case "newcastle":
            return isMobile ? "NEW" : (isTablet ? "Newcastle" : "Newcastle United");
        case "nottingham forest":
            return isMobile ? "NOT" : (isTablet ? "Nottingham" : "Nottingham Forest");
        case "sheffield utd":
            return isMobile ? "SHU" : (isTablet ? "Sheffield" : "Sheffield United");
        case "tottenham":
            return isMobile ? "TOT" : (isTablet ? "Spurs" : "Tottenham");
        case "west ham":
            return isMobile ? "WHU" : (isTablet ? "West Ham" : "West Ham United");
        case "wolverhampton wanderers":
        case "wolves":
            return isMobile ? "WOL" : (isTablet ? "Wolves" : "Wolverhampton Wanderers");
        default:
            return teamName;
    }
}


// Object containing league logos

export const logo = {
    ucl: "https://media.api-sports.io/football/leagues/2.png",
    championship: "https://media.api-sports.io/football/leagues/40.png",
    europa: "https://media.api-sports.io/football/leagues/3.png",
    conference:"https://media.api-sports.io/football/leagues/848.png",
}


  // Format for date in Month and Day
export const formatDate = (dateString) => {
    const dateTime = new Date(dateString);
    const month = dateTime.toLocaleString('default', { month: 'short' });
    const day = dateTime.getDate().toString().padStart(2, '0');
    return `${month} ${day}`;
  };

  // Function to format time to 24-hour format
export const formatTime = (timeString) => {
    const dateTime = new Date(timeString);
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

// Function to determine league logo based on team rank
export const qualifiedLeague = (teamRank) => {
    const rank = Number(teamRank)
    if (rank < 5) {
        return logo.ucl
    } else if (rank == 5) {
        return logo.europa
    } else if (rank > 17) {
        return logo.championship
    }
    
}


