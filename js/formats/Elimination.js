// js/formats/Elimination.js
// Formato eliminación directa con BYEs automáticos

import { Sanitizer } from '../security/Sanitizer.js';

export class Elimination {
  constructor(teams, config, matches = []) {
    this.teams = teams.filter(t => !t.isBye);
    this.config = config;
    this.matches = matches;
    this._advance = this._advance.bind(this);
  }

  generate() {
    const teams = this._seedTeams([...this.teams]);
    const n = teams.length;
    const size = Math.pow(2, Math.ceil(Math.log2(n)));
    const byes = size - n;
    const fullTeams = [...teams];

    for (let i = 0; i < byes; i++) {
      fullTeams.push({
        id: `bye_${i}`,
        name: 'BYE',
        isBye: true,
        players: []
      });
    }

    const matches = [];
    let matchId = 0;
    let round = 0;
    let currentRoundTeams = [...fullTeams];

    while (currentRoundTeams.length > 1) {
      const roundMatches = [];
      for (let i = 0; i < currentRoundTeams.length; i += 2) {
        const t1 = currentRoundTeams[i];
        const t2 = currentRoundTeams[i + 1];
        const isByeMatch = t1?.isBye || t2?.isBye;
        const match = {
          id: `elim_${round}_${matchId++}`,
          round: round,
          t1: [t1?.id],
          t2: [t2?.id],
          t1name: t1?.name || '?',
          t2name: t2?.name || '?',
          sets: [],
          done: isByeMatch,
          winner: isByeMatch ? (t1?.isBye ? t2?.id : t1?.id) : null,
          court: 1,
          isBye: isByeMatch,
          isElimination: true
        };
        roundMatches.push(match);
        matches.push(match);
      }
      // Avanzar ganadores para próxima ronda
      if (roundMatches.length > 1) {
        roundMatches.forEach((match, idx) => {
          if (match.done && match.winner) {
            // Simular avance (se llenará luego con _adv)
          }
        });
      }
      // Construir siguiente ronda
      const nextRoundTeams = [];
      for (let i = 0; i < roundMatches.length; i++) {
        const m = roundMatches[i];
        if (m.done && m.winner) {
          nextRoundTeams.push({ id: m.winner, name: m.t1name === 'BYE' ? m.t2name : m.t1name });
        } else {
          nextRoundTeams.push({ id: `winner_${m.id}`, name: 'Por definir' });
        }
      }
      currentRoundTeams = nextRoundTeams;
      round++;
    }

    return matches;
  }

  _seedTeams(teams) {
    switch (this.config.matchType) {
      case 'seeded':
        return [...teams].sort((a, b) => (b.seed ? 1 : 0) - (a.seed ? 1 : 0) || (b.category || 0) - (a.category || 0));
      case 'snake':
        // Implementación simplificada de snake draft
        const sorted = [...teams].sort((a, b) => (b.category || 0) - (a.category || 0));
        const snake = [];
        for (let i = 0; i < sorted.length; i++) {
          if (i % 2 === 0) snake.push(sorted[i]);
          else snake.unshift(sorted[i]);
        }
        return snake;
      default:
        return [...teams].sort(() => Math.random() - 0.5);
    }
  }

  // CORRECCIÓN ERROR 5: _advance solo existe en Elimination y Groups (fase KO)
  _advance(matchId, winnerId) {
    // Buscar partidos que dependen de este matchId como referencia
    this.matches.forEach(match => {
      if (match.t1[0] === matchId) {
        match.t1 = [winnerId];
        match.t1name = this._getTeamName(winnerId);
      }
      if (match.t2[0] === matchId) {
        match.t2 = [winnerId];
        match.t2name = this._getTeamName(winnerId);
      }
    });
  }

  _getTeamName(teamId) {
    const team = this.teams.find(t => t.id === teamId) || { name: '?' };
    return Sanitizer.text(team.name);
  }

  // CORRECCIÓN ERROR 4: Eliminación no permite empates
  allowsDraws() {
    return false;
  }

  // CORRECCIÓN ERROR 13: Ocultar columnas específicas en standings
  showDetailedStats() {
    return false; // Eliminación no necesita S+/S-/G+/G-
  }
}
