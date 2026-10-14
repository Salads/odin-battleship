
const Team = {
	Team1: 1,
	Team2: 2
};

Team.getEnemyTeam = Object.freeze((team) => {
	if(team === Team.Team1) {
		return Team.Team2;
	}
	else if(team === Team.Team2) {
		return Team.Team1;
	}

	throw new Error("Invalid Team!");
});

Object.freeze(Team);

export { Team };