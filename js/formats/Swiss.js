export default class SwissFormat {
  constructor(teams) {
    this.teams = teams;
    this.history = [];
  }

  generateRound() {
    // Ordenar por puntos (de mayor a menor)
    const sortedTeams = [...this.teams].sort((a, b) => b.points - a.points);

    const pairings = [];
    const usedTeams = new Set();

    // Emparejar equipos con registros similares
    for (let i = 0; i < sortedTeams.length; i++) {
      if (usedTeams.has(sortedTeams[i].id)) continue;

      for (let j = i + 1; j < sortedTeams.length; j++) {
        if (usedTeams.has(sortedTeams[j].id)) continue;

        // Verificar que no se hayan enfrentado antes
        if (!this.hasPlayedBefore(sortedTeams[i].id, sortedTeams[j].id)) {
          pairings.push({
            team1: sortedTeams[i],
            team2: sortedTeams[j]
          });
          usedTeams.add(sortedTeams[i].id);
          usedTeams.add(sortedTeams[j].id);
          break;
        }
      }
    }

    return pairings;
  }

  hasPlayedBefore(teamId1, teamId2) {
    return this.history.some(match =>
      (match.team1 === teamId1 && match.team2 === teamId2) ||
      (match.team1 === teamId2 && match.team2 === teamId1)
    );
  }
}
