// js/formats/Americano.js
// Sistema Americano: rotación de parejas, puntos por partido, ranking individual
// CORRECCIÓN ERROR 10: NO usa sets/games tradicionales, usa sistema de puntos por partido

import { Sanitizer } from '../security/Sanitizer.js';

export class Americano {
  constructor(players, config) {
    // Americano opera con jugadores individuales, no equipos fijos
    this.players = players.filter(p => !p.isBye);
    this.config = config;
    this.pointsPerMatch = config.americanoPointsPerMatch || 16; // 16, 24, 32
  }

  generate() {
    const n = this.players.length;
    if (n < 2) return [];

    // Generar rondas de rotación (cada jugador juega con diferentes compañeros)
    const matches = [];
    let matchId = 0;
    const rounds = n - 1; // Número de rondas

    for (let r = 0; r < rounds; r++) {
      // Algoritmo de rotación de círculo (round-robin de dobles)
      const playersCopy = [...this.players];
      // Rotar jugadores excepto el primero (fijo) para generar emparejamientos
      if (r > 0) {
        const last = playersCopy.pop();
        playersCopy.splice(1, 0, last);
      }

      // Formar parejas: 1+2 vs 3+4, 5+6 vs 7+8, etc.
      for (let i = 0; i < playersCopy.length; i += 4) {
        if (i + 3 < playersCopy.length) {
          const team1 = [playersCopy[i], playersCopy[i + 1]];
          const team2 = [playersCopy[i + 2], playersCopy[i + 3]];
          matches.push({
            id: `americano_${r}_${matchId++}`,
            round: r,
            t1: team1.map(p => p.id),
            t2: team2.map(p => p.id),
            t1name: team1.map(p => p.name).join(' / '),
            t2name: team2.map(p => p.name).join(' / '),
            // En Americano no se usan sets, se guardan los puntos del partido
            points: { t1: 0, t2: 0 },
            done: false,
            winner: null,
            court: ((matchId % this.config.numCourts) || 1) + 1,
            isAmericano: true
          });
        }
      }
    }

    return matches;
  }

  // CORRECCIÓN ERROR 10: Calcular puntos individuales acumulados
  calculateStandings(matches) {
    const playerStats = {};
    this.players.forEach(p => {
      playerStats[p.id] = {
        id: p.id,
        name: p.name,
        totalPoints: 0,
        matchesPlayed: 0,
        wins: 0,
        losses: 0
      };
    });

    matches.forEach(m => {
      if (!m.done) return;
      const t1Points = m.points.t1;
      const t2Points = m.points.t2;
      const winner = t1Points > t2Points ? 't1' : 't2';

      m.t1.forEach(pid => {
        if (playerStats[pid]) {
          playerStats[pid].matchesPlayed++;
          playerStats[pid].totalPoints += t1Points;
          if (winner === 't1') playerStats[pid].wins++;
          else playerStats[pid].losses++;
        }
      });
      m.t2.forEach(pid => {
        if (playerStats[pid]) {
          playerStats[pid].matchesPlayed++;
          playerStats[pid].totalPoints += t2Points;
          if (winner === 't2') playerStats[pid].wins++;
          else playerStats[pid].losses++;
        }
      });
    });

    // Ordenar por puntos totales
    return Object.values(playerStats).sort((a, b) => b.totalPoints - a.totalPoints);
  }

  // CORRECCIÓN ERROR 4: Permite empates (si se empatan puntos, se comparte)
  allowsDraws() {
    return true;
  }

  // CORRECCIÓN ERROR 13: Ocultar columnas de sets/games
  showDetailedStats() {
    return false;
  }

  // CORRECCIÓN ERROR 5: No tiene método _advance
  // (eliminado explícitamente)
}
