// js/ui/Renderer.js
// Renderizado seguro de todos los componentes UI con sanitización

import { Sanitizer } from '../security/Sanitizer.js';
import { CalendarManager } from './CalendarManager.js';

export class Renderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.calendar = new CalendarManager();
  }

  /**
   * Renderiza el cuadro (bracket) del torneo
   */
  renderBracket(matches, teams, config, onMatchClick) {
    if (!this.container) return;
    if (!['elimination', 'groups'].includes(config.format)) {
      this.container.innerHTML = '<div class="text-center text-gray-500">Este formato no tiene cuadro eliminatorio.</div>';
      return;
    }

    const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
    const roundNames = { 0: 'Ronda 1', 1: 'Cuartos', 2: 'Semifinal', 3: 'Final', 100: 'Cuartos KO', 101: 'Semifinal KO', 102: 'Final KO' };

    const bracketHtml = `
      <div class="bracket">
        ${rounds.map(r => {
          const roundMatches = matches.filter(m => m.round === r && !m.isBye);
          if (!roundMatches.length) return '';
          return `
            <div class="bracket-round">
              <div class="bracket-round-title">${roundNames[r] || `Ronda ${r + 1}`}</div>
              ${roundMatches.map(m => {
                const t1 = m.t1name || this._getTeamName(m.t1[0], teams);
                const t2 = m.t2name || this._getTeamName(m.t2[0], teams);
                const score1 = m.sets.map(s => s[0]).join('-');
                const score2 = m.sets.map(s => s[1]).join('-');
                const winner = m.winner;
                const t1Winner = winner && m.t1.includes(winner);
                const t2Winner = winner && m.t2.includes(winner);
                return `
                  <div class="bracket-match ${m.done ? 'done' : ''}" data-match-id="${m.id}">
                    <div class="bracket-team ${t1Winner ? 'winner' : ''}">
                      <span>${Sanitizer.text(t1)}</span>
                      <span class="bracket-score">${score1 || '—'}</span>
                    </div>
                    <div class="bracket-team ${t2Winner ? 'winner' : ''}">
                      <span>${Sanitizer.text(t2)}</span>
                      <span class="bracket-score">${score2 || '—'}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }).join('')}
      </div>
    `;
    this.container.innerHTML = bracketHtml;

    // Adjuntar eventos
    this.container.querySelectorAll('.bracket-match').forEach(el => {
      const matchId = el.dataset.matchId;
      el.addEventListener('click', () => onMatchClick(matchId));
    });
  }

  /**
   * Renderiza la lista de partidos (vista de calendario)
   */
  renderMatches(matches, teams, config, onMatchClick) {
    if (!this.container) return;
    const byRound = {};
    matches.forEach(m => {
      if (!byRound[m.round]) byRound[m.round] = [];
      byRound[m.round].push(m);
    });

    let html = '';
    for (const [round, ms] of Object.entries(byRound).sort((a, b) => a[0] - b[0])) {
      html += `<div class="card mb-4"><h4 class="font-bold text-gray-700 mb-2">Ronda ${+round + 1}</h4>`;
      for (const m of ms) {
        const t1 = m.t1name || this._getTeamName(m.t1[0], teams);
        const t2 = m.t2name || this._getTeamName(m.t2[0], teams);
        const status = m.done ? '✅ Jugado' : '⏳ Pendiente';
        const score = m.sets.map(s => `${s[0]}-${s[1]}`).join(' ');
        html += `
          <div class="flex justify-between items-center p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50" data-match-id="${m.id}">
            <div class="flex-1">
              <div class="font-medium">${Sanitizer.text(t1)} vs ${Sanitizer.text(t2)}</div>
              <div class="text-xs text-gray-500">Cancha ${m.court} | ${status}</div>
            </div>
            <div class="text-sm font-mono">${score || '—'}</div>
          </div>
        `;
      }
      html += `</div>`;
    }
    this.container.innerHTML = html;
    this.container.querySelectorAll('[data-match-id]').forEach(el => {
      el.addEventListener('click', () => onMatchClick(el.dataset.matchId));
    });
  }

  /**
   * Renderiza tabla de posiciones con columnas contextuales (ERROR 13)
   */
  renderStandings(standings, format, config) {
    if (!this.container) return;
    const showDetailed = ['league', 'groups', 'swiss'].includes(format);
    const headers = ['#', 'Equipo', 'PJ', 'PG', 'PP'];
    if (showDetailed) {
      headers.push('S+', 'S-', 'G+', 'G-', 'DG');
    }
    if (format === 'league' || format === 'groups' || format === 'swiss') {
      headers.push('PE'); // CORRECCIÓN ERROR 15: Partidos Empatados
    }
    headers.push('Pts');

    let html = '<div class="overflow-x-auto"><table class="table"><thead><tr>';
    headers.forEach(h => html += `<th>${h}</th>`);
    html += '</tr></thead><tbody>';
    standings.forEach((s, idx) => {
      html += '<tr>';
      html += `<td>${idx + 1}</td>`;
      html += `<td><div class="flex items-center gap-2"><span class="font-medium">${Sanitizer.text(s.name)}</span></div></td>`;
      html += `<td>${s.gp}</td><td>${s.gw}</td><td>${s.gl}</td>`;
      if (showDetailed) {
        html += `<td>${s.sw}</td><td>${s.sl}</td><td>${s.gwTotal}</td><td>${s.glTotal}</td><td>${s.gwTotal - s.glTotal}</td>`;
      }
      if (format === 'league' || format === 'groups' || format === 'swiss') {
        html += `<td>${s.pe || 0}</td>`;
      }
      html += `<td class="font-bold">${s.pts}</td>`;
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    this.container.innerHTML = html;
  }

  _getTeamName(teamId, teams) {
    const team = teams.find(t => t.id === teamId);
    return team ? Sanitizer.text(team.name) : '?';
  }
}
