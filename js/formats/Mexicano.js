export default class MexicanoFormat {
  constructor(teams) {
    this.teams = teams;
  }

  calculatePairings() {
    // Ordenar equipos por puntos acumulados (de mayor a menor)
    const sortedTeams = [...this.teams].sort((a, b) => b.points - a.points);

    // Emparejar: 1° vs 4°, 2° vs 3° (o similar)
    const pairings = [];
    for (let i = 0; i < sortedTeams.length; i += 2) {
      if (i + 1 < sortedTeams.length) {
        pairings.push({
          team1: sortedTeams[i],
          team2: sortedTeams[i + 1]
        });
      }
    }
    return pairings;
  }
}
