// js/formats/Groups.js
// Formato: Fase de grupos + Eliminación directa (KO)

import { Sanitizer } from '../security/Sanitizer.js';
import { Elimination } from './Elimination.js';

export class Groups {
  constructor(teams, config, matches = []) {
    this.teams = teams.filter(t => !t.isBye);
    this.config = config;
    this.matches = matches;
    this.groups = [];
    this._groupsMatches = [];
    this._koMatches = [];
  }

  generate() {
    // Crear grupos
    const n = this.teams.length;
    const numGroups = n <= 8 ? 2 : n <= 12 ? 3 : n <= 16 ? 4 : Math.ceil(n / 4);
    this.groups = Array.from({ length: numGroups }, () => []);

    const seededTeams = this._seedTeams([...this.teams]);
    seededTeams.forEach((team, idx) => {
      this.groups[idx % numGroups].push(team);
    });

    // Partidos dentro de cada grupo (round-robin)
    let matchId = 0;
    this._groupsMatches = [];
    for (let g = 0; g < this.groups.length; g++) {
      const group = this.groups[g];
      for (let i = 0; i < group.length - 1; i++) {
        for (let j = i + 1; j < group.length; j++) {
          this._groupsMatches.push({
            id: `group_${g}_${matchId++}`,
            round: 0,
            t1: [group[i].id],
            t2: [group[j].id],
            t1name: Sanitizer.text(group[i].name),
            t2name: Sanitizer.text(group[j].name),
            sets: [],
            done: false,
            winner: null,
            court: ((matchId % this.config.numCourts) || 1) + 1,
            isBye: false,
            group: g,
            isGroup: true
          });
        }
      }
    }

    return this._groupsMatches;
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

  // CORRECCIÓN ERROR 9: Al finalizar grupos, llenar KO con nombres reales
  fillKO(standings) {
    const qualified = [];
    for (let g = 0; g < this.groups.length; g++) {
      const groupStandings = standings.filter(s => s.group === g).sort((a, b) => b.pts - a.pts || b.gw - a.gw);
      const top2 = groupStandings.slice(0, 2);
      top2.forEach(ts => {
        const team = this.teams.find(t => t.id === ts.id);
        if (team) qualified.push(team);
      });
    }

    if (qualified.length < 2) return [];

    // Generar KO con eliminación directa usando el equipo qualified
    const koGenerator = new Elimination(qualified, this.config, []);
    const koMatches = koGenerator.generate();

    // Marcar los partidos KO con información de grupo
    koMatches.forEach(m => {
      m.isKO = true;
      m.isGroupKO = true;
    });

    this._koMatches = koMatches;
    return koMatches;
  }

  // CORRECCIÓN ERROR 4: Fase de grupos permite empates; fase KO no
  allowsDraws(match) {
    if (match && match.isKO) return false;
    return true;
  }

  // CORRECCIÓN ERROR 13: Mostrar columnas detalladas en fase de grupos
  showDetailedStats() {
    return true;
  }

  // CORRECCIÓN ERROR 5: _advance solo existe para KO (usar el método de Elimination)
  advanceKO(matchId, winnerId) {
    // Delegar en el objeto de eliminación si existe
    if (this._koGenerator) {
      this._koGenerator._advance(matchId, winnerId);
    }
  }
}
