export default class EliminationFormat {
  constructor(teams) {
    this.teams = teams;
    this.allowsDraws = false;
  }

  generateBracket() {
    // Generar bracket de eliminación directa
    const bracket = [];
    let currentRound = this.teams;

    while (currentRound.length > 1) {
      const nextRound = [];
      for (let i = 0; i < currentRound.length; i += 2) {
        if (i + 1 < currentRound.length) {
          nextRound.push({
            team1: currentRound[i],
            team2: currentRound[i + 1],
            winner: null
          });
        }
      }
      bracket.push(nextRound);
      currentRound = nextRound.map(match => match.winner).filter(Boolean);
    }

    return bracket;
  }
}
