import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, fonts } from '../lib/theme';

type AvatarProps = {
  source?: number;
  initials?: string;
  size?: number;
  color?: string;
  story?: boolean;
  seen?: boolean;
  style?: ViewStyle;
};

export function Avatar({ source, initials = 'कु', size = 52, color = colors.maroon, story, seen, style }: AvatarProps) {
  const content = (
    <View style={[styles.avatarInner, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, story && styles.avatarStoryInner]}>
      {source ? (
        <Image source={source} style={{ width: '100%', height: '100%', borderRadius: size / 2 }} contentFit="cover" transition={180} />
      ) : (
        <Text style={[styles.avatarInitial, { fontSize: size * 0.31 }]}>{initials}</Text>
      )}
    </View>
  );

  if (story) {
    return (
      <LinearGradient colors={seen ? ['#CFC5BB', '#AFA49A'] : [colors.gold, '#D66D29', colors.maroon]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[{ width: size + 7, height: size + 7, borderRadius: (size + 7) / 2, alignItems: 'center', justifyContent: 'center' }, style]}>
        {content}
      </LinearGradient>
    );
  }
  return <View style={style}>{content}</View>;
}

export function Waveform({ active = false, color = colors.maroon, compact = false }: { active?: boolean; color?: string; compact?: boolean }) {
  const bars = compact ? [7, 15, 10, 20, 13, 8, 17, 11, 21, 14, 8, 16, 10, 18] : [8, 16, 11, 24, 18, 10, 22, 14, 27, 19, 9, 17, 12, 23, 15, 8, 19, 11, 25, 14, 9, 20];
  return (
    <View style={styles.waveform}>
      {bars.map((height, index) => (
        <View key={index} style={{ width: compact ? 2 : 3, height, borderRadius: 2, backgroundColor: active || index < 8 ? color : `${color}55`, marginRight: compact ? 2 : 3 }} />
      ))}
    </View>
  );
}

export function RoundIconButton({ icon, onPress, color = colors.ink, background = colors.white, size = 44, accessibilityLabel }: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; color?: string; background?: string; size?: number; accessibilityLabel: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.roundButton, { width: size, height: size, borderRadius: size / 2, backgroundColor: background }, pressed && styles.pressed]}>
      <Ionicons name={icon} size={size * 0.48} color={color} />
    </Pressable>
  );
}

export function ScreenTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.titleRow}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.screenTitle}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function Pill({ text, icon, tone = 'maroon' }: { text: string; icon?: keyof typeof Ionicons.glyphMap; tone?: 'maroon' | 'gold' | 'green' | 'neutral' }) {
  const palette = {
    maroon: { bg: colors.maroonSoft, fg: colors.maroon },
    gold: { bg: colors.goldSoft, fg: '#8A5A00' },
    green: { bg: colors.greenSoft, fg: '#166E49' },
    neutral: { bg: colors.silk, fg: colors.muted },
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      {icon ? <Ionicons name={icon} size={13} color={palette.fg} /> : null}
      <Text style={[styles.pillText, { color: palette.fg }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarInner: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avatarStoryInner: { borderWidth: 3, borderColor: colors.cream },
  avatarInitial: { color: colors.white, fontFamily: fonts.bold },
  waveform: { flexDirection: 'row', alignItems: 'center', height: 30, overflow: 'hidden' },
  roundButton: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  pressed: { opacity: 0.68, transform: [{ scale: 0.96 }] },
  titleRow: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14, flexDirection: 'row', alignItems: 'center' },
  eyebrow: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 3 },
  screenTitle: { color: colors.ink, fontFamily: fonts.devanagari, fontSize: 29, lineHeight: 37 },
  pill: { minHeight: 27, paddingHorizontal: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 5 },
  pillText: { fontFamily: fonts.semibold, fontSize: 11 },
});
