// js/config/constants.js
// Constantes globales del sistema

export const SCORING_TYPES = {
  NORMAL: 'normal',
  SHORT: 'short',
  PRO: 'pro',
  CHAMPIONS: 'champions',
  CUSTOM: 'custom'
};

export const FORMAT_TYPES = {
  ELIMINATION: 'elimination',
  LEAGUE: 'league',
  GROUPS: 'groups',
  AMERICANO: 'americano',
  MEXICANO: 'mexicano',
  SWISS: 'swiss'
};

export const DRAW_TYPES = {
  RANDOM: 'random',
  SEEDED: 'seeded',
  SNAKE: 'snake'
};

export const TIEBREAK_TYPES = {
  STANDARD: 'standard',   // 7 puntos
  MATCH: 'match',         // 10 puntos
  CHAMPIONS: 'champions', // 10 puntos (super tiebreak)
  CUSTOM: 'custom'
};

export const DEFAULT_CONFIG = {
  tournamentName: 'Torneo de Pádel',
  genderMode: 'mixed',
  playersPerTeam: 2,
  format: FORMAT_TYPES.ELIMINATION,
  pointsWin: 3,
  pointsDraw: 1,
  pointsLoss: 0,
  setType: SCORING_TYPES.NORMAL,
  gamesPerSet: 6,
  tiebreakType: TIEBREAK_TYPES.STANDARD,
  tiebreakPoints: 7,
  matchType: DRAW_TYPES.RANDOM,
  startDate: null,
  numCourts: 2,
  matchesPerDay: 4,
  selectedDays: [1, 2, 3, 4, 5], // Lunes a Viernes por defecto
  logo: null
};

export const GENDER_ICONS = {
  male: '♂️',
  female: '♀️',
  mixed: '⚥'
};

export const STORAGE_KEYS = {
  TOURNAMENT: 'padel_tournament_v2',
  HISTORY: 'padel_history_v2',
  ADS: 'padel_ads_v2'
};

export const MAX_IMAGE_SIZE = 500 * 1024; // 500KB
export const MAX_VIDEO_SIZE = 2 * 1024 * 1024; // 2MB
