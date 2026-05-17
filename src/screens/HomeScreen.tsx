import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  StatusBar,
  ImageBackground,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography, spacing, borderRadius } from '../theme';
import BottomNav from '../components/BottomNav';
import { loadGameHistory, GameRecord, formatDate, getWinnerText } from '../game/history';
import { startBgm, stopBgm } from '../game/sound';

const WOOD_TEXTURE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCN_U-fyy7ZEVtNDFn03YqmEyQ74qlabAVi0taNJusuiTw5_GEzfTzLc8xLdT9X8728f5GvSXijFyAQOJnkSEqIkiuaq-X1MSA1_m_WOw3IUB-_joBLFx4I8aCwjGuK4SetYZto8nVjRjuYDJipXdWOqtaOmcpGjCYRoJ-zPpdvkxTjYmKQIMfmCa7dI_eXttNMjKWeoMcz-ejQC8Atr5BE5yB2RXtDJnS8_rBMZizbPER9Jo09iIbzILbV6DH78NC4T2xp8hPALxdy';
const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVNWCXyMLoPx7WhYNlnfy5vOWY4k1GpyEuZw_ZNpql-BqFK0p9hBtS-s8oZldiV4ZAMIOd2CoFlXPyxlyiIahcZ07V3tMnYwIN_o-MJNUmxZCnYg-mlNC4k7XdgvmsJ_LeqVo9XVq-TlI-5-WHN4MG65WRClfRpZO3dt_oSyteVQuN2keO0hZn9LTK898KliO2rUgXJLocoX4UA0ERp3LtA7DD5nZTE5kqI2HXfBFXW-RvlammVriYhHBUrm7mVjQUMkQE8YI-yVEB';

const PLAYER_1_KEY = 'songo_player1';
const PLAYER_2_KEY = 'songo_player2';
const SOUND_KEY = 'songo_sound';

interface HomeScreenProps {
  onNavigate: (mode: 'ai' | 'local', player1: string, player2: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [player1Name, setPlayer1Name] = useState('Joueur 1');
  const [player2Name, setPlayer2Name] = useState('Joueur 2');
  const [storedNames, setStoredNames] = useState<{
    player1: string;
    player2: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    AsyncStorage.multiGet([PLAYER_1_KEY, PLAYER_2_KEY])
      .then(values => {
        const saved1 = values[0][1];
        const saved2 = values[1][1];
        if (saved1 && saved2) {
          setStoredNames({ player1: saved1, player2: saved2 });
          setPlayer1Name(saved1);
          setPlayer2Name(saved2);
          setIsEditing(false);
        } else {
          setIsEditing(true);
        }
      })
      .catch(() => {
        setIsEditing(true);
      });

    // Load game history
    loadGameHistory().then(records => {
      setHistory(records.slice(-3).reverse()); // Last 3 games, newest first
    });

    // Load sound preference
    AsyncStorage.getItem(SOUND_KEY)
      .then(v => {
        const on = v === null ? true : v === '1';
        setSoundOn(on);
        if (on) {
          startBgm();
        } else {
          stopBgm();
        }
      })
      .catch(() => {});
  }, []);

  const saveNames = async (first: string, second: string) => {
    const normalized1 = first.trim() || 'Joueur 1';
    const normalized2 = second.trim() || 'Joueur 2';
    try {
      await AsyncStorage.multiSet([
        [PLAYER_1_KEY, normalized1],
        [PLAYER_2_KEY, normalized2],
      ]);
    } catch {
      // Silently ignore AsyncStorage errors (module not installed)
    }
    setStoredNames({ player1: normalized1, player2: normalized2 });
    setPlayer1Name(normalized1);
    setPlayer2Name(normalized2);
    setIsEditing(false);
    return { player1: normalized1, player2: normalized2 };
  };

  const handleStart = async (mode: 'ai' | 'local') => {
    const names = await saveNames(player1Name, player2Name);
    onNavigate(mode, names.player1, names.player2);
  };

  const toggleSound = async () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      await AsyncStorage.setItem(SOUND_KEY, next ? '1' : '0');
    } catch {}
    if (next) startBgm(); else stopBgm();
  };

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
            {storedNames && !isEditing ? (
              <>
                <View style={styles.savedNamesCard}>
                  <Text style={styles.savedNamesTitle}>Derniers joueurs</Text>
                  <Text style={styles.savedNamesText}>{storedNames.player1}</Text>
                  <Text style={styles.savedNamesText}>{storedNames.player2}</Text>
                </View>
                <Pressable style={styles.playBtn} onPress={() => handleStart('ai')}>
                  <View style={styles.playBtnOverlay} />
                  <Text style={styles.playBtnIcon}>🤖</Text>
                  <Text style={styles.playBtnLabel}>Reprendre contre l'IA</Text>
                  <Text style={styles.playBtnSub}>Avec les mêmes noms</Text>
                </Pressable>
                <Pressable
                  style={[styles.playBtn, styles.playBtnSecondary]}
                  onPress={() => handleStart('local')}
                >
                  <View style={styles.playBtnOverlay} />
                  <Text style={styles.playBtnIcon}>👥</Text>
                  <Text style={styles.playBtnLabel}>Reprendre à 2 joueurs</Text>
                  <Text style={styles.playBtnSub}>Avec les mêmes noms</Text>
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={() => setIsEditing(true)}>
                  <Text style={styles.secondaryBtnIcon}>✏️</Text>
                  <Text style={styles.secondaryBtnLabel}>Changer les noms</Text>
                </Pressable>
              </>
            ) : (
              <>
                <View style={styles.formCard}>
                  <Text style={styles.formLabel}>Nom du joueur 1</Text>
                  <TextInput
                    style={styles.textInput}
                    value={player1Name}
                    onChangeText={setPlayer1Name}
                    placeholder="Joueur 1"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                  <Text style={styles.formLabel}>Nom du joueur 2</Text>
                  <TextInput
                    style={styles.textInput}
                    value={player2Name}
                    onChangeText={setPlayer2Name}
                    placeholder="Joueur 2"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                  />
                </View>
                <Pressable style={styles.playBtn} onPress={() => handleStart('ai')}>
                  <View style={styles.playBtnOverlay} />
                  <Text style={styles.playBtnIcon}>🤖</Text>
                  <Text style={styles.playBtnLabel}>Jouer contre l'IA</Text>
                  <Text style={styles.playBtnSub}>Sauvegarde les noms</Text>
                </Pressable>
                <Pressable
                  style={[styles.playBtn, styles.playBtnSecondary]}
                  onPress={() => handleStart('local')}
                >
                  <View style={styles.playBtnOverlay} />
                  <Text style={styles.playBtnIcon}>👥</Text>
                  <Text style={styles.playBtnLabel}>Jouer à 2 joueurs</Text>
                  <Text style={styles.playBtnSub}>Sauvegarde les noms</Text>
                </Pressable>
              </>
            )}

            <Pressable style={styles.secondaryBtn} onPress={() => setShowRules(true)}>
              <Text style={styles.secondaryBtnIcon}>📖</Text>
              <Text style={styles.secondaryBtnLabel}>Rules</Text>
              <Text style={styles.secondaryBtnSub}>HOW TO HARVEST</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => setShowStats(true)}>
              <Text style={styles.secondaryBtnIcon}>🏆</Text>
              <Text style={styles.secondaryBtnLabel}>Scores</Text>
              <Text style={styles.secondaryBtnSub}>ELDER RECORDS</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={toggleSound}>
              <Text style={styles.secondaryBtnIcon}>{soundOn ? '🔊' : '🔇'}</Text>
              <Text style={styles.secondaryBtnLabel}>Son</Text>
              <Text style={styles.secondaryBtnSub}>{soundOn ? 'ON' : 'OFF'}</Text>
            </Pressable>
          </View>

          {showRules && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Règles du Songo</Text>
                  <Pressable onPress={() => setShowRules(false)}>
                    <Text style={styles.modalCloseBtn}>✕</Text>
                  </Pressable>
                </View>
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.rulesText}>
                    <Text style={styles.rulesBold}>Songo</Text> est un jeu de stratégie africain joué sur un plateau avec 14 puits (7 par joueur) et des graines.
                  </Text>

                  <Text style={styles.rulesSubtitle}>🎯 Objectif</Text>
                  <Text style={styles.rulesText}>
                    Capturer plus de graines que votre adversaire en fin de partie.
                  </Text>

                  <Text style={styles.rulesSubtitle}>📋 Règles Principales</Text>
                  <Text style={styles.rulesText}>
                    • Chaque joueur contrôle les 7 puits de son côté{'\n'}
                    • Sélectionnez un puits avec des graines{'\n'}
                    • Distribuez les graines une par une dans les puits suivants{'\n'}
                    • Si vous terminez votre semis dans un puits adverse à 2 ou 3 graines, vous capturez ces graines{'\n'}
                    • Les captures en chaîne sont automatiques tant que vous trouvez des cases adverses à 2 ou 3 graines{'\n'}
                    • Le jeu se termine quand tous les puits d'un joueur sont vides
                  </Text>

                  <Text style={styles.rulesSubtitle}>🏆 Victoire</Text>
                  <Text style={styles.rulesText}>
                    Le joueur avec le plus de graines capturées gagne la partie.
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}

          {showStats && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Statistiques & Historique</Text>
                  <Pressable onPress={() => setShowStats(false)}>
                    <Text style={styles.modalCloseBtn}>✕</Text>
                  </Pressable>
                </View>
                <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                  {history.length > 0 ? (
                    <>
                      <Text style={styles.statsTitle}>Dernières Parties</Text>
                      {history.map(record => (
                        <View key={record.id} style={styles.historyCard}>
                          <View>
                            <Text style={styles.historyGameMode}>
                              {record.mode === 'ai' ? '🤖 vs IA' : '👥 2 joueurs'}
                            </Text>
                            <Text style={styles.historyScores}>
                              {record.player1Name} {record.player1Score} - {record.player2Score} {record.player2Name}
                            </Text>
                            <Text style={styles.historyWinner}>{getWinnerText(record)}</Text>
                          </View>
                          <Text style={styles.historyDate}>{formatDate(record.timestamp)}</Text>
                        </View>
                      ))}
                    </>
                  ) : (
                    <Text style={styles.emptyText}>Aucune partie jouée pour le moment</Text>
                  )}
                </ScrollView>
              </View>
            </View>
          )}

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
  playBtnSecondary: {
    backgroundColor: colors.tertiaryContainer,
  },
  savedNamesCard: {
    padding: spacing.gutter,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.gutter,
  },
  savedNamesTitle: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  savedNamesText: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: 2,
  },
  formCard: {
    marginBottom: spacing.gutter,
    padding: spacing.gutter,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  formLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 6,
  },
  textInput: {
    width: '100%',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: spacing.gutter,
    color: colors.onSurface,
    backgroundColor: 'rgba(255,255,255,0.04)',
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
  historySection: {
    width: '100%',
    marginTop: spacing.unit * 2,
  },
  historySectionTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.gutter,
    paddingHorizontal: spacing.gutter,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.gutter,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.md,
    marginBottom: spacing.unit,
    marginHorizontal: spacing.gutter,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  historyGameMode: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  historyScores: {
    ...typography.labelSm,
    color: colors.onSurface,
    marginBottom: 4,
    fontWeight: '600',
  },
  historyWinner: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: '500',
  },
  historyDate: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'right',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '90%',
    paddingTop: spacing.gutter,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingBottom: spacing.gutter,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
  },
  modalCloseBtn: {
    fontSize: 24,
    color: colors.onSurfaceVariant,
  },
  modalScroll: {
    paddingHorizontal: spacing.gutter,
    paddingVertical: spacing.unit,
  },
  rulesText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginBottom: spacing.unit,
    lineHeight: 22,
  },
  rulesBold: {
    fontWeight: '700',
  },
  rulesSubtitle: {
    ...typography.titleMd,
    color: colors.secondary,
    marginTop: spacing.unit,
    marginBottom: spacing.unit * 0.5,
  },
  statsTitle: {
    ...typography.titleMd,
    color: colors.onSurface,
    marginBottom: spacing.gutter,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginVertical: spacing.unit * 2,
  },
});
