import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, shadow } from '../lib/theme';
import { Waveform } from './Shared';

type Mode = 'photo' | 'voice';

export function AddMemoryModal({ visible, onClose, onSaved }: { visible: boolean; onClose: () => void; onSaved: (message: string) => void }) {
  const [mode, setMode] = useState<Mode>('photo');
  const [caption, setCaption] = useState('');
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) timer.current = setInterval(() => setSeconds((s) => Math.min(s + 1, 15)), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [recording]);

  useEffect(() => {
    if (seconds >= 15) setRecording(false);
  }, [seconds]);

  const save = () => {
    const message = mode === 'voice' ? `15-second voice memory saved${caption ? ' with its story' : ''}` : 'Photo memory added to your family feed';
    onSaved(message);
    setCaption(''); setSeconds(0); setRecording(false); setMode('photo');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View>
              <Text style={styles.kicker}>नई याद जोड़ें</Text>
              <Text style={styles.title}>Add a family memory</Text>
            </View>
            <Pressable onPress={onClose} style={styles.close}><Ionicons name="close" size={24} color={colors.ink} /></Pressable>
          </View>
          <View style={styles.segment}>
            <Pressable onPress={() => { setMode('photo'); setRecording(false); }} style={[styles.segmentItem, mode === 'photo' && styles.segmentActive]}>
              <Ionicons name="camera" size={20} color={mode === 'photo' ? colors.white : colors.maroon} /><Text style={[styles.segmentText, mode === 'photo' && { color: colors.white }]}>Photo</Text>
            </Pressable>
            <Pressable onPress={() => setMode('voice')} style={[styles.segmentItem, mode === 'voice' && styles.segmentActive]}>
              <Ionicons name="mic" size={20} color={mode === 'voice' ? colors.white : colors.maroon} /><Text style={[styles.segmentText, mode === 'voice' && { color: colors.white }]}>Voice story</Text>
            </Pressable>
          </View>

          {mode === 'photo' ? (
            <Pressable onPress={() => onSaved('Photo library opened — choose a treasured family photograph')} style={styles.photoPicker}>
              <LinearGradient colors={[colors.goldSoft, colors.maroonSoft]} style={styles.pickerIcon}><Ionicons name="images-outline" size={31} color={colors.maroon} /></LinearGradient>
              <Text style={styles.pickerTitle}>Choose from family album</Text>
              <Text style={styles.pickerSub}>Original quality · AI restoration available</Text>
            </Pressable>
          ) : (
            <View style={styles.recorder}>
              <Text style={styles.recLabel}>{seconds === 0 ? 'Tap to record an elder’s memory' : recording ? 'Listening…' : 'Voice memory ready'}</Text>
              <View style={styles.waveRow}><Waveform active={recording || seconds > 0} /><Text style={styles.timer}>0:{String(seconds).padStart(2, '0')} / 0:15</Text></View>
              <Pressable onPress={() => { if (!recording && seconds >= 15) setSeconds(0); setRecording(!recording); }} style={[styles.recordButton, recording && styles.recording]}>
                <Ionicons name={recording ? 'stop' : 'mic'} size={28} color={colors.white} />
              </Pressable>
            </View>
          )}

          <TextInput value={caption} onChangeText={setCaption} placeholder="Who is in this memory? Tell its story…" placeholderTextColor="#9B9290" multiline maxLength={240} style={styles.input} returnKeyType="done" />
          <View style={styles.privacy}><Ionicons name="lock-closed-outline" size={16} color={colors.green} /><Text style={styles.privacyText}>Visible only to your verified family</Text></View>
          <Pressable onPress={save} style={({ pressed }) => [styles.save, pressed && { opacity: 0.8 }]}>
            <Text style={styles.saveText}>Share with family</Text><Ionicons name="arrow-forward" size={20} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(36,18,22,0.44)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.cream, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 34 : 24, ...shadow },
  handle: { width: 42, height: 5, borderRadius: 3, backgroundColor: colors.sandDeep, alignSelf: 'center', marginBottom: 14 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  kicker: { fontFamily: fonts.devanagari, color: colors.maroon, fontSize: 15 },
  title: { fontFamily: fonts.bold, color: colors.ink, fontSize: 21 },
  close: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  segment: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: 16, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: colors.line },
  segmentItem: { flex: 1, minHeight: 48, borderRadius: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  segmentActive: { backgroundColor: colors.maroon },
  segmentText: { fontFamily: fonts.bold, color: colors.maroon, fontSize: 13 },
  photoPicker: { minHeight: 145, borderRadius: 20, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.gold, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', padding: 18 },
  pickerIcon: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 9 },
  pickerTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  pickerSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 4 },
  recorder: { minHeight: 145, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 16, alignItems: 'center' },
  recLabel: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 13, marginBottom: 5 },
  waveRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  timer: { color: colors.muted, fontFamily: fonts.semibold, fontSize: 11 },
  recordButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center', marginTop: 5 },
  recording: { backgroundColor: colors.danger, borderWidth: 5, borderColor: '#F5CBD2' },
  input: { minHeight: 76, maxHeight: 100, marginTop: 14, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 15, paddingVertical: 13, textAlignVertical: 'top', fontFamily: fonts.regular, fontSize: 14, color: colors.ink },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 12, justifyContent: 'center' },
  privacyText: { color: colors.muted, fontFamily: fonts.medium, fontSize: 11 },
  save: { minHeight: 54, borderRadius: 17, backgroundColor: colors.maroon, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  saveText: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },
});
