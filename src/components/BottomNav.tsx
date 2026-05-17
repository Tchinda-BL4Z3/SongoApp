import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';

interface BottomNavProps {
  activeTab: 'play' | 'rules' | 'scores';
  onTabChange?: (tab: 'play' | 'rules' | 'scores') => void;
}

const tabs = [
  { key: 'play' as const, label: 'Play', icon: '🎮' },
  { key: 'rules' as const, label: 'Rules', icon: '📖' },
  { key: 'scores' as const, label: 'Scores', icon: '🏆' },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange?.(tab.key)}
          >
            <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.gutter,
    paddingVertical: 12,
    paddingBottom: 24,
    backgroundColor: colors.surfaceContainer,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  activeTab: {
    backgroundColor: colors.secondaryContainer,
  },
  tabIcon: {
    fontSize: 20,
    color: colors.onSurfaceVariant,
  },
  activeTabIcon: {
    color: colors.onSecondaryContainer,
  },
  tabLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  activeTabLabel: {
    color: colors.onSecondaryContainer,
  },
});
