import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Avatar, Pill, RoundIconButton, ScreenTitle } from '../components/Shared';
import { Relative, relatives } from '../lib/data';
import { colors, fonts, shadow } from '../lib/theme';

type Filter = 'all' | 'close' | 'blood';

export function DirectoryScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Relative | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['6', '1']);

  const filtered = useMemo(() => relatives.filter((person) => {
    const match = `${person.name} ${person.kinship} ${person.city} ${person.blood}`.toLowerCase().includes(query.toLowerCase());
    if (filter === 'close') return match && ['1', '2', '6'].includes(person.id);
    if (filter === 'blood') return match && person.blood.startsWith('O');
    return match;
  }), [query, filter]);

  const call = async (person: Relative) => {
    const url = `tel:${person.phone}`;
    try { await Linking.openURL(url); } catch { Alert.alert(`Call ${person.name}`, person.phone); }
  };
  const whatsapp = async (person: Relative) => {
    const url = `https://wa.me/${person.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Namaste! Reaching you from our Kul Vriksha family directory. 🙏')}`;
    try { await Linking.openURL(url); } catch { Alert.alert('WhatsApp', `Start a chat with ${person.name} at ${person.phone}`); }
  };

  return (
    <View style={styles.screen}>
      <ScreenTitle eyebrow="VERIFIED FAMILY · 116 MEMBERS" title="परिवार निर्देशिका" action={<RoundIconButton icon="person-add-outline" accessibilityLabel="Invite family member" onPress={() => Alert.alert('Invite family', 'Share a secure invite code with a verified relative.')} />} />
      <View style={styles.search}><Ionicons name="search-outline" size={20} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Name, relation, city or blood group" placeholderTextColor="#928789" style={styles.searchInput} returnKeyType="search" />{query ? <Pressable onPress={() => setQuery('')} style={styles.clear}><Ionicons name="close-circle" size={20} color={colors.muted} /></Pressable> : <Ionicons name="mic-outline" size={20} color={colors.maroon} />}</View>
      <View style={styles.filters}><DirectoryChip label="Everyone" active={filter === 'all'} onPress={() => setFilter('all')} /><DirectoryChip label="Close family" active={filter === 'close'} onPress={() => setFilter('close')} /><DirectoryChip label="O blood" icon="water-outline" active={filter === 'blood'} onPress={() => setFilter('blood')} /></View>
      <FlatList data={filtered} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.list} renderItem={({ item, index }) => (
        <View>
          {(index === 0 || filtered[index - 1].name[0] !== item.name[0]) ? <View style={styles.alphaRow}><Text style={styles.alpha}>{item.name[0]}</Text><View style={styles.alphaLine} /></View> : null}
          <RelativeRow person={item} favorite={favorites.includes(item.id)} onFavorite={() => setFavorites((f) => f.includes(item.id) ? f.filter((id) => id !== item.id) : [...f, item.id])} onOpen={() => setSelected(item)} onCall={() => call(item)} onWhatsApp={() => whatsapp(item)} />
        </View>
      )} ItemSeparatorComponent={() => <View style={{ height: 9 }} />} ListHeaderComponent={
        <>
          <EmergencyCard onPress={() => {
            const donors = relatives.filter((p) => p.blood.startsWith('O')).map((p) => `${p.name} (${p.blood})`).join('\n');
            Alert.alert('Emergency blood circle', donors);
          }} />
          <View style={styles.sectionHeader}><View><Text style={styles.sectionHindi}>सभी रिश्तेदार</Text><Text style={styles.sectionTitle}>{filter === 'all' ? 'All family contacts' : filter === 'close' ? 'Your close circle' : 'Compatible blood contacts'}</Text></View><Text style={styles.count}>{filtered.length} SHOWN</Text></View>
        </>
      } ListEmptyComponent={<View style={styles.empty}><Ionicons name="people-outline" size={38} color={colors.maroon} /><Text style={styles.emptyTitle}>No relative found</Text><Text style={styles.emptySub}>Try a name, city, kinship, or blood group.</Text><Pressable onPress={() => { setQuery(''); setFilter('all'); }} style={styles.reset}><Text style={styles.resetText}>Reset search</Text></Pressable></View>} />
      <ProfileModal person={selected} favorite={selected ? favorites.includes(selected.id) : false} onClose={() => setSelected(null)} onCall={() => selected && call(selected)} onWhatsApp={() => selected && whatsapp(selected)} onFavorite={() => selected && setFavorites((f) => f.includes(selected.id) ? f.filter((id) => id !== selected.id) : [...f, selected.id])} />
    </View>
  );
}

function DirectoryChip({ label, active, onPress, icon }: { label: string; active: boolean; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>{icon ? <Ionicons name={icon} size={14} color={active ? colors.white : colors.maroon} /> : null}<Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text></Pressable>;
}

function EmergencyCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.emergency, pressed && { opacity: .72 }]}>
      <View style={styles.drop}><Ionicons name="water" size={22} color={colors.white} /></View>
      <View style={{ flex: 1 }}><Text style={styles.emergencyKicker}>FAMILY CARE CIRCLE</Text><Text style={styles.emergencyTitle}>Need blood in an emergency?</Text><Text style={styles.emergencySub}>Find compatible relatives in one tap</Text></View>
      <View style={styles.emergencyArrow}><Ionicons name="arrow-forward" size={18} color={colors.maroon} /></View>
    </Pressable>
  );
}

function RelativeRow({ person, favorite, onFavorite, onOpen, onCall, onWhatsApp }: { person: Relative; favorite: boolean; onFavorite: () => void; onOpen: () => void; onCall: () => void; onWhatsApp: () => void }) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => [styles.personRow, pressed && { backgroundColor: colors.silk }]}>
      <Avatar source={person.avatar} initials={person.initials} color={person.color} size={57} />
      <View style={{ flex: 1 }}>
        <View style={styles.personNameRow}><Text numberOfLines={1} style={styles.personName}>{person.name}</Text><Pressable onPress={(e) => { e.stopPropagation(); onFavorite(); }} hitSlop={8}><Ionicons name={favorite ? 'star' : 'star-outline'} size={16} color={favorite ? colors.gold : '#B6ADAA'} /></Pressable></View>
        <View style={styles.badgeRow}><Pill text={person.kinship} tone="maroon" /><View style={styles.blood}><Ionicons name="water" size={11} color={colors.danger} /><Text style={styles.bloodText}>{person.blood}</Text></View></View>
        <Text style={styles.personMeta}>{person.branch} · {person.city}</Text>
      </View>
      <View style={styles.quickActions}>
        <Pressable accessibilityLabel={`Call ${person.name}`} onPress={(e) => { e.stopPropagation(); onCall(); }} style={styles.callButton}><Ionicons name="call" size={18} color={colors.maroon} /></Pressable>
        <Pressable accessibilityLabel={`WhatsApp ${person.name}`} onPress={(e) => { e.stopPropagation(); onWhatsApp(); }} style={styles.whatsapp}><Ionicons name="logo-whatsapp" size={20} color={colors.white} /></Pressable>
      </View>
    </Pressable>
  );
}

function ProfileModal({ person, favorite, onClose, onCall, onWhatsApp, onFavorite }: { person: Relative | null; favorite: boolean; onClose: () => void; onCall: () => void; onWhatsApp: () => void; onFavorite: () => void }) {
  if (!person) return null;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.profileSheet}>
          <View style={styles.handle} />
          <Pressable onPress={onClose} style={styles.modalClose}><Ionicons name="close" size={22} color={colors.ink} /></Pressable>
          <Avatar source={person.avatar} initials={person.initials} color={person.color} size={86} story />
          <Text style={styles.profileKin}>{person.kinship}</Text>
          <Text style={styles.profileName}>{person.name}</Text>
          <Text style={styles.profileMeta}>{person.city} · {person.branch}</Text>
          <View style={styles.profileActions}>
            <ProfileAction icon="call" label="Call" onPress={onCall} />
            <ProfileAction icon="logo-whatsapp" label="WhatsApp" onPress={onWhatsApp} green />
            <ProfileAction icon={favorite ? 'star' : 'star-outline'} label={favorite ? 'Saved' : 'Favourite'} onPress={onFavorite} gold />
          </View>
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}><View style={[styles.detailIcon, { backgroundColor: '#FBE8EB' }]}><Ionicons name="water" size={20} color={colors.danger} /></View><View><Text style={styles.detailLabel}>BLOOD GROUP</Text><Text style={styles.detailValue}>{person.blood}</Text></View></View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}><View style={styles.detailIcon}><Ionicons name="git-branch" size={20} color={colors.maroon} /></View><View><Text style={styles.detailLabel}>FAMILY BRANCH</Text><Text style={styles.detailValue}>{person.branch}</Text></View></View>
          </View>
          <Pressable onPress={() => Alert.alert('View in Vriksha', `${person.name} is connected through the ${person.branch}.`)} style={styles.viewTree}><Ionicons name="git-network-outline" size={20} color={colors.maroon} /><Text style={styles.viewTreeText}>View relationship in Vriksha</Text><Ionicons name="arrow-forward" size={18} color={colors.maroon} /></Pressable>
        </View>
      </View>
    </Modal>
  );
}

function ProfileAction({ icon, label, onPress, green, gold }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; green?: boolean; gold?: boolean }) {
  const color = green ? colors.green : gold ? '#9A6815' : colors.maroon;
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.profileAction, pressed && { opacity: .6 }]}><View style={[styles.profileActionIcon, { backgroundColor: green ? colors.greenSoft : gold ? colors.goldSoft : colors.maroonSoft }]}><Ionicons name={icon} size={22} color={color} /></View><Text style={[styles.profileActionLabel, { color }]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  search: { minHeight: 50, marginHorizontal: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14 },
  searchInput: { flex: 1, paddingVertical: 12, color: colors.ink, fontFamily: fonts.regular, fontSize: 11.5 },
  clear: { width: 35, height: 42, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: 7, paddingHorizontal: 20, paddingVertical: 12 },
  chip: { minHeight: 38, paddingHorizontal: 13, borderRadius: 19, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 5 },
  chipActive: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  chipText: { fontFamily: fonts.semibold, fontSize: 9.5, color: colors.ink },
  list: { paddingHorizontal: 14, paddingBottom: 30 },
  emergency: { minHeight: 84, borderRadius: 20, backgroundColor: colors.maroon, flexDirection: 'row', alignItems: 'center', padding: 13, gap: 11, marginBottom: 17, ...shadow },
  drop: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,.13)', alignItems: 'center', justifyContent: 'center' },
  emergencyKicker: { color: colors.gold, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: .8 },
  emergencyTitle: { color: colors.white, fontFamily: fonts.bold, fontSize: 12, marginTop: 3 },
  emergencySub: { color: 'rgba(255,255,255,.66)', fontFamily: fonts.regular, fontSize: 8.5, marginTop: 2 },
  emergencyArrow: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginHorizontal: 5, marginBottom: 5 },
  sectionHindi: { color: colors.maroon, fontFamily: fonts.devanagari, fontSize: 18, lineHeight: 21 },
  sectionTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  count: { color: colors.gold, fontFamily: fonts.bold, fontSize: 8, letterSpacing: .8 },
  alphaRow: { height: 31, flexDirection: 'row', alignItems: 'center', gap: 8 },
  alpha: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 12 },
  alphaLine: { flex: 1, height: 1, backgroundColor: colors.line },
  personRow: { minHeight: 91, padding: 12, borderRadius: 19, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 11 },
  personNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  personName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12.5, flexShrink: 1 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  blood: { height: 27, minWidth: 39, borderRadius: 14, backgroundColor: '#FBE8EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, paddingHorizontal: 6 },
  bloodText: { color: colors.danger, fontFamily: fonts.bold, fontSize: 9 },
  personMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 8.5, marginTop: 4 },
  quickActions: { gap: 6 },
  callButton: { width: 41, height: 36, borderRadius: 12, backgroundColor: colors.maroonSoft, alignItems: 'center', justifyContent: 'center' },
  whatsapp: { width: 41, height: 36, borderRadius: 12, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 15, marginTop: 10 },
  emptySub: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, marginTop: 4 },
  reset: { marginTop: 14, backgroundColor: colors.maroon, borderRadius: 13, height: 42, paddingHorizontal: 17, alignItems: 'center', justifyContent: 'center' },
  resetText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(40,20,24,.46)', justifyContent: 'flex-end' },
  profileSheet: { backgroundColor: colors.cream, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, paddingBottom: Platform.OS === 'ios' ? 36 : 24, alignItems: 'center', ...shadow },
  handle: { width: 43, height: 5, borderRadius: 3, backgroundColor: colors.sandDeep, marginTop: -10, marginBottom: 11 },
  modalClose: { position: 'absolute', right: 17, top: 17, width: 42, height: 42, borderRadius: 21, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  profileKin: { color: colors.maroon, fontFamily: fonts.devanagari, fontSize: 16, marginTop: 9 },
  profileName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 20, marginTop: 2 },
  profileMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, marginTop: 3 },
  profileActions: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 18 },
  profileAction: { minWidth: 78, alignItems: 'center' },
  profileActionIcon: { width: 49, height: 49, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  profileActionLabel: { fontFamily: fonts.bold, fontSize: 9, marginTop: 6 },
  detailsCard: { width: '100%', minHeight: 76, borderRadius: 18, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', padding: 12 },
  detailItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.maroonSoft, alignItems: 'center', justifyContent: 'center' },
  detailLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 7, letterSpacing: .5 },
  detailValue: { color: colors.ink, fontFamily: fonts.bold, fontSize: 10.5, marginTop: 3 },
  detailDivider: { width: 1, height: 42, backgroundColor: colors.line, marginHorizontal: 8 },
  viewTree: { width: '100%', minHeight: 51, borderRadius: 16, backgroundColor: colors.goldSoft, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, gap: 9, marginTop: 12 },
  viewTreeText: { flex: 1, color: colors.maroon, fontFamily: fonts.bold, fontSize: 11 },
});
