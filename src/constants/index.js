export function getTeamNickname(teamName) {

    switch (teamName.toLowerCase()) {

        case "aston villa":
            return "A. Villa";
        case "crystal palace":
            return "C. Palace";

        case "leeds united":
            return "Leeds";
        case "manchester city":
        case "man city":
            return "Man City";
        case "manchester united":
            return "Man Utd";

        case "tottenham":
            return "Spurs";
        case "west ham united":
            return "West Ham";
        case "wolverhampton wanderers":
        case "wolves":
            return "Wolves";
        case "sheffield utd":
            return "Sheffield";
        case "nottingham forest":
            return "Nottingham"
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


