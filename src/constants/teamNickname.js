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
        default:
            return teamName;
    }
}
