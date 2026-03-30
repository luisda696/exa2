// js/app.js
// Controlador principal del sistema, integrando todos los módulos

import { VersionedStorage } from './storage/VersionedStorage.js';
import { Sanitizer } from './security/Sanitizer.js';
import { ScoringEngine } from './scoring/ScoringEngine.js';
import { Elimination } from './formats/Elimination.js';
import { League } from './formats/League.js';
import { Groups } from './formats/Groups.js';
import { Americano } from './formats/Americano.js';
import { Mexicano } from './formats/Mexicano.js';
import { Swiss } from './formats/Swiss.js';
import { CalendarManager } from './ui/CalendarManager.js';
import { Renderer } from './ui/Renderer.js';
import { ModalManager } from './ui/ModalManager.js';
import { DEFAULT_CONFIG, FORMAT_TYPES } from './config/constants.js';

class App {
  constructor() {
    this.data = {
      config: null,
      teams: [],
      matches: [],
      tournamentName: 'Torneo de Pádel',
      logo: null
    };
    this.storage = VersionedStorage;
    this.renderer = new Renderer('app-content');
    this.modal = new ModalManager();
    this.calendar = new CalendarManager();
    this.isGenerating = false; // ERROR 31: flag para evitar doble clic
    this.undoStack = []; // ERROR 29: Command Pattern para Undo
  }

  async init() {
    // Cargar datos guardados
    const saved = this.storage.load();
    if (saved) {
      this.data = saved;
    } else {
      this.data.config = { ...DEFAULT_CONFIG };
    }
    this.renderConfigForm();
    this.attachEvents();
  }

  renderConfigForm() {
    const html = `
      <div class="card">
        <h2 class="text-xl font-bold mb-4">Configuración del Torneo</h2>
        <form id="config-form">
          <div class="form-group">
            <label class="form-label">Nombre del Torneo</label>
            <input type="text" id="tournament-name" class="form-input" value="${Sanitizer.text(this.data.tournamentName)}">
          </div>
          <div class="form-group">
            <label class="form-label">Formato</label>
            <select id="format" class="form-select">
              <option value="elimination" ${this.data.config.format === 'elimination' ? 'selected' : ''}>Eliminación Directa</option>
              <option value="league" ${this.data.config.format === 'league' ? 'selected' : ''}>Liga (Round Robin)</option>
              <option value="groups" ${this.data.config.format === 'groups' ? 'selected' : ''}>Grupos + Eliminatoria</option>
              <option value="americano" ${this.data.config.format === 'americano' ? 'selected' : ''}>Americano</option>
              <option value="mexicano" ${this.data.config.format === 'mexicano' ? 'selected' : ''}>Mexicano</option>
              <option value="swiss" ${this.data.config.format === 'swiss' ? 'selected' : ''}>Suizo</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Tipo de Set</label>
            <select id="set-type" class="form-select">
              <option value="normal" ${this.data.config.setType === 'normal' ? 'selected' : ''}>Normal (6 games)</option>
              <option value="short" ${this.data.config.setType === 'short' ? 'selected' : ''}>Short Set (4 games)</option>
              <option value="pro" ${this.data.config.setType === 'pro' ? 'selected' : ''}>Pro Set (8 games)</option>
              <option value="champions" ${this.data.config.setType === 'champions' ? 'selected' : ''}>Champions</option>
              <option value="custom" ${this.data.config.setType === 'custom' ? 'selected' : ''}>Personalizado</option>
            </select>
          </div>
          <div id="custom-games-group" style="display: ${this.data.config.setType === 'custom' ? 'block' : 'none'}">
            <div class="form-group">
              <label class="form-label">Games por Set</label>
              <input type="number" id="custom-games" class="form-input" min="1" max="15" value="${this.data.config.gamesPerSet}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Puntos Victoria / Derrota / Empate</label>
            <div class="flex gap-2">
              <input type="number" id="pts-win" class="form-input" value="${this.data.config.ptsWin}" placeholder="Victoria">
              <input type="number" id="pts-loss" class="form-input" value="${this.data.config.ptsLoss}" placeholder="Derrota">
              <input type="number" id="pts-draw" class="form-input" value="${this.data.config.ptsDraw}" placeholder="Empate">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Días de juego</label>
            <div id="day-selector"></div>
          </div>
          <button type="submit" class="btn btn-primary w-full">Guardar y continuar</button>
        </form>
      </div>
    `;
    this.renderer.container.innerHTML = html;
    // Insertar selector de días
    const daySelectorContainer = document.getElementById('day-selector');
    if (daySelectorContainer) {
      const selector = this.calendar.renderDaySelector(days => {
        this.data.config.selectedDays = days;
        this.save();
      });
      daySelectorContainer.appendChild(selector);
    }
    // Evento para mostrar/ocultar campo custom games
    const setTypeSelect = document.getElementById('set-type');
    if (setTypeSelect) {
      setTypeSelect.addEventListener('change', (e) => {
        const customGroup = document.getElementById('custom-games-group');
        customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
      });
    }
    // Submit del formulario
    const form = document.getElementById('config-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveConfigFromForm();
      this.renderTeamRegistration();
    });
  }

  saveConfigFromForm() {
    this.data.tournamentName = document.getElementById('tournament-name').value;
    this.data.config.format = document.getElementById('format').value;
    this.data.config.setType = document.getElementById('set-type').value;
    if (this.data.config.setType === 'custom') {
      this.data.config.gamesPerSet = parseInt(document.getElementById('custom-games').value) || 6;
    }
    this.data.config.ptsWin = parseInt(document.getElementById('pts-win').value) || 3;
    this.data.config.ptsLoss = parseInt(document.getElementById('pts-loss').value) || 1;
    this.data.config.ptsDraw = parseInt(document.getElementById('pts-draw').value) || 2;
    // Validar ptsWin > ptsDraw > ptsLoss (ERROR 36)
    if (this.data.config.ptsWin <= this.data.config.ptsDraw || this.data.config.ptsDraw <= this.data.config.ptsLoss) {
      this.modal.toast('⚠️ Puntos deben cumplir: Victoria > Empate > Derrota');
      return;
    }
    this.save();
  }

  renderTeamRegistration() {
    // Similar a config, pero con listado de equipos y formulario de agregar
    // ... (implementación simplificada)
    this.modal.toast('Registro de equipos (demo)');
  }

  generateTournament() {
    if (this.isGenerating) return; // ERROR 31
    this.isGenerating = true;

    const teams = this.data.teams.filter(t => !t.isBye);
    if (teams.length < 2) {
      this.modal.toast('Se necesitan al menos 2 equipos');
      this.isGenerating = false;
      return;
    }

    let generator;
    switch (this.data.config.format) {
      case FORMAT_TYPES.ELIMINATION:
        generator = new Elimination(teams, this.data.config);
        break;
      case FORMAT_TYPES.LEAGUE:
        generator = new League(teams, this.data.config);
        break;
      case FORMAT_TYPES.GROUPS:
        generator = new Groups(teams, this.data.config);
        break;
      case FORMAT_TYPES.AMERICANO:
        generator = new Americano(teams, this.data.config);
        break;
      case FORMAT_TYPES.MEXICANO:
        generator = new Mexicano(teams, this.data.config);
        break;
      case FORMAT_TYPES.SWISS:
        generator = new Swiss(teams, this.data.config);
        break;
      default:
        generator = new Elimination(teams, this.data.config);
    }
    this.data.matches = generator.generate();
    this.save();
    this.renderTournamentDashboard();
    this.isGenerating = false;
    this.modal.toast('✅ Torneo generado con éxito');
  }

  renderTournamentDashboard() {
    // Usar Renderer para mostrar bracket, partidos, posiciones, etc.
    this.renderer.renderBracket(this.data.matches, this.data.teams, this.data.config, (matchId) => {
      this.openScoreModal(matchId);
    });
    // También renderizar otras vistas...
  }

  openScoreModal(matchId) {
    const match = this.data.matches.find(m => m.id === matchId);
    if (!match) return;
    this.modal.openScoreModal(match, (sets) => {
      // Validar sets con ScoringEngine
      const scoring = new ScoringEngine(this.data.config);
      let valid = true;
      for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        if (!scoring.validateSet(set[0], set[1])) {
          valid = false;
          break;
        }
      }
      if (!valid) {
        this.modal.toast('Resultado inválido. Verifica la puntuación.');
        return;
      }
      match.sets = sets;
      const winner = scoring.getMatchWinner(sets);
      if (winner === 'home') match.winner = match.t1[0];
      else if (winner === 'away') match.winner = match.t2[0];
      else match.winner = null;
      match.done = !!match.winner;
      this.save();
      // Avanzar en eliminación si aplica
      if (this.data.config.format === FORMAT_TYPES.ELIMINATION && match.winner) {
        const elim = new Elimination(this.data.teams, this.data.config, this.data.matches);
        elim._advance(match.id, match.winner);
      }
      this.renderTournamentDashboard();
      this.modal.toast('Resultado guardado');
    });
  }

  save() {
    this.storage.save(this.data);
    // Guardar en historial si es relevante (ERROR 21)
    if (this.data.matches.length > 0) {
      this.storage.saveHistory({
        timestamp: Date.now(),
        tournamentName: this.data.tournamentName,
        format: this.data.config.format,
        teamsCount: this.data.teams.length,
        matchesCount: this.data.matches.length
      });
    }
  }

  attachEvents() {
    // Sincronizar entre pestañas (ERROR 26)
    window.addEventListener('storage', (event) => {
      if (event.key === this.storage.KEY) {
        const newData = this.storage.load();
        if (newData) {
          this.data = newData;
          this.renderTournamentDashboard();
          this.modal.toast('Datos actualizados desde otra pestaña');
        }
      }
    });
  }
}

// Inicializar app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
