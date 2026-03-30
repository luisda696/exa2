// js/scoring/ChampionsScoring.js
// Sistema Champions: sets 1 y 2 normales (6 games, TB a 7 si 6-6)
// Set 3 es super tie-break a 10 puntos (sin games)
// CORRECCIÓN ERROR 7

export class ChampionsScoring {
  constructor() {
    this.gamesPerSet = 6;          // Para sets 1 y 2
    this.maxSets = 3;
    this.tieBreakPoints = 7;       // Para sets 1 y 2
    this.superTieBreakPoints = 10; // Para set 3
  }

  validateSet(score1, score2, setNumber) {
    if (setNumber === 3) {
      // Set 3 es super tie-break: solo puntos, no games
      // En este sistema, el set 3 se representa con score1 como puntos y score2 como puntos
      // La validación la hace validateTieBreak con superTieBreakPoints
      return true; // La validación real ocurre en validateTieBreak
    }
    const max = Math.max(score1, score2);
    const min = Math.min(score1, score2);
    const diff = max - min;
    if (max === this.gamesPerSet && diff >= 2) return true;
    if (max === this.gamesPerSet + 1 && min === this.gamesPerSet && diff === 1) return true;
    return false;
  }

  validateTieBreak(p1, p2, isSuper = false) {
    const points = isSuper ? this.superTieBreakPoints : this.tieBreakPoints;
    const max = Math.max(p1, p2);
    const diff = Math.abs(p1 - p2);
    if (max < points) return false;
    if (diff < 2) return false;
    return true;
  }

  getTieBreakPoints(setNumber) {
    return setNumber === 3 ? this.superTieBreakPoints : this.tieBreakPoints;
  }
}
