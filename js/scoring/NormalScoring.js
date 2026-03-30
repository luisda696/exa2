// js/scoring/NormalScoring.js
// Sistema de puntuación normal: mejor de 3 sets, 6 games por set, tie-break a 7

export class NormalScoring {
  constructor() {
    this.gamesPerSet = 6;
    this.maxSets = 3;
    this.tieBreakPoints = 7;
  }

  validateSet(score1, score2) {
    const max = Math.max(score1, score2);
    const min = Math.min(score1, score2);
    const diff = max - min;

    // Ganar 6-0, 6-1, 6-2, 6-3, 6-4, 7-5
    if (max === this.gamesPerSet && diff >= 2) return true;
    // 7-6 con tie-break
    if (max === this.gamesPerSet + 1 && min === this.gamesPerSet && diff === 1) return true;
    return false;
  }

  validateTieBreak(p1, p2) {
    const max = Math.max(p1, p2);
    const diff = Math.abs(p1 - p2);
    if (max < this.tieBreakPoints) return false;
    if (diff < 2) return false;
    return true;
  }
}
