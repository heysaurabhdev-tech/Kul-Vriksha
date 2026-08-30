import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { TiroDevanagariHindi_400Regular } from '@expo-google-fonts/tiro-devanagari-hindi';
import { BottomNav, TabKey } from './components/BottomNav';
import { AddMemoryModal } from './components/AddMemoryModal';
import { HomeScreen } from './screens/HomeScreen';
import { TreeScreen } from './screens/TreeScreen';
import { ChatsScreen } from './screens/ChatsScreen';
import { DirectoryScreen } from './screens/DirectoryScreen';
import { colors, fonts, shadow } from './lib/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    TiroDevanagariHindi_400Regular,
  });
  const [active, setActive] = useState<TabKey>('home');
  const [addVisible, setAddVisible] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!fontsLoaded) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.maroon} /></View>;
  }

  const screen = {
    home: <HomeScreen onAdd={() => setAddVisible(true)} />,
    tree: <TreeScreen />,
    chats: <ChatsScreen />,
    directory: <DirectoryScreen />,
  }[active];

  return (
    <SafeAreaProvider>
      <View style={styles.outer}>
        <SafeAreaView edges={['top']} style={styles.appShell}>
          <StatusBar style="dark" />
          <Animated.View key={active} entering={FadeIn.duration(180)} style={styles.screen}>
            {screen}
          </Animated.View>
          <BottomNav active={active} onChange={setActive} onAdd={() => setAddVisible(true)} />
          {toast ? (
            <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)} style={styles.toast}>
              <View style={styles.toastCheck}><Ionicons name="checkmark" size={16} color={colors.white} /></View>
              <Text style={styles.toastText}>{toast}</Text>
            </Animated.View>
          ) : null}
          <AddMemoryModal visible={addVisible} onClose={() => setAddVisible(false)} onSaved={(message) => { setAddVisible(false); setToast(message); }} />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  outer: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#EDE7E1' : colors.cream },
  appShell: { flex: 1, width: '100%', maxWidth: 500, alignSelf: 'center', backgroundColor: colors.cream, overflow: 'hidden', ...(Platform.OS === 'web' ? shadow : {}) },
  screen: { flex: 1 },
  toast: { position: 'absolute', left: 20, right: 20, bottom: 94, minHeight: 54, borderRadius: 17, backgroundColor: colors.ink, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10, ...shadow },
  toastCheck: { width: 29, height: 29, borderRadius: 15, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  toastText: { flex: 1, color: colors.white, fontFamily: fonts.semibold, fontSize: 11, lineHeight: 16 },
});
