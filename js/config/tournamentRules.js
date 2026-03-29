export const SET_TYPES = {
  NORMAL: { sets: 3, gamesPerSet: 6, tieBreakPoints: 7 },
  SHORT: { sets: 3, gamesPerSet: 4, tieBreakPoints: 7 },
  PRO: { sets: 1, gamesPerSet: 8, tieBreakPoints: 10 },
  CHAMPIONS: { sets: 3, gamesPerSet: 6, tieBreakPoints: 10, superTieBreakSet: 3 },
  CUSTOM: { sets: 3, gamesPerSet: 6, tieBreakPoints: 7 } // Valores por defecto, se sobrescriben con los del usuario
};

export const FORMAT_RULES = {
  ELIMINATION: { allowsDraws: false, scoringSystem: 'NORMAL' },
  LEAGUE: { allowsDraws: true, scoringSystem: 'NORMAL' },
  AMERICANO: { scoringSystem: 'POINTS' }, // Sistema de puntos, no sets
  MEXICANO: { scoringSystem: 'NORMAL' },
  SWISS: { scoringSystem: 'NORMAL', allowsDraws: true },
  GROUPS: { allowsDraws: true, scoringSystem: 'NORMAL' }
};
