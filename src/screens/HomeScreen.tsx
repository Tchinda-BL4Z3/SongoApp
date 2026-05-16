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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import BottomNav from '../components/BottomNav';

const WOOD_TEXTURE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCN_U-fyy7ZEVtNDFn03YqmEyQ74qlabAVi0taNJusuiTw5_GEzfTzLc8xLdT9X8728f5GvSXijFyAQOJnkSEqIkiuaq-X1MSA1_m_WOw3IUB-_joBLFx4I8aCwjGuK4SetYZto8nVjRjuYDJipXdWOqtaOmcpGjCYRoJ-zPpdvkxTjYmKQIMfmCa7dI_eXttNMjKWeoMcz-ejQC8Atr5BE5yB2RXtDJnS8_rBMZizbPER9Jo09iIbzILbV6DH78NC4T2xp8hPALxdy';
const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVNWCXyMLoPx7WhYNlnfy5vOWY4k1GpyEuZw_ZNpql-BqFK0p9hBtS-s8oZldiV4ZAMIOd2CoFlXPyxlyiIahcZ07V3tMnYwIN_o-MJNUmxZCnYg-mlNC4k7XdgvmsJ_LeqVo9XVq-TlI-5-WHN4MG65WRClfRpZO3dt_oSyteVQuN2keO0hZn9LTK898KliO2rUgXJLocoX4UA0ERp3LtA7DD5nZTE5kqI2HXfBFXW-RvlammVriYhHBUrm7mVjQUMkQE8YI-yVEB';

interface HomeScreenProps {
  onNavigate: (screen: 'board') => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
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
          <View style={styles.heroSection}>
            <View style={styles.glowBackdrop} />
            <View style={styles.heroImageOuter}>
              <View style={styles.heroImageInner}>
                <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} />
              </View>
            </View>
            <Text style={styles.heroTitle}>Songo</Text>
            <Text style={styles.heroTagline}>
              An ancestral journey carved in wood, played with spirit.
            </Text>
          </View>

          <View style={styles.menuGrid}>
            <Pressable
              style={styles.playBtn}
              onPress={() => onNavigate('board')}
            >
              <View style={styles.playBtnOverlay} />
              <Text style={styles.playBtnIcon}>🎮</Text>
              <Text style={styles.playBtnLabel}>Play</Text>
              <Text style={styles.playBtnSub}>START A NEW JOURNEY</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnIcon}>📖</Text>
              <Text style={styles.secondaryBtnLabel}>Rules</Text>
              <Text style={styles.secondaryBtnSub}>HOW TO HARVEST</Text>
            </Pressable>

            <Pressable style={styles.secondaryBtn}>
              <Text style={styles.secondaryBtnIcon}>🏆</Text>
              <Text style={styles.secondaryBtnLabel}>Scores</Text>
              <Text style={styles.secondaryBtnSub}>ELDER RECORDS</Text>
            </Pressable>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.statIconPrimary]}>
                <Text style={styles.statIconText}>⏱️</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Last Game</Text>
                <Text style={styles.statValue}>24 Seeds</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, styles.statIconTertiary]}>
                <Text style={styles.statIconText}>✦</Text>
              </View>
              <View>
                <Text style={styles.statLabel}>Tutorial</Text>
                <Text style={styles.statValue}>80% Done</Text>
              </View>
            </View>
          </View>
        </ScrollView>

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
    fontFamily: undefined,
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
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 48,
    position: 'relative',
  },
  glowBackdrop: {
    position: 'absolute',
    top: -20,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(255, 191, 0, 0.05)',
  },
  heroImageOuter: {
    marginBottom: spacing.gutter,
    padding: 24,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(55, 38, 34, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(80, 68, 67, 0.2)',
    overflow: 'hidden',
  },
  heroImageInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: 'rgba(255, 191, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroTitle: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
    letterSpacing: -0.02,
    color: colors.onSurface,
    marginBottom: spacing.unit,
  },
  heroTagline: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },
  menuGrid: {
    width: '100%',
    gap: spacing.gutter,
    marginBottom: 32,
  },
  playBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 32,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.secondaryContainer,
    position: 'relative',
    overflow: 'hidden',
  },
  playBtnOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  playBtnIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  playBtnLabel: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  playBtnSub: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
    opacity: 0.8,
    marginTop: 4,
  },
  secondaryBtn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(67, 48, 44, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 226, 171, 0.2)',
  },
  secondaryBtnIcon: {
    fontSize: 36,
    marginBottom: spacing.unit,
    color: colors.secondary,
  },
  secondaryBtnLabel: {
    ...typography.titleMd,
    color: colors.secondary,
  },
  secondaryBtnSub: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.gutter,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.gutter,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statIconPrimary: {
    backgroundColor: colors.primaryContainer,
  },
  statIconTertiary: {
    backgroundColor: colors.tertiaryContainer,
  },
  statIconText: {
    fontSize: 18,
    color: colors.primary,
  },
  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  statValue: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
});
