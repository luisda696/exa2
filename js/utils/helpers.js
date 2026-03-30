export const isValidSetScore = (games1, games2, setType) => {
  const config = {
    NORMAL: { minGames: 6 },
    SHORT: { minGames: 4 },
    PRO: { minGames: 8 }
  };

  const { minGames } = config[setType] || config.NORMAL;
  return (games1 >= minGames || games2 >= minGames) && Math.abs(games1 - games2) >= 2;
};

export const isValidTieBreak = (points1, points2, tieBreakType) => {
  const minPoints = tieBreakType === 'CHAMPIONS' ? 10 : 7;
  return (points1 >= minPoints || points2 >= minPoints) && Math.abs(points1 - points2) >= 2;
};
