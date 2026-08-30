import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadow } from '../lib/theme';

export type TabKey = 'home' | 'tree' | 'chats' | 'directory';

const tabs: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'tree', label: 'Vriksha', icon: 'git-network-outline', activeIcon: 'git-network' },
  { key: 'chats', label: 'Chats', icon: 'chatbubbles-outline', activeIcon: 'chatbubbles' },
  { key: 'directory', label: 'Directory', icon: 'people-outline', activeIcon: 'people' },
];

export function BottomNav({ active, onChange, onAdd }: { active: TabKey; onChange: (tab: TabKey) => void; onAdd: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, Platform.OS === 'web' ? 12 : 8) }]}>
      {tabs.slice(0, 2).map((tab) => <NavItem key={tab.key} tab={tab} active={active === tab.key} onPress={() => onChange(tab.key)} />)}
      <View style={styles.addSlot}>
        <Pressable accessibilityRole="button" accessibilityLabel="Add a family memory" onPress={onAdd} style={({ pressed }) => [styles.addWrap, pressed && { transform: [{ scale: 0.94 }] }]}>
          <LinearGradient colors={[colors.gold, '#C66A28', colors.maroon]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.addButton}>
            <Ionicons name="camera" size={24} color={colors.white} />
            <View style={styles.micBadge}><Ionicons name="mic" size={10} color={colors.maroon} /></View>
          </LinearGradient>
          <Text style={styles.addLabel}>Memory</Text>
        </Pressable>
      </View>
      {tabs.slice(2).map((tab) => <NavItem key={tab.key} tab={tab} active={active === tab.key} onPress={() => onChange(tab.key)} />)}
    </View>
  );
}

function NavItem({ tab, active, onPress }: { tab: typeof tabs[number]; active: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={onPress} style={({ pressed }) => [styles.item, pressed && { opacity: 0.55 }]}>
      <View style={[styles.iconWrap, active && styles.iconActive]}>
        <Ionicons name={active ? tab.activeIcon : tab.icon} size={23} color={active ? colors.maroon : colors.muted} />
      </View>
      <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: { minHeight: 72, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'flex-start', ...shadow },
  item: { flex: 1, minHeight: 54, alignItems: 'center', justifyContent: 'flex-start', gap: 2 },
  iconWrap: { width: 40, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  iconActive: { backgroundColor: colors.maroonSoft },
  label: { color: colors.muted, fontFamily: fonts.medium, fontSize: 9.5 },
  labelActive: { color: colors.maroon, fontFamily: fonts.bold },
  addSlot: { flex: 1, alignItems: 'center' },
  addWrap: { alignItems: 'center', marginTop: -28 },
  addButton: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: colors.white, ...shadow },
  micBadge: { position: 'absolute', right: 7, bottom: 8, width: 17, height: 17, borderRadius: 9, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  addLabel: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 9.5, marginTop: 2 },
});
