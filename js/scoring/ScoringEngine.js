// js/scoring/ScoringEngine.js
// Fábrica y gestión de sistemas de puntuación

import { NormalScoring } from './NormalScoring.js';
import { ShortScoring } from './ShortScoring.js';
import { ProScoring } from './ProScoring.js';
import { ChampionsScoring } from './ChampionsScoring.js';
import { SCORING_TYPES } from '../config/constants.js';

export class ScoringEngine {
  constructor(config) {
    this.config = config;
    this.scoring = this._getScoring(config.setType);
  }

  _getScoring(setType) {
    switch (setType) {
      case SCORING_TYPES.SHORT:
        return new ShortScoring();
      case SCORING_TYPES.PRO:
        return new ProScoring();
      case SCORING_TYPES.CHAMPIONS:
        return new ChampionsScoring();
      case SCORING_TYPES.CUSTOM:
        // Custom usa NormalScoring pero con gamesPerSet personalizado
        const custom = new NormalScoring();
        custom.gamesPerSet = this.config.gamesPerSet;
        return custom;
      default:
        return new NormalScoring();
    }
  }

  /**
   * Valida un set completo con posible tie-break
   * @param {number} score1 - Games equipo 1
   * @param {number} score2 - Games equipo 2
   * @param {number} tb1 - Puntos tie-break equipo 1 (opcional)
   * @param {number} tb2 - Puntos tie-break equipo 2 (opcional)
   * @returns {boolean}
   */
  validateSet(score1, score2, tb1 = 0, tb2 = 0) {
    const max = Math.max(score1, score2);
    const min = Math.min(score1, score2);
    const diff = max - min;

    // Si hay tie-break
    if (score1 === this.scoring.gamesPerSet && score2 === this.scoring.gamesPerSet) {
      if (tb1 === 0 && tb2 === 0) return false;
      return this.scoring.validateTieBreak(tb1, tb2);
    }

    // Set normal: debe ganar con diferencia >=2 y máximo gamesPerSet+1
    if (max <= this.scoring.gamesPerSet && diff >= 2) return true;
    if (max === this.scoring.gamesPerSet + 1 && min === this.scoring.gamesPerSet && diff === 1) return true;
    return false;
  }

  /**
   * Valida si el partido ha terminado (sets ganados)
   * @param {Array<Array>} sets - Matriz de sets con [score1, score2, tb1?, tb2?]
   * @returns {string|null} - 'home', 'away', o null si empate o no terminado
   */
  getMatchWinner(sets) {
    let homeWins = 0, awayWins = 0;
    const maxSets = this.scoring.maxSets;

    for (const set of sets) {
      const s1 = set[0], s2 = set[1];
      if (s1 > s2) homeWins++;
      else if (s2 > s1) awayWins++;
    }

    if (homeWins > awayWins && homeWins >= Math.ceil(maxSets / 2)) return 'home';
    if (awayWins > homeWins && awayWins >= Math.ceil(maxSets / 2)) return 'away';
    return null;
  }

  /**
   * Obtiene el máximo número de sets según formato
   */
  getMaxSets() {
    return this.scoring.maxSets;
  }

  /**
   * Obtiene games por set
   */
  getGamesPerSet() {
    return this.scoring.gamesPerSet;
  }

  /**
   * Obtiene puntos de tie-break según tipo de set
   */
  getTieBreakPoints() {
    return this.scoring.tieBreakPoints;
  }
}
