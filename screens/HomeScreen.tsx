import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, LayoutChangeEvent, Modal, PanResponder, Platform, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Pill, RoundIconButton, Waveform } from '../components/Shared';
import { images, stories, Story } from '../lib/data';
import { colors, fonts, shadow } from '../lib/theme';

type Post = {
  id: string;
  author: string;
  kin: string;
  place: string;
  time: string;
  caption: string;
  source: number;
  avatar: number;
  restored?: boolean;
  comments: number;
  narration: string;
  duration: number;
};

const posts: Post[] = [
  { id: 'restore', author: 'Meera Bua', kin: 'Lucknow branch', place: 'Kanpur · circa 1892', time: '28 min', caption: 'Found in Nanaji’s teakwood trunk. Kul Vriksha restored the fading faces — slide to meet our ancestors again. ✨', source: images.restored, avatar: images.dadi, restored: true, comments: 18, narration: 'Dadi remembers the day this portrait was taken', duration: 52 },
  { id: 'wedding', author: 'Ananya Sharma', kin: 'Chennai branch', place: 'Coimbatore', time: '2 hr', caption: 'Three generations, one frame. Welcoming Kavya into our family with a hundred blessings and a very full mandap. 🌼', source: images.wedding, avatar: images.couple, comments: 31, narration: 'Kavya’s mother shares the story behind the pooja', duration: 36 },
];

export function HomeScreen({ onAdd }: { onAdd: () => void }) {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [notice, setNotice] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const openStory = (story: Story) => {
    if (story.id === 'you') onAdd();
    else setSelectedStory(story);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <LinearGradient colors={[colors.gold, colors.maroon]} style={styles.brandMark}>
            <Ionicons name="leaf" size={19} color={colors.white} />
          </LinearGradient>
          <View>
            <Text style={styles.brandHindi}>कुल वृक्ष</Text>
            <Text style={styles.brand}>KUL VRIKSHA</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <RoundIconButton icon="search-outline" accessibilityLabel="Search family memories" onPress={() => Alert.alert('Search memories', 'Search by person, year, place, or family branch.')} />
          <View>
            <RoundIconButton icon="notifications-outline" accessibilityLabel="Open notifications" onPress={() => setNotice(!notice)} />
            <View style={styles.notificationDot} />
          </View>
        </View>
      </View>
      {notice ? (
        <Pressable onPress={() => setNotice(false)} style={styles.notice}>
          <View style={styles.noticeIcon}><Ionicons name="gift-outline" size={20} color={colors.maroon} /></View>
          <View style={{ flex: 1 }}><Text style={styles.noticeTitle}>Birthday tomorrow</Text><Text style={styles.noticeText}>Send Meera Bua a voice blessing</Text></View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </Pressable>
      ) : null}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={<StoryTray onOpen={openStory} />}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.maroon} colors={[colors.maroon, colors.gold]} />}
      />
      <StoryViewer story={selectedStory} onClose={() => setSelectedStory(null)} />
    </View>
  );
}

function StoryTray({ onOpen }: { onOpen: (story: Story) => void }) {
  return (
    <View style={styles.storySection}>
      <View style={styles.storyHeading}>
        <View><Text style={styles.sectionHindi}>आज की यादें</Text><Text style={styles.sectionTitle}>Family moments</Text></View>
        <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>24 HOURS</Text></View>
      </View>
      <FlatList horizontal data={stories} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyList} renderItem={({ item }) => (
        <Pressable onPress={() => onOpen(item)} style={({ pressed }) => [styles.storyItem, pressed && { opacity: 0.65 }]}>
          <View>
            <Avatar source={item.source} size={62} story />
            {item.id === 'you' ? <View style={styles.storyAdd}><Ionicons name="add" size={15} color={colors.white} /></View> : item.type === 'voice' ? <View style={styles.storyVoice}><Ionicons name="mic" size={12} color={colors.maroon} /></View> : null}
          </View>
          <Text numberOfLines={1} style={styles.storyName}>{item.name}</Text>
          {item.type === 'voice' && item.id !== 'you' ? <Text style={styles.storyType}>15s voice</Text> : <Text style={styles.storyType}>{item.id === 'you' ? 'Add new' : item.time}</Text>}
        </Pressable>
      )} />
    </View>
  );
}

function PostCard({ post }: { post: Post }) {
  const [reaction, setReaction] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.postHeader}>
        <Avatar source={post.avatar} size={44} story />
        <View style={{ flex: 1 }}>
          <View style={styles.authorLine}><Text style={styles.author}>{post.author}</Text><Pill text={post.kin} tone="gold" /></View>
          <Text style={styles.postMeta}>{post.place}  ·  {post.time}</Text>
        </View>
        <Pressable accessibilityLabel="Post options" onPress={() => Alert.alert('Memory options', 'You can report a detail, hide this post, or help identify relatives.')} style={styles.moreButton}><Ionicons name="ellipsis-horizontal" size={22} color={colors.ink} /></Pressable>
      </View>

      {post.restored ? <BeforeAfterMedia /> : <Image source={post.source} style={styles.media} contentFit="cover" transition={250} />}

      <View style={styles.postBody}>
        {post.restored ? <View style={styles.aiLine}><Pill text="AI RESTORED" icon="sparkles" tone="gold" /><Text style={styles.aiHint}>Drag the divider to compare</Text></View> : <Pill text="FAMILY CELEBRATION" icon="flower-outline" tone="maroon" />}
        <Text style={styles.caption}><Text style={styles.captionAuthor}>{post.author}  </Text>{post.caption}</Text>
        <View style={styles.reactionBar}>
          <ReactionButton label="Pranam" symbol="🙏" active={reaction === 'Pranam'} onPress={() => setReaction(reaction === 'Pranam' ? null : 'Pranam')} />
          <ReactionButton label="Prem" symbol="♥" active={reaction === 'Prem'} onPress={() => setReaction(reaction === 'Prem' ? null : 'Prem')} />
          <ReactionButton label="Naman" symbol="🌼" active={reaction === 'Naman'} onPress={() => setReaction(reaction === 'Naman' ? null : 'Naman')} />
          <Pressable accessibilityLabel="Save memory" onPress={() => setSaved(!saved)} style={styles.saveButton}><Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={21} color={saved ? colors.maroon : colors.muted} /></Pressable>
        </View>
        <View style={styles.socialProof}>
          <View style={styles.miniFaces}><View style={[styles.miniAvatar, { backgroundColor: colors.maroon }]}><Text style={styles.miniText}>RS</Text></View><View style={[styles.miniAvatar, { backgroundColor: colors.gold, marginLeft: -7 }]}><Text style={styles.miniText}>MT</Text></View><View style={[styles.miniAvatar, { backgroundColor: '#397665', marginLeft: -7 }]}><Text style={styles.miniText}>AS</Text></View></View>
          <Text style={styles.proofText}>{reaction ? `You and ${post.restored ? '46' : '72'} relatives sent ${reaction}` : `${post.restored ? '47' : '73'} family blessings`}</Text>
          <Pressable onPress={() => Alert.alert(`${post.comments} family replies`, '“What a precious memory.”\n\n“Can someone tag Shalini Chachi?”')}><Text style={styles.comments}>{post.comments} replies</Text></Pressable>
        </View>
        <AudioPlayer title={post.narration} duration={post.duration} />
      </View>
    </View>
  );
}

function ReactionButton({ label, symbol, active, onPress }: { label: string; symbol: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.reaction, active && styles.reactionActive, pressed && { transform: [{ scale: 0.95 }] }]}>
      <Text style={[styles.reactionSymbol, label === 'Prem' && { color: colors.maroon }]}>{symbol}</Text><Text style={[styles.reactionText, active && { color: colors.maroon }]}>{label}</Text>
    </Pressable>
  );
}

function BeforeAfterMedia() {
  const [width, setWidth] = useState(360);
  const [fraction, setFraction] = useState(0.5);
  const widthRef = useRef(360);
  const fractionRef = useRef(0.5);
  const startFraction = useRef(0.5);
  const startX = useRef(0);
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => { startFraction.current = fractionRef.current; startX.current = e.nativeEvent.pageX; },
    onPanResponderMove: (e) => {
      const delta = e.nativeEvent.pageX - startX.current;
      const next = Math.max(0.12, Math.min(0.88, startFraction.current + delta / widthRef.current));
      fractionRef.current = next;
      setFraction(next);
    },
  })).current;
  const onLayout = (e: LayoutChangeEvent) => { const next = e.nativeEvent.layout.width; widthRef.current = next; setWidth(next); };
  const split = width * fraction;
  return (
    <View onLayout={onLayout} style={styles.compare} {...pan.panHandlers}>
      <Image source={images.restored} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
      <View style={[styles.beforeClip, { width: split }]}><Image source={images.vintage} style={{ width, height: 292 }} contentFit="cover" contentPosition="center" /></View>
      <View pointerEvents="none" style={[styles.compareLine, { left: split - 1 }]}>
        <View style={styles.compareHandle}><Ionicons name="chevron-back" size={13} color={colors.maroon} /><Ionicons name="chevron-forward" size={13} color={colors.maroon} /></View>
      </View>
      <View pointerEvents="none" style={styles.beforeLabel}><Text style={styles.mediaLabel}>BEFORE</Text></View>
      <View pointerEvents="none" style={styles.afterLabel}><Ionicons name="sparkles" size={12} color={colors.white} /><Text style={styles.mediaLabel}>RESTORED</Text></View>
    </View>
  );
}

function AudioPlayer({ title, duration }: { title: string; duration: number }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (playing) timer = setInterval(() => setElapsed((v) => {
      if (v >= duration - 1) { setPlaying(false); return 0; }
      return v + 1;
    }), 1000);
    return () => { if (timer) clearInterval(timer); };
  }, [playing, duration]);
  const pct = Math.max(4, (elapsed / duration) * 100);
  return (
    <View style={styles.audioCard}>
      <Pressable accessibilityLabel={playing ? 'Pause narration' : 'Play narration'} onPress={() => setPlaying(!playing)} style={styles.audioPlay}><Ionicons name={playing ? 'pause' : 'play'} size={20} color={colors.white} /></Pressable>
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} style={styles.audioTitle}>{title}</Text>
        <View style={styles.audioBottom}><View style={styles.audioTrack}><View style={[styles.audioProgress, { width: `${pct}%` }]} /></View><Text style={styles.audioTime}>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} / {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')}</Text></View>
      </View>
      <Waveform compact active={playing} color={colors.gold} />
    </View>
  );
}

function StoryViewer({ story, onClose }: { story: Story | null; onClose: () => void }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => { if (!story) setPlaying(false); }, [story]);
  if (!story) return null;
  return (
    <Modal visible transparent={false} animationType="fade" onRequestClose={onClose}>
      <View style={styles.storyViewer}>
        <Image source={story.source} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={2} />
        <LinearGradient colors={['rgba(30,10,15,.68)', 'rgba(30,10,15,.08)', 'rgba(30,10,15,.9)']} style={StyleSheet.absoluteFill} />
        <View style={styles.storyProgress}><View style={styles.storyProgressFill} /></View>
        <View style={styles.storyViewerTop}><Avatar source={story.source} size={42} /><View style={{ flex: 1 }}><Text style={styles.storyViewerName}>{story.name}</Text><Text style={styles.storyViewerTime}>{story.kin} · {story.time}</Text></View><Pressable onPress={onClose} style={styles.storyClose}><Ionicons name="close" size={27} color={colors.white} /></Pressable></View>
        <View style={styles.storyViewerBottom}>
          <Text style={styles.storyQuote}>{story.type === 'voice' ? '“Hamare aangan mein har Holi ki subah yahi geet goonjta tha…”' : 'A little moment from our family, shared with love.'}</Text>
          {story.type === 'voice' ? <View style={styles.storyAudio}><Pressable onPress={() => setPlaying(!playing)} style={styles.storyAudioButton}><Ionicons name={playing ? 'pause' : 'play'} size={22} color={colors.maroon} /></Pressable><Waveform active={playing} color={colors.gold} /><Text style={styles.story15}>0:15</Text></View> : null}
          <View style={styles.storyReply}><Text style={styles.storyReplyText}>Send a blessing…</Text><Ionicons name="heart-outline" size={24} color={colors.white} /><Ionicons name="paper-plane-outline" size={24} color={colors.white} /></View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  topBar: { minHeight: 69, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.cream },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 39, height: 39, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  brandHindi: { fontFamily: fonts.devanagari, fontSize: 20, color: colors.maroon, lineHeight: 24 },
  brand: { fontFamily: fonts.bold, fontSize: 8, color: colors.gold, letterSpacing: 2.1 },
  headerActions: { flexDirection: 'row', gap: 8 },
  notificationDot: { position: 'absolute', right: 4, top: 3, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.gold, borderWidth: 2, borderColor: colors.cream },
  notice: { marginHorizontal: 14, marginTop: 10, backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.gold, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, ...shadow },
  noticeIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  noticeTitle: { fontFamily: fonts.bold, color: colors.ink, fontSize: 12 },
  noticeText: { fontFamily: fonts.regular, color: colors.muted, fontSize: 11, marginTop: 1 },
  feedContent: { paddingBottom: 24 },
  storySection: { paddingTop: 14, paddingBottom: 17, borderBottomWidth: 1, borderBottomColor: colors.line },
  storyHeading: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
  sectionHindi: { fontFamily: fonts.devanagari, color: colors.maroon, fontSize: 18, lineHeight: 21 },
  sectionTitle: { fontFamily: fonts.bold, color: colors.ink, fontSize: 13 },
  livePill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 12, paddingHorizontal: 9, height: 24, backgroundColor: colors.maroonSoft },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.maroon },
  liveText: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1 },
  storyList: { paddingHorizontal: 17, gap: 13 },
  storyItem: { width: 73, alignItems: 'center' },
  storyName: { marginTop: 6, color: colors.ink, fontFamily: fonts.semibold, fontSize: 10.5, maxWidth: 72 },
  storyType: { color: colors.muted, fontFamily: fonts.medium, fontSize: 8.5, marginTop: 1 },
  storyVoice: { position: 'absolute', right: -2, bottom: -1, width: 23, height: 23, borderRadius: 12, backgroundColor: colors.goldSoft, borderWidth: 2, borderColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  storyAdd: { position: 'absolute', right: -1, bottom: -1, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.maroon, borderWidth: 2, borderColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  card: { marginHorizontal: 12, backgroundColor: colors.white, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, ...shadow },
  postHeader: { padding: 14, flexDirection: 'row', alignItems: 'center', gap: 11 },
  authorLine: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  author: { fontFamily: fonts.bold, color: colors.ink, fontSize: 13 },
  postMeta: { fontFamily: fonts.regular, color: colors.muted, fontSize: 10, marginTop: 3 },
  moreButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  media: { width: '100%', height: 292, backgroundColor: colors.silk },
  compare: { height: 292, width: '100%', backgroundColor: colors.sand, overflow: 'hidden' },
  beforeClip: { height: 292, overflow: 'hidden', position: 'absolute', left: 0, top: 0 },
  compareLine: { position: 'absolute', width: 2, height: '100%', backgroundColor: colors.white, top: 0, alignItems: 'center', justifyContent: 'center' },
  compareHandle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, borderWidth: 3, borderColor: colors.gold, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...shadow },
  beforeLabel: { position: 'absolute', left: 12, top: 12, backgroundColor: 'rgba(38,25,20,.68)', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5 },
  afterLabel: { position: 'absolute', right: 12, top: 12, backgroundColor: colors.maroon, borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5, flexDirection: 'row', alignItems: 'center', gap: 4 },
  mediaLabel: { color: colors.white, fontFamily: fonts.bold, fontSize: 8, letterSpacing: 0.8 },
  postBody: { padding: 15 },
  aiLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiHint: { color: colors.muted, fontFamily: fonts.medium, fontSize: 9 },
  caption: { color: colors.ink, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 20, marginTop: 10 },
  captionAuthor: { fontFamily: fonts.bold },
  reactionBar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 13 },
  reaction: { minHeight: 39, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingHorizontal: 9, backgroundColor: colors.cream, borderRadius: 13, borderWidth: 1, borderColor: colors.line },
  reactionActive: { backgroundColor: colors.maroonSoft, borderColor: '#D6A1AF' },
  reactionSymbol: { fontSize: 15 },
  reactionText: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 10 },
  saveButton: { width: 39, height: 39, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center' },
  socialProof: { flexDirection: 'row', alignItems: 'center', marginTop: 11 },
  miniFaces: { flexDirection: 'row', width: 55 },
  miniAvatar: { width: 23, height: 23, borderRadius: 12, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  miniText: { color: colors.white, fontFamily: fonts.bold, fontSize: 6 },
  proofText: { flex: 1, color: colors.muted, fontFamily: fonts.medium, fontSize: 9.5 },
  comments: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 9.5 },
  audioCard: { marginTop: 13, minHeight: 68, borderRadius: 17, backgroundColor: colors.maroonSoft, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: 1, borderColor: '#E5CAD1' },
  audioPlay: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.maroon, alignItems: 'center', justifyContent: 'center' },
  audioTitle: { fontFamily: fonts.semibold, color: colors.ink, fontSize: 10, marginBottom: 6 },
  audioBottom: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  audioTrack: { height: 3, backgroundColor: '#D8C3C8', borderRadius: 2, flex: 1, overflow: 'hidden' },
  audioProgress: { height: 3, backgroundColor: colors.maroon },
  audioTime: { fontFamily: fonts.medium, color: colors.muted, fontSize: 7.5 },
  storyViewer: { flex: 1, backgroundColor: colors.maroonDark, paddingTop: Platform.OS === 'ios' ? 56 : 28 },
  storyProgress: { height: 3, backgroundColor: 'rgba(255,255,255,.3)', marginHorizontal: 14, borderRadius: 3 },
  storyProgressFill: { width: '68%', height: 3, borderRadius: 3, backgroundColor: colors.white },
  storyViewerTop: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  storyViewerName: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  storyViewerTime: { color: 'rgba(255,255,255,.76)', fontFamily: fonts.regular, fontSize: 10, marginTop: 2 },
  storyClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  storyViewerBottom: { marginTop: 'auto', padding: 20, paddingBottom: Platform.OS === 'ios' ? 38 : 24 },
  storyQuote: { color: colors.white, fontFamily: fonts.devanagari, fontSize: 22, lineHeight: 34, marginBottom: 18 },
  storyAudio: { minHeight: 68, borderRadius: 18, backgroundColor: 'rgba(255,255,255,.93)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 10 },
  storyAudioButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  story15: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 10 },
  storyReply: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,.65)', marginTop: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, gap: 16 },
  storyReplyText: { flex: 1, color: 'rgba(255,255,255,.8)', fontFamily: fonts.regular, fontSize: 12 },
});
