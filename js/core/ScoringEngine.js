class ScoringEngine {
  static create(type, customConfig = {}) {
    const engines = {
      NORMAL: () => new NormalScoring(),
      SHORT: () => new ShortScoring(),
      PRO: () => new ProScoring(),
      CHAMPIONS: () => new ChampionsScoring(),
      CUSTOM: () => new CustomScoring(customConfig)
    };
    return engines[type] ? engines[type]() : new NormalScoring();
  }
}

class NormalScoring {
  validateSet(setScore) {
    const [games1, games2] = setScore;
    const minGames = 6;
    return (games1 >= minGames || games2 >= minGames) && Math.abs(games1 - games2) >= 2;
  }

  validateMatch(matchScore) {
    return matchScore.every(set => this.validateSet(set));
  }

  getTieBreakPoints(setNumber) {
    return 7;
  }

  getGamesPerSet() {
    return 6;
  }
}

class ShortScoring extends NormalScoring {
  getGamesPerSet() {
    return 4;
  }
}

class ProScoring {
  validateSet(setScore) {
    const [games1, games2] = setScore;
    return (games1 >= 8 || games2 >= 8) && Math.abs(games1 - games2) >= 2;
  }

  getGamesPerSet() {
    return 8;
  }

  getTieBreakPoints() {
    return 10;
  }
}

class ChampionsScoring extends NormalScoring {
  validateSet(setScore, setNumber) {
    if (setNumber === 3) {
      // Super Tie-Break: mínimo 10 puntos, diferencia de 2
      const [points1, points2] = setScore;
      return points1 >= 10 || points2 >= 10 && Math.abs(points1 - points2) >= 2;
    }
    return super.validateSet(setScore);
  }

  getTieBreakPoints(setNumber) {
    return setNumber === 3 ? 10 : 7;
  }
}

class CustomScoring {
  constructor({ gamesPerSet = 6, tieBreakPoints = 7 }) {
    this.gamesPerSet = gamesPerSet;
    this.tieBreakPoints = tieBreakPoints;
  }

  validateSet(setScore) {
    const [games1, games2] = setScore;
    return (games1 >= this.gamesPerSet || games2 >= this.gamesPerSet) &&
           Math.abs(games1 - games2) >= 2;
  }

  getGamesPerSet() {
    return this.gamesPerSet;
  }

  getTieBreakPoints() {
    return this.tieBreakPoints;
  }
}

export default ScoringEngine;
