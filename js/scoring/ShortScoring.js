// js/scoring/ShortScoring.js
// Short Set: 4 games por set, mejor de 2 sets (máximo 2 sets), tie-break a 7
// CORRECCIÓN ERROR 1: maxSets = 2, no 3
// CORRECCIÓN ERROR 2: gamesPerSet = 4

export class ShortScoring {
  constructor() {
    this.gamesPerSet = 4;
    this.maxSets = 2;       // ERROR 1 CORREGIDO
    this.tieBreakPoints = 7;
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
