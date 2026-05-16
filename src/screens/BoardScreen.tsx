import React from 'react';
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

const WOOD_TEXTURE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCpFEfZBmR8yqY-_6gXTdO5L1TmhH4u7MM5Hi2I7EWCGgS7HA7Bdz9HWNDpJ8aP-HWbzXTzoCvHoDjwQ2-s_z90JeUVj7GYwxYF5_d6_EVnxblRFIrLJkTY8b7-ImKIFIK7t7pgMnpXuDJjK7rn9QmX-JT4SyeGRbSz-CbqYi_gMC4FRYGNJiQcbOqRq214E3Iuc9vWlquhfp3Ip62_LhwKsaxZGafecVMH7S0mkEDkAjgYwK0_1d8uyKF0MQF1N8EjWcgzN67OaLT2';
const BOARD_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCp0X0t79mmXPes4x27y7B3_qSMtKP6AStD30FK5mNpgoEh5Z8RRWWgei7XnMMWoZ4ZZi7UlFeEww4qrC4wBotHRrLiXY8116WDIHDn4WZxNMzX0s5lrZ13c59fSM-j7N4xeozf_Npk0adEKlsSnpuEMURGj2ru_i13PwO5QPt2iARWe_h_KKcM0jGqX8K2g_tVJrqRL08FbrhNVVqWcmCgCnUjGyVRSXjdNoYtifxg0852pBseS1FQaAe8gX6cqp-Reyk7o0proz2b';

const screenWidth = Dimensions.get('window').width;
const pitSize = Math.min((screenWidth - 80) / 6, 80);

interface SeedConfig {
  light: number;
  dark: number;
}

const opponentPits: SeedConfig[] = [
  { light: 2, dark: 1 },
  { light: 1, dark: 3 },
  { light: 2, dark: 0 },
  { light: 2, dark: 3 },
  { light: 1, dark: 0 },
  { light: 1, dark: 3 },
];

const userPits: SeedConfig[] = [
  { light: 2, dark: 2 },
  { light: 1, dark: 2 },
  { light: 2, dark: 2 },
  { light: 2, dark: 0 },
  { light: 1, dark: 2 },
  { light: 3, dark: 2 },
];

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
  isActive,
  isSuggested,
}: {
  seeds: SeedConfig;
  isActive?: boolean;
  isSuggested?: boolean;
}) {
  const seedSize = pitSize * 0.22;
  const seedElements: React.ReactNode[] = [];

  for (let i = 0; i < seeds.light; i++) {
    seedElements.push(<Seed key={`l-${i}`} isLight size={seedSize} />);
  }
  for (let i = 0; i < seeds.dark; i++) {
    seedElements.push(<Seed key={`d-${i}`} isLight={false} size={seedSize} />);
  }

  return (
    <Pressable
      style={[
        pitStyles.base,
        { width: pitSize, height: pitSize, borderRadius: pitSize / 2 },
        isActive && pitStyles.active,
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
});

export default function BoardScreen() {
  return (
    <ImageBackground source={{ uri: WOOD_TEXTURE }} style={styles.bg}>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />

        <View style={styles.header}>
          <Pressable style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>☰</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Songo</Text>
          <Pressable style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>⚙️</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scoreboard}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>PLAYER 1</Text>
              <Text style={styles.scoreValue}>12</Text>
            </View>
            <View style={[styles.scoreCard, styles.scoreCardActive]}>
              <View style={styles.activeDotRow}>
                <Text style={styles.scoreLabel}>PLAYER 2</Text>
                <View style={styles.activeDot} />
              </View>
              <Text style={[styles.scoreValue, styles.scoreValueActive]}>
                08
              </Text>
            </View>
          </View>

          <View style={styles.turnBanner}>
            <Text style={styles.turnIcon}>⚡</Text>
            <Text style={styles.turnText}>Your Turn</Text>
          </View>

          <View style={styles.boardOuter}>
            <View style={styles.boardInner} />
            <View style={styles.board}>
              <View style={styles.boardRow}>
                {opponentPits.map((pit, i) => (
                  <Pit
                    key={`opp-${i}`}
                    seeds={pit}
                  />
                ))}
              </View>
              <View style={styles.boardDivider} />
              <View style={styles.boardRow}>
                {userPits.map((pit, i) => (
                  <Pit
                    key={`usr-${i}`}
                    seeds={pit}
                    isActive
                    isSuggested={i === 2}
                  />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.actionArea}>
            <View style={styles.lastMove}>
              <Text style={styles.lastMoveIcon}>⏱️</Text>
              <Text style={styles.lastMoveText}>
                Last move: Player 1 captured 2 seeds
              </Text>
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
