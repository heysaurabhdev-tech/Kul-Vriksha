import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Pill, RoundIconButton, ScreenTitle, Waveform } from '../components/Shared';
import { Chat, chats, images } from '../lib/data';
import { colors, fonts, shadow } from '../lib/theme';

type Filter = 'all' | 'unread' | 'branches';
type Message = { id: string; text?: string; time: string; mine?: boolean; voice?: number; sender?: string; read?: boolean; alert?: boolean };

const starterMessages: Message[] = [
  { id: 'alert', time: '8:00 AM', alert: true, text: 'Meera Bua’s birthday is tomorrow', sender: 'Send a blessing before 9:00 AM' },
  { id: '1', text: 'Namaste sabko! I found Nanaji’s old album in the teakwood trunk. 🙏', time: '9:14 AM', sender: 'Rohan' },
  { id: '2', text: 'The 1892 family photo is inside! I’ve asked Kul Vriksha to restore it.', time: '9:15 AM', sender: 'Rohan' },
  { id: '3', text: 'Wonderful! Dadi remembers where it was taken. I’ll record her story.', time: '9:18 AM', mine: true, read: true },
  { id: '4', voice: 15, text: 'Dadi’s memory', time: '9:21 AM', sender: 'Neha' },
  { id: '5', text: 'Please send the restored version here too. Maa will be so happy ❤️', time: '9:22 AM', sender: 'Aarav' },
  { id: '6', text: 'Of course — uploading it to our family feed now.', time: '9:24 AM', mine: true, read: true },
];

export function ChatsScreen() {
  const [selected, setSelected] = useState<Chat | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [archived, setArchived] = useState(false);

  if (selected) return <ChatViewport chat={selected} onBack={() => setSelected(null)} />;

  const data = chats.filter((chat) => {
    const matches = chat.title.toLowerCase().includes(query.toLowerCase()) || chat.subtitle.toLowerCase().includes(query.toLowerCase());
    if (filter === 'unread') return matches && chat.unread > 0;
    if (filter === 'branches') return matches && chat.kind === 'branch';
    return matches;
  });

  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 850); };

  return (
    <View style={styles.screen}>
      <ScreenTitle eyebrow="FAMILY MESSAGES" title="बातचीत" action={<View style={styles.titleActions}><RoundIconButton icon="camera-outline" accessibilityLabel="Open camera" onPress={() => Alert.alert('Family camera', 'Capture a moment and send it to your family.')} /><RoundIconButton icon="ellipsis-vertical" accessibilityLabel="Chat options" onPress={() => Alert.alert('Chat settings', 'New group · Broadcast blessings · Linked family devices')} /></View>} />
      <View style={styles.searchWrap}><Ionicons name="search-outline" size={20} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search family chats" placeholderTextColor="#928789" style={styles.searchInput} returnKeyType="search" /><Ionicons name="mic-outline" size={20} color={colors.maroon} /></View>
      <View style={styles.filters}>
        <FilterChip label="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterChip label="Unread 10" active={filter === 'unread'} onPress={() => setFilter('unread')} />
        <FilterChip label="Branches" active={filter === 'branches'} onPress={() => setFilter('branches')} icon="git-branch-outline" />
      </View>
      <FlatList data={data} keyExtractor={(item) => item.id} renderItem={({ item }) => <ChatRow chat={item} onPress={() => setSelected(item)} />} ItemSeparatorComponent={() => <View style={styles.separator} />} contentContainerStyle={styles.chatList} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[colors.maroon]} tintColor={colors.maroon} />} ListHeaderComponent={
        <>
          <Pressable onPress={() => setArchived(!archived)} style={styles.archiveRow}><View style={styles.archiveIcon}><Ionicons name="archive-outline" size={21} color={colors.maroon} /></View><Text style={styles.archiveText}>Archived family chats</Text><Text style={styles.archiveCount}>{archived ? 'Hidden' : '2'}</Text><Ionicons name={archived ? 'chevron-up' : 'chevron-forward'} size={18} color={colors.muted} /></Pressable>
          {archived ? <View style={styles.archivedInfo}><Text style={styles.archivedInfoText}>Varanasi Yatra 2024 · Wedding Planning</Text></View> : null}
          <View style={styles.listLabel}><Text style={styles.listLabelText}>{filter === 'branches' ? 'AUTO-GROUPED BRANCH CHATS' : filter === 'unread' ? 'WAITING FOR YOU' : 'RECENT CONVERSATIONS'}</Text><Ionicons name="lock-closed" size={12} color={colors.green} /><Text style={styles.privateText}>Family private</Text></View>
        </>
      } ListEmptyComponent={<View style={styles.empty}><View style={styles.emptyIcon}><Ionicons name="chatbubble-ellipses-outline" size={32} color={colors.maroon} /></View><Text style={styles.emptyTitle}>No chats found</Text><Text style={styles.emptyText}>Try another family name or view all conversations.</Text><Pressable onPress={() => { setQuery(''); setFilter('all'); }} style={styles.emptyButton}><Text style={styles.emptyButtonText}>Show all chats</Text></Pressable></View>} />
      <Pressable onPress={() => Alert.alert('New family chat', 'Choose relatives from your directory to begin a secure conversation.')} style={styles.fab}><Ionicons name="chatbubble-ellipses" size={24} color={colors.white} /></Pressable>
    </View>
  );
}

function FilterChip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable onPress={onPress} style={[styles.filterChip, active && styles.filterActive]}>{icon ? <Ionicons name={icon} size={15} color={active ? colors.white : colors.maroon} /> : null}<Text style={[styles.filterText, active && { color: colors.white }]}>{label}</Text></Pressable>;
}

function ChatRow({ chat, onPress }: { chat: Chat; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chatRow, pressed && { backgroundColor: colors.silk }]}>
      <View>
        {chat.avatar ? <Avatar source={chat.avatar} size={54} /> : <Avatar initials={chat.kind === 'branch' ? chat.title.slice(0, 2).toUpperCase() : 'कु'} color={chat.color} size={54} />}
        {chat.kind === 'channel' ? <View style={styles.typeBadge}><Ionicons name="megaphone" size={10} color={colors.white} /></View> : chat.kind === 'branch' ? <View style={[styles.typeBadge, { backgroundColor: colors.gold }]}><Ionicons name="git-branch" size={10} color={colors.white} /></View> : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.chatNameLine}><Text numberOfLines={1} style={styles.chatName}>{chat.title}</Text>{chat.muted ? <Ionicons name="volume-mute-outline" size={14} color={colors.muted} /> : null}<Text style={[styles.chatTime, chat.unread > 0 && { color: colors.green }]}>{chat.time}</Text></View>
        <View style={styles.chatSubLine}><Text numberOfLines={1} style={styles.chatSub}>{chat.subtitle}</Text>{chat.unread > 0 ? <View style={styles.unread}><Text style={styles.unreadText}>{chat.unread}</Text></View> : <Ionicons name="checkmark-done" size={18} color={colors.green} />}</View>
        <View style={styles.chatTag}>{chat.kind === 'branch' ? <><Ionicons name="sparkles-outline" size={10} color="#885A0A" /><Text style={styles.chatTagText}>Auto-grouped branch</Text></> : chat.kind === 'channel' ? <Text style={styles.channelTag}>Family channel</Text> : null}</View>
      </View>
    </Pressable>
  );
}

function ChatViewport({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordTimeRef = useRef(0);
  const recordingRef = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) timer.current = setInterval(() => setRecordTime((s) => { const next = s + 1; recordTimeRef.current = next; return next; }), 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [recording]);

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: String(Date.now()), text: text.trim(), mine: true, read: true, time: 'Now' }]);
    setText('');
  };
  const finishRecording = () => {
    if (!recordingRef.current) return;
    recordingRef.current = false;
    setRecording(false);
    const duration = Math.max(1, recordTimeRef.current);
    setMessages((m) => [...m, { id: String(Date.now()), voice: duration, text: 'Voice message', mine: true, read: true, time: 'Now' }]);
    setRecordTime(0);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.viewport} keyboardVerticalOffset={8}>
      <View style={styles.chatHeader}>
        <Pressable onPress={onBack} style={styles.back}><Ionicons name="arrow-back" size={24} color={colors.maroon} /></Pressable>
        <Avatar initials={chat.kind === 'branch' ? 'KC' : 'कु'} color={chat.color} size={43} />
        <Pressable onPress={() => Alert.alert(chat.title, '12 participants · Family verified\nMedia, links and voice memories')} style={{ flex: 1 }}><Text numberOfLines={1} style={styles.viewportName}>{chat.title}</Text><Text style={styles.viewportStatus}>{chat.kind === 'private' ? 'online' : '12 family members'}</Text></Pressable>
        <Pressable onPress={() => Alert.alert('Video call', `Starting a secure family video call with ${chat.title}.`)} style={styles.headerButton}><Ionicons name="videocam-outline" size={22} color={colors.maroon} /></Pressable>
        <Pressable onPress={() => Alert.alert('Voice call', `Calling ${chat.title}…`)} style={styles.headerButton}><Ionicons name="call-outline" size={21} color={colors.maroon} /></Pressable>
      </View>
      <View style={styles.encryption}><Ionicons name="lock-closed" size={11} color="#8A6A28" /><Text style={styles.encryptionText}>Messages and voice memories stay within your verified family.</Text></View>
      <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={({ item }) => item.alert ? <BirthdayAlert message={item} /> : <MessageBubble message={item} />} contentContainerStyle={styles.messages} ItemSeparatorComponent={() => <View style={{ height: 7 }} />} showsVerticalScrollIndicator={false} ListHeaderComponent={<View style={styles.today}><Text style={styles.todayText}>TODAY</Text></View>} ListFooterComponent={recording ? <View style={styles.listeningBubble}><View style={styles.recPulse} /><Text style={styles.listeningText}>Recording your voice blessing…</Text></View> : null} />
      {recording ? <View style={styles.recordingBar}><View style={styles.recordDot} /><Text style={styles.recordingTime}>0:{String(recordTime).padStart(2, '0')}</Text><Waveform active color={colors.maroon} /><Text style={styles.release}>Release to send</Text></View> : null}
      <View style={styles.composer}>
        <Pressable onPress={() => Alert.alert('Share with family', 'Photo · Restored memory · Document · Family contact · Location')} style={styles.attach}><Ionicons name="add" size={27} color={colors.maroon} /></Pressable>
        <View style={styles.inputWrap}><TextInput value={text} onChangeText={setText} placeholder="Message your family…" placeholderTextColor="#928789" style={styles.messageInput} returnKeyType="send" onSubmitEditing={send} /><Pressable onPress={() => setText((v) => `${v} 🙏`)} style={styles.emoji}><Ionicons name="happy-outline" size={22} color={colors.muted} /></Pressable></View>
        {text.trim() ? <Pressable onPress={send} style={styles.send}><Ionicons name="send" size={20} color={colors.white} /></Pressable> : <Pressable accessibilityLabel="Hold to record voice message" onPressIn={() => { setRecordTime(0); recordTimeRef.current = 0; recordingRef.current = true; setRecording(true); }} onPressOut={finishRecording} style={[styles.pushTalk, recording && { backgroundColor: colors.danger }]}><Ionicons name="mic" size={23} color={colors.white} /></Pressable>}
      </View>
      {!text.trim() && !recording ? <Text style={styles.holdHint}>Hold the microphone to talk</Text> : null}
    </KeyboardAvoidingView>
  );
}

function BirthdayAlert({ message }: { message: Message }) {
  const [sent, setSent] = useState(false);
  return (
    <View style={styles.birthday}>
      <View style={styles.gift}><Ionicons name="gift" size={22} color={colors.maroon} /></View>
      <View style={{ flex: 1 }}><Text style={styles.birthdayTitle}>🎂 {message.text}</Text><Text style={styles.birthdaySub}>{sent ? 'Your blessing is scheduled' : message.sender}</Text></View>
      <Pressable onPress={() => setSent(!sent)} style={[styles.blessButton, sent && styles.blessedButton]}><Text style={[styles.blessText, sent && { color: colors.maroon }]}>{sent ? 'Sent ✓' : 'Bless'}</Text></Pressable>
    </View>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [playing, setPlaying] = useState(false);
  return (
    <View style={[styles.messageRow, message.mine && { justifyContent: 'flex-end' }]}>
      <View style={[styles.bubble, message.mine ? styles.myBubble : styles.theirBubble]}>
        {message.sender && !message.mine ? <Text style={styles.sender}>{message.sender}</Text> : null}
        {message.voice ? <View style={styles.voiceRow}><Pressable onPress={() => setPlaying(!playing)} style={styles.voicePlay}><Ionicons name={playing ? 'pause' : 'play'} size={17} color={colors.white} /></Pressable><Waveform compact active={playing} color={message.mine ? colors.maroon : colors.gold} /><Text style={styles.voiceTime}>0:{String(message.voice).padStart(2, '0')}</Text></View> : <Text style={styles.messageText}>{message.text}</Text>}
        <View style={styles.bubbleMeta}><Text style={styles.messageTime}>{message.time}</Text>{message.mine ? <Ionicons name="checkmark-done" size={16} color={colors.green} /> : null}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  titleActions: { flexDirection: 'row', gap: 7 },
  searchWrap: { marginHorizontal: 20, minHeight: 50, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontFamily: fonts.regular, fontSize: 13, color: colors.ink },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  filterChip: { minHeight: 38, paddingHorizontal: 14, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  filterActive: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  filterText: { color: colors.ink, fontFamily: fonts.semibold, fontSize: 10 },
  chatList: { paddingBottom: 86 },
  archiveRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 20, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  archiveIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.maroonSoft, alignItems: 'center', justifyContent: 'center' },
  archiveText: { flex: 1, color: colors.ink, fontFamily: fonts.semibold, fontSize: 12 },
  archiveCount: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 10 },
  archivedInfo: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: colors.goldSoft },
  archivedInfoText: { color: '#78561C', fontFamily: fonts.medium, fontSize: 10 },
  listLabel: { paddingHorizontal: 20, paddingTop: 17, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 4 },
  listLabelText: { color: colors.gold, fontFamily: fonts.bold, fontSize: 8.5, letterSpacing: .9, flex: 1 },
  privateText: { color: colors.green, fontFamily: fonts.medium, fontSize: 8.5 },
  chatRow: { minHeight: 88, paddingHorizontal: 20, paddingVertical: 11, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white },
  typeBadge: { position: 'absolute', right: -2, bottom: -2, width: 21, height: 21, borderRadius: 11, backgroundColor: colors.maroon, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  chatNameLine: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chatName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13, flexShrink: 1 },
  chatTime: { marginLeft: 'auto', color: colors.muted, fontFamily: fonts.medium, fontSize: 9 },
  chatSubLine: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 7 },
  chatSub: { flex: 1, color: colors.muted, fontFamily: fonts.regular, fontSize: 10.5 },
  unread: { minWidth: 21, height: 21, borderRadius: 11, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  unreadText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8 },
  chatTag: { height: 17, flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  chatTagText: { color: '#885A0A', fontFamily: fonts.semibold, fontSize: 7.5 },
  channelTag: { color: colors.maroon, fontFamily: fonts.semibold, fontSize: 7.5 },
  separator: { height: 1, backgroundColor: colors.line, marginLeft: 86 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 19, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center', ...shadow },
  empty: { alignItems: 'center', paddingTop: 55, paddingHorizontal: 30 },
  emptyIcon: { width: 70, height: 70, borderRadius: 24, backgroundColor: colors.maroonSoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 16, marginTop: 13 },
  emptyText: { color: colors.muted, fontFamily: fonts.regular, textAlign: 'center', fontSize: 11, lineHeight: 17, marginTop: 5 },
  emptyButton: { height: 42, paddingHorizontal: 18, backgroundColor: colors.maroon, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  emptyButtonText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 },
  viewport: { flex: 1, backgroundColor: colors.silk },
  chatHeader: { minHeight: 67, backgroundColor: colors.cream, borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
  back: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  viewportName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  viewportStatus: { color: colors.green, fontFamily: fonts.medium, fontSize: 9, marginTop: 2 },
  headerButton: { width: 39, height: 42, alignItems: 'center', justifyContent: 'center' },
  encryption: { alignSelf: 'center', marginVertical: 8, maxWidth: '85%', backgroundColor: colors.goldSoft, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 9, flexDirection: 'row', alignItems: 'center', gap: 5 },
  encryptionText: { color: '#7A612C', fontFamily: fonts.medium, fontSize: 7.5 },
  messages: { paddingHorizontal: 13, paddingBottom: 10 },
  today: { alignItems: 'center', marginBottom: 9 },
  todayText: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: colors.white, color: colors.muted, borderRadius: 9, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: .5 },
  birthday: { minHeight: 72, borderRadius: 17, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gold, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9, ...shadow },
  gift: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  birthdayTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10.5 },
  birthdaySub: { color: colors.muted, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 3 },
  blessButton: { minWidth: 52, height: 34, backgroundColor: colors.maroon, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  blessedButton: { backgroundColor: colors.maroonSoft, borderWidth: 1, borderColor: '#DAB7BF' },
  blessText: { color: colors.white, fontFamily: fonts.bold, fontSize: 8.5 },
  messageRow: { flexDirection: 'row' },
  bubble: { maxWidth: '83%', minWidth: 95, borderRadius: 16, paddingHorizontal: 11, paddingTop: 8, paddingBottom: 5 },
  theirBubble: { backgroundColor: colors.white, borderTopLeftRadius: 4 },
  myBubble: { backgroundColor: colors.sand, borderTopRightRadius: 4 },
  sender: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 9, marginBottom: 3 },
  messageText: { color: colors.ink, fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 17 },
  bubbleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 2, marginTop: 2 },
  messageTime: { color: colors.muted, fontFamily: fonts.medium, fontSize: 7.5 },
  voiceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 220 },
  voicePlay: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' },
  voiceTime: { color: colors.muted, fontFamily: fonts.medium, fontSize: 8 },
  listeningBubble: { alignSelf: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.maroonSoft, borderRadius: 13, padding: 10, marginTop: 8 },
  recPulse: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger },
  listeningText: { color: colors.maroon, fontFamily: fonts.semibold, fontSize: 9 },
  recordingBar: { minHeight: 46, marginHorizontal: 12, marginBottom: 5, borderRadius: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: '#E6BDC6', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, gap: 8 },
  recordDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger },
  recordingTime: { color: colors.danger, fontFamily: fonts.bold, fontSize: 10 },
  release: { marginLeft: 'auto', color: colors.maroon, fontFamily: fonts.bold, fontSize: 8 },
  composer: { minHeight: 62, backgroundColor: colors.cream, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, gap: 7, borderTopWidth: 1, borderTopColor: colors.line },
  attach: { width: 42, height: 44, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, minHeight: 45, maxHeight: 100, borderRadius: 23, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', paddingLeft: 14 },
  messageInput: { flex: 1, paddingVertical: 10, color: colors.ink, fontFamily: fonts.regular, fontSize: 11 },
  emoji: { width: 42, height: 43, alignItems: 'center', justifyContent: 'center' },
  pushTalk: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' },
  send: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' },
  holdHint: { backgroundColor: colors.cream, color: colors.muted, fontFamily: fonts.medium, fontSize: 7.5, textAlign: 'right', paddingRight: 10, paddingBottom: 5, marginTop: -4 },
});
