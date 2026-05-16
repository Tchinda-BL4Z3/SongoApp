import { captureChain } from './capture';

export function playTurn(board: number[], index: number) {
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

  // 🔥 capture en chaîne
  const captured = captureChain(nextBoard, i);

  return {
    board: nextBoard,
    lastIndex: i,
    captured,
  };
}