export function captureChain(
  board: number[],
  startIndex: number,
  currentPlayer: 'player' | 'opponent'
) {
  let i = startIndex;
  let total = 0;

  const opponentRange = currentPlayer === 'player' ? [7, 13] : [0, 6];

  const isOpponentIndex = (index: number) => index >= opponentRange[0] && index <= opponentRange[1];

  while (i >= 0 && isOpponentIndex(i)) {
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