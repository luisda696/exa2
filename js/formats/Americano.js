export default class AmericanoFormat {
  constructor(players, pointsTarget = 16) {
    this.players = players;
    this.pointsTarget = pointsTarget; // 16, 24 o 32
    this.history = [];
  }

  generateSchedule() {
    // Rotación de parejas: cada jugador juega con diferentes compañeros
    const schedule = [];
    const playerIds = this.players.map(p => p.id);

    // Mezclar jugadores para rotación
    const shuffled = [...playerIds].sort(() => Math.random() - 0.5);

    // Crear rondas (cada ronda empareja a todos los jugadores)
    for (let round = 0; round < this.players.length - 1; round++) {
      const matches = [];
      for (let i = 0; i < shuffled.length; i += 2) {
        if (i + 1 < shuffled.length) {
          matches.push({
            player1: shuffled[i],
            player2: shuffled[i + 1],
            round: round + 1,
            points1: 0,
            points2: 0
          });
        }
      }
      schedule.push(matches);

      // Rotar parejas para la siguiente ronda
      shuffled.push(shuffled.shift());
    }

    return schedule;
  }

  updateStandings(matches) {
    const standings = {};
    this.players.forEach(player => {
      standings[player.id] = {
        ...player,
        totalPoints: 0,
        matchesPlayed: 0
      };
    });

    matches.forEach(match => {
      standings[match.player1].matchesPlayed++;
      standings[match.player2].matchesPlayed++;
      standings[match.player1].totalPoints += match.points1;
      standings[match.player2].totalPoints += match.points2;
    });

    return Object.values(standings)
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }
}
