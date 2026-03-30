// js/scoring/ProScoring.js
// Pro Set: 8 games por set, mejor de 1 set (solo un set), tie-break a 10 puntos
// CORRECCIÓN ERROR 2: gamesPerSet = 8
// CORRECCIÓN ERROR 3: tieBreakPoints = 10

export class ProScoring {
  constructor() {
    this.gamesPerSet = 8;
    this.maxSets = 1;       // Solo un set decide el partido
    this.tieBreakPoints = 10;
  }

  validateSet(score1, score2) {
    const max = Math.max(score1, score2);
    const min = Math.min(score1, score2);
    const diff = max - min;

    if (max === this.gamesPerSet && diff >= 2) return true;
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
