// js/formats/Swiss.js
// Sistema Suizo: emparejamientos por récord similar, sin repetición de oponentes
// CORRECCIÓN ERROR 19: Verificar historial de enfrentamientos

import { Sanitizer } from '../security/Sanitizer.js';

export class Swiss {
  constructor(teams, config) {
    this.teams = teams.filter(t => !t.isBye);
    this.config = config;
    this.history = new Map(); // teamId -> Set(opponentId)
    this.rounds = Math.ceil(Math.log2(this.teams.length)) + 1;
  }

  generate() {
    const matches = [];
    let matchId = 0;

    for (let r = 0; r < this.rounds; r++) {
      // Calcular puntuación actual de cada equipo
      const scores = this._calculateScores(matches);
      const available = [...this.teams];
      const roundMatches = [];

      while (available.length > 1) {
        // Ordenar por puntuación descendente
        available.sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
        const current = available[0];
        // Buscar oponente con puntuación similar que no haya jugado antes
        let opponent = null;
        for (let i = 1; i < available.length; i++) {
          const candidate = available[i];
          if (!this.hasPlayed(current.id, candidate.id)) {
            opponent = candidate;
            break;
          }
        }
        if (!opponent) {
          // Si no hay oponente sin historial, tomar el siguiente
          opponent = available[1];
        }
        // Registrar match
        roundMatches.push({
          id: `swiss_${r}_${matchId++}`,
          round: r,
          t1: [current.id],
          t2: [opponent.id],
          t1name: Sanitizer.text(current.name),
          t2name: Sanitizer.text(opponent.name),
          sets: [],
          done: false,
          winner: null,
          court: ((matchId % this.config.numCourts) || 1) + 1,
          isSwiss: true
        });
        // Marcar como enfrentados
        this.recordMatch(current.id, opponent.id);
        // Remover ambos de disponibles
        const idx1 = available.indexOf(current);
        const idx2 = available.indexOf(opponent);
        if (idx1 > idx2) {
          available.splice(idx1, 1);
          available.splice(idx2, 1);
        } else {
          available.splice(idx2, 1);
          available.splice(idx1, 1);
        }
      }
      matches.push(...roundMatches);
    }
    return matches;
  }

  hasPlayed(teamId, opponentId) {
    return this.history.get(teamId)?.has(opponentId) || false;
  }

  recordMatch(teamId, opponentId) {
    if (!this.history.has(teamId)) this.history.set(teamId, new Set());
    if (!this.history.has(opponentId)) this.history.set(opponentId, new Set());
    this.history.get(teamId).add(opponentId);
    this.history.get(opponentId).add(teamId);
  }

  _calculateScores(matches) {
    const scores = {};
    matches.forEach(m => {
      if (!m.done) return;
      const winner = m.winner;
      const loser = m.t1.includes(winner) ? m.t2[0] : m.t1[0];
      scores[winner] = (scores[winner] || 0) + this.config.ptsWin;
      scores[loser] = (scores[loser] || 0) + this.config.ptsLoss;
    });
    return scores;
  }

  // CORRECCIÓN ERROR 4: Permite empates
  allowsDraws() {
    return true;
  }

  // CORRECCIÓN ERROR 13: Mostrar columnas detalladas
  showDetailedStats() {
    return true;
  }

  // CORRECCIÓN ERROR 5: No tiene método _advance
}
