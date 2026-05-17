import { captureChain } from './capture';

export function playTurn(board: number[], index: number, currentPlayer: 'player' | 'opponent') {
  const nextBoard = [...board];
  let seeds = nextBoard[index];
  if (seeds === 0) {
    return {
      board: nextBoard,
      lastIndex: index,
      captured: 0,
    };
  }
  nextBoard[index] = 0;

  let i = index;

  while (seeds > 0) {
    i = (i + 1) % nextBoard.length;
    nextBoard[i]++;
    seeds--;
  }

  // 🔥 capture en chaîne seulement dans le camp adverse
  const captured = captureChain(nextBoard, i, currentPlayer);

  return {
    board: nextBoard,
    lastIndex: i,
    captured,
  };
}