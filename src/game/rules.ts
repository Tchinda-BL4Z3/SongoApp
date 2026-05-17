export const PLAYER_PITS = [0, 1, 2, 3, 4, 5, 6];
export const OPPONENT_PITS = [7, 8, 9, 10, 11, 12, 13];

export const isPlayerPit = (index: number) => PLAYER_PITS.includes(index);
export const isOpponentPit = (index: number) => OPPONENT_PITS.includes(index);

export const hasSideSeeds = (board: number[], side: number[]) =>
  side.some(index => board[index] > 0);
