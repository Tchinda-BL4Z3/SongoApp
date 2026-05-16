import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameRecord {
  id: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  mode: 'ai' | 'local';
  timestamp: number;
  winner: 'player1' | 'player2' | 'draw';
}

const HISTORY_KEY = 'songo_game_history';

export async function saveGameRecord(record: Omit<GameRecord, 'id'>) {
  try {
    const history = await loadGameHistory();
    const newRecord: GameRecord = {
      ...record,
      id: `${Date.now()}-${Math.random()}`,
    };
    history.push(newRecord);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return newRecord;
  } catch {
    // Silently fail if AsyncStorage unavailable
    return null;
  }
}

export async function loadGameHistory(): Promise<GameRecord[]> {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function clearGameHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
  } catch {
    // Silently fail
  }
}

export function getWinnerText(record: GameRecord): string {
  if (record.winner === 'draw') return 'Égalité';
  const name =
    record.winner === 'player1' ? record.player1Name : record.player2Name;
  return `${name} gagne`;
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
