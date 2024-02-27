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



export const logo = {
    ucl: "https://media.api-sports.io/football/leagues/2.png",
    championship: "https://media.api-sports.io/football/leagues/40.png",
    europa: "https://media.api-sports.io/football/leagues/3.png",
    conference:"https://media.api-sports.io/football/leagues/848.png",
}



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


