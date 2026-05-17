import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import BottomNav from '../components/BottomNav';
import { playTurn } from '../game/engine';
import { saveGameRecord } from '../game/history';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { startBgm, stopBgm } from '../game/sound';

const SOUND_KEY = 'songo_sound';

const WOOD_TEXTURE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpFEfZBmR8yqY-_6gXTdO5L1TmhH4u7MM5Hi2I7EWCGgS7HA7Bdz9HWNDpJ8aP-HWbzXTzoCvHoDjwQ2-s_z90JeUVj7GYwxYF5_d6_EVnxblRFIrLJkTY8b7-ImKIFIK7t7pgMnpXuDJjK7rn9QmX-JT4SyeGRbSz-CbqYi_gMC4FRYGNJiQcbOqRq214E3Iuc9vWlquhfp3Ip62_LhwKsaxZGafecVMH7S0mkEDkAjgYwK0_1d8uyKF0MQF1N8EjWcgzN67OaLT2';

const BOARD_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0X0t79mmXPes4x27y7B3_qSMtKP6AStD30FK5mNpgoEh5Z8RRWWgei7XnMMWoZ4ZZi7UlFeEww4qrC4wBotHRrLiXY8116WDIHDn4WZxNMzX0s5lrZ13c59fSM-j7N4xeozf_Npk0adEKlsSnpuEMURGj2ru_i13PwO5QPt2iARWe_h_KKcM0jGqX8K2g_tVJrqRL08FbrhNVVqWcmCgCnUjGyVRSXjdNoYtifxg0852pBseS1FQaAe8gX6cqp-Reyk7o0proz2b';

const screenWidth = Dimensions.get('window').width;

/* ✅ MODIF : adaptation 7 cases */
const pitSize = Math.min((screenWidth - 40) / 7, 70);

interface SeedConfig {
  light: number;
  dark: number;
}

const initialBoard = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];

const seedPatterns: Record<number, SeedConfig> = {
  0: { light: 0, dark: 0 },
  1: { light: 1, dark: 0 },
  2: { light: 1, dark: 1 },
  3: { light: 2, dark: 1 },
  4: { light: 2, dark: 2 },
  5: { light: 3, dark: 2 },
  6: { light: 3, dark: 3 },
  7: { light: 4, dark: 3 },
};

function Seed({ isLight, size }: { isLight: boolean; size: number }) {
  return (
    <View
      style={[
        seedStyles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        isLight ? seedStyles.lightSeed : seedStyles.darkSeed,
        isLight ? seedStyles.lightShadow : seedStyles.darkShadow,
      ]}
    />
  );
}

const seedStyles = StyleSheet.create({
  base: {
    margin: 1.5,
  },
  lightSeed: {
    backgroundColor: '#fdfcfb',
    borderWidth: 0,
  },
  darkSeed: {
    backgroundColor: '#43302c',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  lightShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  darkShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
});

 function Pit({
  seeds,
  onPress,
  isSuggested,
  activeOwner,
}: {
  seeds: SeedConfig;
  onPress?: () => void;
  isSuggested?: boolean;
  activeOwner?: 'player' | 'opponent';
}){
  const seedSize = pitSize * 0.22;
  const seedElements: React.ReactNode[] = [];

  for (let i = 0; i < seeds.light; i++) {
    seedElements.push(<Seed key={`l-${i}`} isLight size={seedSize} />);
  }
  for (let i = 0; i < seeds.dark; i++) {
    seedElements.push(<Seed key={`d-${i}`} isLight={false} size={seedSize} />);
  }

  const activeStyle =
    activeOwner === 'player'
      ? pitStyles.activePlayer
      : activeOwner === 'opponent'
      ? pitStyles.activeOpponent
      : null;

  return (
    <Pressable
      onPress={onPress}
      style={[
        pitStyles.base,
        { width: pitSize, height: pitSize, borderRadius: pitSize / 2 },
        activeStyle,
        isSuggested && pitStyles.suggested,
      ]}
    >
      <View style={pitStyles.innerOverlay} />
      {isSuggested && <View style={pitStyles.suggestedGlow} />}
      <View style={pitStyles.seedsGrid}>{seedElements}</View>
    </Pressable>
  );
}



const pitStyles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  innerOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 999,
  },
  active: {
    borderColor: colors.secondaryContainer,
  },
  suggested: {
    borderWidth: 3,
    borderColor: 'rgba(255, 226, 171, 0.6)',
  },
  suggestedGlow: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 226, 171, 0.08)',
    borderRadius: 999,
  },
  seedsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    zIndex: 10,
  },
  activePlayer: {
    borderColor: colors.primary,
    borderWidth: 3,
    shadowColor: colors.primary,
    shadowRadius: 8,
    elevation: 6,
  },
  activeOpponent: {
    borderColor: colors.secondaryContainer,
    borderWidth: 3,
    shadowColor: colors.secondaryContainer,
    shadowRadius: 8,
    elevation: 6,
  },
});

const playerIndexes = [0, 1, 2, 3, 4, 5, 6];
const opponentIndexes = [7, 8, 9, 10, 11, 12, 13];

export default function BoardScreen({
  mode,
  player1Name,
  player2Name,
  onBack,
}: {
  mode: 'ai' | 'local';
  player1Name: string;
  player2Name: string;
  onBack: () => void;
}) {
  const [board, setBoard] = useState<number[]>(initialBoard);
  const [score, setScore] = useState({
    player: 0,
    opponent: 0,
  });
  const [currentPlayer, setCurrentPlayer] =
    useState<'player' | 'opponent'>('player');
  const [statusMessage, setStatusMessage] = useState(`${player1Name}'s Turn`);
  const [lastMoveText, setLastMoveText] = useState('Ready to play');
  const [gameOver, setGameOver] = useState(false);

  const getSeedConfig = (count: number) => {
    return seedPatterns[count] || {
      light: Math.ceil(count / 2),
      dark: count - Math.ceil(count / 2),
    };
  };

  const finishGame = useCallback((nextBoard: number[]) => {
    const playerEmpty = playerIndexes.every(i => nextBoard[i] === 0);
    const opponentEmpty = opponentIndexes.every(i => nextBoard[i] === 0);

    if (!playerEmpty && !opponentEmpty) {
      return false;
    }

    const playerRemaining = playerIndexes.reduce(
      (total, index) => total + nextBoard[index],
      0
    );
    const opponentRemaining = opponentIndexes.reduce(
      (total, index) => total + nextBoard[index],
      0
    );

    const finalPlayer1Score = score.player + playerRemaining;
    const finalPlayer2Score = score.opponent + opponentRemaining;
    let winner: 'player1' | 'player2' | 'draw';

    if (finalPlayer1Score > finalPlayer2Score) {
      winner = 'player1';
    } else if (finalPlayer2Score > finalPlayer1Score) {
      winner = 'player2';
    } else {
      winner = 'draw';
    }

    setScore(prev => ({
      player: prev.player + playerRemaining,
      opponent: prev.opponent + opponentRemaining,
    }));
    const winnerMessage =
      finalPlayer1Score > finalPlayer2Score
        ? `${player1Name} gagne !`
        : finalPlayer2Score > finalPlayer1Score
        ? `${player2Name} gagne !`
        : `Égalité`;
    setStatusMessage('Game over');
    setLastMoveText(winnerMessage);
    setGameOver(true);
    setBoard(nextBoard.map(() => 0));

    // Save game record
    saveGameRecord({
      player1Name,
      player2Name,
      player1Score: finalPlayer1Score,
      player2Score: finalPlayer2Score,
      mode,
      timestamp: Date.now(),
      winner,
    });

    // Stop background music when the game ends
    try {
      stopBgm();
    } catch {}

    return true;
  }, [player1Name, player2Name, mode, score]);

  const resetGame = () => {
    setBoard(initialBoard.slice());
    setScore({ player: 0, opponent: 0 });
    setCurrentPlayer('player');
    setStatusMessage(`${player1Name}'s Turn`);
    setLastMoveText('Ready to play');
    setGameOver(false);
  };

  const handlePitPress = (index: number) => {
    if (gameOver || board[index] === 0) {
      return;
    }

    const isPlayerSide = index < 7;
    if (mode === 'ai') {
      if (currentPlayer !== 'player' || !isPlayerSide) {
        return;
      }
    } else {
      if (currentPlayer === 'player' && !isPlayerSide) {
        return;
      }
      if (currentPlayer === 'opponent' && isPlayerSide) {
        return;
      }
    }

    const { board: nextBoard, captured } = playTurn(board, index, currentPlayer);

    setBoard(nextBoard);
    setScore(prev => ({
      ...prev,
      [currentPlayer]: prev[currentPlayer] + captured,
    }));
    setLastMoveText(
      captured > 0
        ? `${currentPlayer === 'player' ? player1Name : player2Name} captured ${captured} seeds`
        : `${currentPlayer === 'player' ? player1Name : player2Name} moved`
    );

    if (!finishGame(nextBoard)) {
      const nextPlayer =
        mode === 'local'
          ? currentPlayer === 'player'
            ? 'opponent'
            : 'player'
          : 'opponent';

      setCurrentPlayer(nextPlayer);
      setStatusMessage(
        mode === 'local'
          ? nextPlayer === 'player'
            ? `${player1Name}'s Turn`
            : `${player2Name}'s Turn`
          : `${player2Name}'s Turn`
      );
    }
  };

  useEffect(() => {
    if (mode !== 'ai' || currentPlayer !== 'opponent' || gameOver) {
      return;
    }

    const timeout = setTimeout(() => {
      const playable = opponentIndexes.filter(i => board[i] > 0);

      if (playable.length === 0) {
        finishGame(board);
        return;
      }

      const choice = playable[Math.floor(Math.random() * playable.length)];
      const { board: nextBoard, captured } = playTurn(board, choice, currentPlayer);

      setBoard(nextBoard);
      setScore(prev => ({
        ...prev,
        opponent: prev.opponent + captured,
      }));
      setLastMoveText(
        captured > 0
          ? `${player2Name} captured ${captured} seeds`
          : `${player2Name} moved`
      );

      if (!finishGame(nextBoard)) {
        setCurrentPlayer('player');
        setStatusMessage(`${player1Name}'s Turn`);
      }
    }, 900);

    return () => clearTimeout(timeout);
  }, [currentPlayer, board, gameOver, mode, player1Name, player2Name, finishGame]);

  useEffect(() => {
    AsyncStorage.getItem(SOUND_KEY)
      .then(v => {
        if (v === null || v === '1') {
          startBgm();
        } else {
          stopBgm();
        }
      })
      .catch(() => {
        // ignore
      });

    return () => {
      stopBgm();
    };
  }, []);

  const playerBoard = board.slice(0, 7);
  const opponentBoard = board.slice(7, 14);
  const suggestedPit =
    currentPlayer === 'player'
      ? playerBoard.findIndex((count, index) => count > 0 && index >= 0)
      : -1;

  return (
    <ImageBackground source={{ uri: WOOD_TEXTURE }} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />

        <View style={styles.header}>
          <Pressable style={styles.headerBtn} onPress={onBack}>
            <Text style={styles.headerBtnText}>←</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Songo</Text>
          <View style={styles.headerRightButtons}>
            <Pressable style={styles.headerBtn} onPress={resetGame}>
              <Text style={styles.headerBtnText}>New</Text>
            </Pressable>
            <Pressable style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>⚙️</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scoreboard}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>{player1Name}</Text>
              <Text style={styles.scoreValue}>{score.player}</Text>
            </View>
            <View style={[styles.scoreCard, styles.scoreCardActive]}>
              <View style={styles.activeDotRow}>
                <Text style={styles.scoreLabel}>{player2Name}</Text>
                <View style={styles.activeDot} />
              </View>
              <Text style={[styles.scoreValue, styles.scoreValueActive]}>
                {score.opponent}
              </Text>
            </View>
          </View>

          <View style={styles.turnBanner}>
            <Text style={styles.turnIcon}>⚡</Text>
            <Text style={styles.turnText}>{statusMessage}</Text>
          </View>

          <View style={styles.boardOuter}>
            <View style={styles.boardInner} />
            <View style={styles.board}>
              <View style={styles.boardRow}>
                {opponentBoard.map((count, i) => {
                  const actualIndex = i + 7;
                  const selectable = mode === 'local' && currentPlayer === 'opponent' && count > 0;
                  return (
                    <Pit
                      key={`opp-${i}`}
                      seeds={getSeedConfig(count)}
                      activeOwner={selectable ? 'opponent' : undefined}
                      onPress={selectable ? () => handlePitPress(actualIndex) : undefined}
                    />
                  );
                })}
              </View>
              <View style={styles.boardDivider} />
              <View style={styles.boardRow}>
                {playerBoard.map((count, i) => {
                  const selectable = currentPlayer === 'player' && count > 0;
                  return (
                    <Pit
                      key={`usr-${i}`}
                      seeds={getSeedConfig(count)}
                      activeOwner={selectable ? 'player' : undefined}
                      isSuggested={currentPlayer === 'player' && i === suggestedPit}
                      onPress={selectable ? () => handlePitPress(i) : undefined}
                    />
                  );
                })}
              </View>
            </View>
          </View>

          {gameOver && (
            <Pressable style={styles.restartButton} onPress={resetGame}>
              <Text style={styles.restartButtonText}>Recommencer</Text>
            </Pressable>
          )}

          <View style={styles.actionArea}>
            <View style={styles.lastMove}>
              <Text style={styles.lastMoveIcon}>⏱️</Text>
              <Text style={styles.lastMoveText}>{lastMoveText}</Text>
              <Pressable>
                <Text style={styles.viewHistory}>View History</Text>
              </Pressable>
            </View>
            <View style={styles.tipsCard}>
              <View style={styles.tipsContent}>
                <View style={styles.tipsTextBlock}>
                  <Text style={styles.tipsTitle}>Artisanal Tips</Text>
                  <Text style={styles.tipsBody}>
                    Try to keep a high density of seeds in your right-most pits
                    to setup a capture chain.
                  </Text>
                </View>
                <Pressable style={styles.gotItBtn}>
                  <Text style={styles.gotItBtnText}>Got it</Text>
                </Pressable>
              </View>
              <Image
                source={{ uri: BOARD_BG }}
                style={styles.tipsBg}
              />
            </View>
          </View>
        </ScrollView>

        <Pressable style={styles.fab}>
          <Text style={styles.fabIcon}>💡</Text>
        </Pressable>

        <BottomNav activeTab="play" onTabChange={() => {}} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    height: 64,
    backgroundColor: colors.surfaceContainerHigh,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnText: {
    fontSize: 22,
    color: colors.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: 24,
    paddingBottom: 100,
    alignItems: 'center',
  },
  scoreboard: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.gutter,
    marginBottom: 32,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.xl,
    padding: spacing.gutter,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(80, 68, 67, 0.3)',
  },
  scoreCardActive: {
    borderWidth: 2,
    borderColor: colors.secondaryContainer,
    shadowColor: colors.secondaryContainer,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  scoreValue: {
    ...typography.headlineLg,
    color: colors.primary,
  },
  scoreValueActive: {
    color: colors.secondaryContainer,
  },
  activeDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.unit,
    marginBottom: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondaryContainer,
  },
  turnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(86, 39, 0, 0.4)',
    paddingHorizontal: 24,
    paddingVertical: spacing.unit,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 182, 135, 0.2)',
    marginBottom: 40,
  },
  turnIcon: {
    fontSize: 18,
    color: colors.tertiary,
  },
  turnText: {
    ...typography.titleMd,
    color: colors.tertiary,
  },
  boardOuter: {
    position: 'relative',
    width: '100%',
    maxWidth: 520,
    aspectRatio: 2,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 40,
    padding: spacing.boardPadding,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 12,
    marginBottom: 48,
    overflow: 'hidden',
  },
  boardInner: {
    position: 'absolute',
    top: spacing.gutter,
    left: spacing.gutter,
    right: spacing.gutter,
    bottom: spacing.gutter,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.4)',
  },
  board: {
    flex: 1,
    justifyContent: 'space-between',
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  boardDivider: {
    height: 1,
    backgroundColor: 'rgba(80, 68, 67, 0.3)',
    marginVertical: 4,
    marginHorizontal: spacing.unit,
  },
  restartButton: {
    marginVertical: spacing.gutter,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restartButtonText: {
    ...typography.titleMd,
    color: colors.onTertiary,
  },
  actionArea: {
    width: '100%',
    gap: spacing.gutter,
  },
  lastMove: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.unit,
    paddingHorizontal: spacing.unit,
  },
  lastMoveIcon: {
    fontSize: 16,
    color: colors.secondary,
  },
  lastMoveText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  viewHistory: {
    ...typography.titleMd,
    color: colors.secondary,
    fontSize: 14,
    lineHeight: 20,
  },
  tipsCard: {
    backgroundColor: colors.surfaceContainerLow,
    padding: 24,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: 'rgba(80, 68, 67, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  tipsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  tipsTextBlock: {
    flex: 1,
    marginRight: spacing.gutter,
  },
  tipsTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  tipsBody: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontSize: 13,
    lineHeight: 20,
  },
  gotItBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 24,
    paddingVertical: spacing.unit + 2,
    borderRadius: borderRadius.full,
  },
  gotItBtnText: {
    ...typography.titleMd,
    color: colors.onSecondary,
    fontSize: 14,
  },
  tipsBg: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '33%',
    opacity: 0.1,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 40,
  },
  fabIcon: {
    fontSize: 24,
    color: colors.onSecondaryContainer,
  },
});
