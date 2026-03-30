// js/formats/League.js
// Formato Liga: todos contra todos (round-robin)

import { Sanitizer } from '../security/Sanitizer.js';

export class League {
  constructor(teams, config) {
    this.teams = teams.filter(t => !t.isBye);
    this.config = config;
  }

  generate() {
    const teams = this._seedTeams([...this.teams]);
    const matches = [];
    let matchId = 0;

    for (let i = 0; i < teams.length - 1; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `league_${matchId++}`,
          round: 0,
          t1: [teams[i].id],
          t2: [teams[j].id],
          t1name: Sanitizer.text(teams[i].name),
          t2name: Sanitizer.text(teams[j].name),
          sets: [],
          done: false,
          winner: null,
          court: ((matchId % this.config.numCourts) || 1) + 1,
          isBye: false,
          isLeague: true
        });
      }
    }

    return matches;
  }

  _seedTeams(teams) {
    switch (this.config.matchType) {
      case 'seeded':
        return teams.sort((a, b) => (b.seed ? 1 : 0) - (a.seed ? 1 : 0) || (b.category || 0) - (a.category || 0));
      case 'snake':
        const sorted = [...teams].sort((a, b) => (b.category || 0) - (a.category || 0));
        const snake = [];
        for (let i = 0; i < sorted.length; i++) {
          if (i % 2 === 0) snake.push(sorted[i]);
          else snake.unshift(sorted[i]);
        }
        return snake;
      default:
        return teams.sort(() => Math.random() - 0.5);
    }
  }

  // CORRECCIÓN ERROR 4: Liga permite empates
  allowsDraws() {
    return true;
  }

  // CORRECCIÓN ERROR 13: Mostrar columnas detalladas
  showDetailedStats() {
    return true;
  }
}
