// js/formats/Mexicano.js
// Sistema Mexicano: emparejamientos por nivel (puntos acumulados), rondas fijas
// CORRECCIÓN ERROR 18: No usar aleatorio, ordenar por ranking antes de emparejar

import { Sanitizer } from '../security/Sanitizer.js';

export class Mexicano {
  constructor(teams, config) {
    this.teams = teams.filter(t => !t.isBye);
    this.config = config;
    this.rounds = config.mexicanoRounds || Math.max(3, Math.floor(this.teams.length / 2));
  }

  generate() {
    const matches = [];
    let matchId = 0;

    for (let r = 0; r < this.rounds; r++) {
      // Calcular puntos acumulados por equipo (basado en resultados anteriores)
      const teamPoints = this._calculatePoints(matches.filter(m => m.round === r - 1));
      const ranked = [...this.teams].sort((a, b) => {
        const pa = teamPoints[a.id] || 0;
        const pb = teamPoints[b.id] || 0;
        return pb - pa;
      });

      // Emparejamiento por nivel: 1°+4° vs 2°+3°, etc.
      for (let i = 0; i < ranked.length; i += 4) {
        if (i + 3 < ranked.length) {
          const team1 = [ranked[i], ranked[i + 3]];
          const team2 = [ranked[i + 1], ranked[i + 2]];
          matches.push({
            id: `mexicano_${r}_${matchId++}`,
            round: r,
            t1: team1.map(t => t.id),
            t2: team2.map(t => t.id),
            t1name: team1.map(t => t.name).join(' / '),
            t2name: team2.map(t => t.name).join(' / '),
            sets: [],
            done: false,
            winner: null,
            court: ((matchId % this.config.numCourts) || 1) + 1,
            isMexicano: true
          });
        }
      }
    }

    return matches;
  }

  _calculatePoints(prevMatches) {
    const points = {};
    prevMatches.forEach(m => {
      if (!m.done) return;
      const winner = m.winner;
      const t1ids = m.t1;
      const t2ids = m.t2;
      const isT1Winner = winner && t1ids.includes(winner);
      t1ids.forEach(id => {
        points[id] = (points[id] || 0) + (isT1Winner ? this.config.ptsWin : this.config.ptsLoss);
      });
      t2ids.forEach(id => {
        points[id] = (points[id] || 0) + (!isT1Winner && winner ? this.config.ptsWin : this.config.ptsLoss);
      });
    });
    return points;
  }

  // CORRECCIÓN ERROR 4: Permite empates (en caso de empate en sets, puntos compartidos)
  allowsDraws() {
    return true;
  }

  // CORRECCIÓN ERROR 13: Ocultar columnas detalladas (similar a Americano)
  showDetailedStats() {
    return false;
  }

  // CORRECCIÓN ERROR 5: No tiene método _advance
}
