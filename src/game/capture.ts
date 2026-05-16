export function captureChain(board: number[], startIndex: number) {
  let i = startIndex;
  let total = 0;

  while (i >= 0) {
    if (board[i] === 2 || board[i] === 3) {
      total += board[i];
      board[i] = 0;
      i--; // on recule
    } else {
      break; // stop chaîne
    }
  }

  return total;
}