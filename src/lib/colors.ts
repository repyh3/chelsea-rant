export const teamColors: Record<string, string> = {
    "Arsenal": "#EF0107",
    "Aston Villa": "#670E36",
    "Bournemouth": "#DA291C",
    "Brentford": "#E30613",
    "Brighton": "#0057B8",
    "Chelsea": "#034694",
    "Crystal Palace": "#1B458F",
    "Everton": "#003399",
    "Fulham": "#000000",
    "Ipswich": "#3A4EA1",
    "Leicester": "#003090",
    "Liverpool": "#C8102E",
    "Man City": "#6CABDD",
    "Man Utd": "#DA291C",
    "Newcastle": "#241F20",
    "Nott'm Forest": "#DD0000",
    "Southampton": "#D71920",
    "Tottenham": "#132257",
    "West Ham": "#7A263A",
    "Wolves": "#FDB913",
    "default": "#2c3e50"
};

export const getTeamColor = (name: string): string => {
    return teamColors[name] || teamColors["default"];
};
