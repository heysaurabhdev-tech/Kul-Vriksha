import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar, Pill, RoundIconButton, ScreenTitle } from '../components/Shared';
import { images } from '../lib/data';
import { colors, fonts, shadow } from '../lib/theme';

type TreePerson = { id: string; name: string; years: string; relation: string; source?: number; initials: string; color: string; branch: string };

const family: TreePerson[] = [
  { id: 'root', name: 'Harinarayan', years: '1902–1981', relation: 'Par-dadaji', source: images.chacha, initials: 'HS', color: colors.maroon, branch: 'Mool' },
  { id: 'ramesh', name: 'Ramesh', years: '1932–2018', relation: 'Dadaji', initials: 'RS', color: '#9B6234', branch: 'Kanpur' },
  { id: 'suresh', name: 'Suresh', years: '1938–2020', relation: 'Bade Dadaji', initials: 'SS', color: '#396E63', branch: 'Lucknow' },
  { id: 'mohan', name: 'Mohan', years: '1944–', relation: 'Chhote Dadaji', initials: 'MS', color: '#62508C', branch: 'Delhi' },
  { id: 'dev', name: 'Devendra', years: '1960–', relation: 'Tauji', initials: 'DS', color: '#B27132', branch: 'Kanpur' },
  { id: 'rajesh', name: 'Rajesh', years: '1965–', relation: 'Chacha ji', source: images.chacha, initials: 'RS', color: '#8B4E3D', branch: 'Kanpur' },
  { id: 'meera', name: 'Meera', years: '1968–', relation: 'Bua ji', source: images.dadi, initials: 'MT', color: '#A94261', branch: 'Lucknow' },
];

const branches = [
  { id: 'kanpur', name: 'Kanpur Shakha', hindi: 'कानपुर शाखा', people: 42, generations: 5, newCount: 3, color: colors.maroon },
  { id: 'lucknow', name: 'Lucknow Shakha', hindi: 'लखनऊ शाखा', people: 28, generations: 4, newCount: 1, color: '#A76B21' },
  { id: 'delhi', name: 'Delhi Shakha', hindi: 'दिल्ली शाखा', people: 19, generations: 3, newCount: 0, color: '#3D7168' },
];

export function TreeScreen() {
  const [selected, setSelected] = useState<TreePerson>(family[0]);
  const [view, setView] = useState<'tree' | 'branches'>('tree');
  const [generation, setGeneration] = useState(4);
  const visibleFamily = useMemo(() => generation === 3 ? family.slice(0, 4) : family, [generation]);

  return (
    <View style={styles.screen}>
      <ScreenTitle eyebrow="OUR LINEAGE · 5 GENERATIONS" title="परिवार वृक्ष" action={<RoundIconButton icon="search-outline" accessibilityLabel="Find someone in family tree" onPress={() => Alert.alert('Find in Vriksha', 'Search all 116 relatives by name, relation, or native place.')} />} />
      <View style={styles.toggle}>
        <Pressable onPress={() => setView('tree')} style={[styles.toggleItem, view === 'tree' && styles.toggleActive]}><Ionicons name="git-network-outline" size={18} color={view === 'tree' ? colors.white : colors.maroon} /><Text style={[styles.toggleText, view === 'tree' && styles.toggleTextActive]}>Tree map</Text></Pressable>
        <Pressable onPress={() => setView('branches')} style={[styles.toggleItem, view === 'branches' && styles.toggleActive]}><Ionicons name="layers-outline" size={18} color={view === 'branches' ? colors.white : colors.maroon} /><Text style={[styles.toggleText, view === 'branches' && styles.toggleTextActive]}>Branches</Text></Pressable>
      </View>

      {view === 'tree' ? (
        <FlatList data={branches} keyExtractor={(item) => item.id} renderItem={({ item }) => <BranchCard branch={item} />} ItemSeparatorComponent={() => <View style={{ height: 10 }} />} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} ListHeaderComponent={
          <>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCard}><Text style={styles.summaryNumber}>116</Text><Text style={styles.summaryLabel}>RELATIVES</Text></View>
              <View style={styles.summaryCard}><Text style={styles.summaryNumber}>5</Text><Text style={styles.summaryLabel}>GENERATIONS</Text></View>
              <View style={styles.summaryCard}><Text style={styles.summaryNumber}>8</Text><Text style={styles.summaryLabel}>CITIES</Text></View>
            </View>
            <View style={styles.mapCard}>
              <View style={styles.mapTop}><View><Text style={styles.mapKicker}>ANCESTRAL LINE</Text><Text style={styles.mapTitle}>Sharma · Bharadwaj Gotra</Text></View><Pill text="Verified" icon="shield-checkmark" tone="green" /></View>
              <View style={styles.genControl}><Text style={styles.genLabel}>Show</Text>{[3, 4].map((n) => <Pressable key={n} onPress={() => setGeneration(n)} style={[styles.genOption, generation === n && styles.genOptionActive]}><Text style={[styles.genOptionText, generation === n && { color: colors.white }]}>{n} gen</Text></Pressable>)}</View>
              <FamilyMap people={visibleFamily} selected={selected.id} onSelect={setSelected} />
              <View style={styles.legend}><View style={[styles.legendDot, { backgroundColor: colors.maroon }]} /><Text style={styles.legendText}>Direct line</Text><View style={[styles.legendDot, { backgroundColor: colors.gold }]} /><Text style={styles.legendText}>Related branches</Text><View style={styles.pinch}><Ionicons name="hand-left-outline" size={14} color={colors.muted} /><Text style={styles.legendText}>Tap a person</Text></View></View>
            </View>
            <PersonDetail person={selected} />
            <View style={styles.branchHeading}><View><Text style={styles.branchHindi}>अपनी शाखाएँ</Text><Text style={styles.branchTitle}>Family branches</Text></View><Text style={styles.branchCount}>3 ACTIVE</Text></View>
          </>
        } />
      ) : (
        <FlatList data={branches} keyExtractor={(item) => item.id} renderItem={({ item }) => <BranchCard branch={item} expanded />} ItemSeparatorComponent={() => <View style={{ height: 12 }} />} contentContainerStyle={styles.branchList} ListHeaderComponent={<View style={styles.branchIntro}><LinearGradient colors={[colors.maroon, colors.maroonDark]} style={styles.branchIcon}><Ionicons name="leaf" size={27} color={colors.gold} /></LinearGradient><View style={{ flex: 1 }}><Text style={styles.branchIntroTitle}>One tree, many living branches</Text><Text style={styles.branchIntroText}>Auto-grouped by ancestral home and family connections.</Text></View></View>} />
      )}
    </View>
  );
}

function FamilyMap({ people, selected, onSelect }: { people: TreePerson[]; selected: string; onSelect: (p: TreePerson) => void }) {
  const byId = (id: string) => people.find((p) => p.id === id);
  return (
    <View style={styles.treeCanvas}>
      <View style={[styles.vLine, { top: 72, height: 48 }]} /><TreeNode person={byId('root')!} selected={selected === 'root'} onPress={onSelect} large />
      <View style={[styles.hLine, { top: 119, left: '17%', right: '17%' }]} /><View style={[styles.vLine, { top: 119, height: 31, left: '17%' }]} /><View style={[styles.vLine, { top: 119, height: 31, left: '50%' }]} /><View style={[styles.vLine, { top: 119, height: 31, left: '83%' }]} />
      <View style={styles.generationRow}>{['ramesh', 'suresh', 'mohan'].map((id) => byId(id) ? <TreeNode key={id} person={byId(id)!} selected={selected === id} onPress={onSelect} /> : null)}</View>
      {people.length > 4 ? <><View style={[styles.vLine, { top: 216, height: 34, left: '17%' }]} /><View style={[styles.hLine, { top: 249, left: '7%', right: '40%' }]} /><View style={styles.lastGeneration}>{['dev', 'rajesh', 'meera'].map((id) => <TreeNode key={id} person={byId(id)!} selected={selected === id} onPress={onSelect} small />)}</View></> : null}
    </View>
  );
}

function TreeNode({ person, selected, onPress, large, small }: { person: TreePerson; selected: boolean; onPress: (p: TreePerson) => void; large?: boolean; small?: boolean }) {
  const size = large ? 55 : small ? 38 : 45;
  return (
    <Pressable onPress={() => onPress(person)} style={({ pressed }) => [styles.node, large && { top: 3 }, small && styles.nodeSmall, pressed && { opacity: 0.65 }]}>
      <View style={[styles.nodeAvatar, selected && styles.nodeSelected]}><Avatar source={person.source} initials={person.initials} color={person.color} size={size} /></View>
      <Text numberOfLines={1} style={[styles.nodeName, selected && { color: colors.maroon }]}>{person.name}</Text>
      {!small ? <Text style={styles.nodeYears}>{person.years}</Text> : null}
    </Pressable>
  );
}

function PersonDetail({ person }: { person: TreePerson }) {
  return (
    <View style={styles.personCard}>
      <View style={styles.personTop}><Avatar source={person.source} initials={person.initials} color={person.color} size={56} /><View style={{ flex: 1 }}><Text style={styles.personRelation}>{person.relation}</Text><Text style={styles.personName}>{person.name} Sharma</Text><Text style={styles.personMeta}>{person.years} · {person.branch} branch</Text></View><Pressable onPress={() => Alert.alert(person.name, `${person.relation}\n${person.years}\n${person.branch} branch\n\n12 memories · 8 relatives connected`)} style={styles.personArrow}><Ionicons name="arrow-forward" size={19} color={colors.maroon} /></Pressable></View>
      <View style={styles.personStats}><View><Text style={styles.personStatN}>12</Text><Text style={styles.personStatL}>MEMORIES</Text></View><View style={styles.statDivider} /><View><Text style={styles.personStatN}>8</Text><Text style={styles.personStatL}>CONNECTIONS</Text></View><Pressable onPress={() => Alert.alert('Add a family link', `Connect another relative to ${person.name}.`)} style={styles.connectButton}><Ionicons name="person-add-outline" size={16} color={colors.white} /><Text style={styles.connectText}>Connect</Text></Pressable></View>
    </View>
  );
}

function BranchCard({ branch, expanded }: { branch: typeof branches[number]; expanded?: boolean }) {
  const [joined, setJoined] = useState(false);
  return (
    <Pressable onPress={() => Alert.alert(branch.name, `${branch.people} relatives across ${branch.generations} generations.`)} style={({ pressed }) => [styles.branchCard, pressed && { opacity: .74 }]}>
      <View style={[styles.branchMark, { backgroundColor: `${branch.color}15` }]}><Ionicons name="git-branch" size={24} color={branch.color} /></View>
      <View style={{ flex: 1 }}><Text style={styles.branchCardHindi}>{branch.hindi}</Text><Text style={styles.branchCardName}>{branch.name}</Text><Text style={styles.branchMeta}>{branch.people} relatives · {branch.generations} generations</Text>{expanded ? <View style={styles.avatarStack}><Avatar initials="DS" size={28} color={branch.color} /><Avatar initials="RS" size={28} color={colors.gold} style={{ marginLeft: -7 }} /><Avatar initials="+9" size={28} color="#776D6E" style={{ marginLeft: -7 }} /></View> : null}</View>
      {expanded ? <Pressable onPress={(e) => { e.stopPropagation(); setJoined(!joined); }} style={[styles.follow, joined && styles.following]}><Text style={[styles.followText, joined && { color: colors.maroon }]}>{joined ? 'Following' : 'Follow'}</Text></Pressable> : branch.newCount ? <View style={styles.newBadge}><Text style={styles.newText}>+{branch.newCount}</Text></View> : <Ionicons name="chevron-forward" size={20} color={colors.muted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  toggle: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.white, borderRadius: 16, padding: 4, borderWidth: 1, borderColor: colors.line },
  toggleItem: { flex: 1, minHeight: 45, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 7 },
  toggleActive: { backgroundColor: colors.maroon },
  toggleText: { fontFamily: fonts.bold, fontSize: 12, color: colors.maroon },
  toggleTextActive: { color: colors.white },
  content: { padding: 14, paddingBottom: 26 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryCard: { flex: 1, backgroundColor: colors.white, borderRadius: 15, minHeight: 67, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  summaryNumber: { color: colors.maroon, fontFamily: fonts.devanagari, fontSize: 23, lineHeight: 26 },
  summaryLabel: { color: colors.muted, fontFamily: fonts.bold, fontSize: 7.5, letterSpacing: .7 },
  mapCard: { backgroundColor: colors.white, borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 14, ...shadow },
  mapTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mapKicker: { fontFamily: fonts.bold, fontSize: 8, letterSpacing: 1, color: colors.gold },
  mapTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink, marginTop: 3 },
  genControl: { alignSelf: 'flex-end', marginTop: 10, backgroundColor: colors.cream, borderRadius: 10, padding: 3, flexDirection: 'row', alignItems: 'center' },
  genLabel: { color: colors.muted, fontFamily: fonts.medium, fontSize: 8, marginHorizontal: 7 },
  genOption: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  genOptionActive: { backgroundColor: colors.maroon },
  genOptionText: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 8 },
  treeCanvas: { height: 340, marginTop: 5, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  vLine: { position: 'absolute', width: 1.5, backgroundColor: colors.gold, left: '50%' },
  hLine: { position: 'absolute', height: 1.5, backgroundColor: colors.gold },
  generationRow: { position: 'absolute', top: 141, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' },
  lastGeneration: { position: 'absolute', top: 242, left: 0, width: '61%', flexDirection: 'row', justifyContent: 'space-around' },
  node: { width: 92, alignItems: 'center', zIndex: 2 },
  nodeSmall: { width: 62 },
  nodeAvatar: { padding: 3, borderRadius: 40, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  nodeSelected: { borderWidth: 2.5, borderColor: colors.gold, backgroundColor: colors.goldSoft },
  nodeName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 9.5, marginTop: 4 },
  nodeYears: { color: colors.muted, fontFamily: fonts.regular, fontSize: 7.5, marginTop: 1 },
  legend: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10, gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4, marginLeft: 3 },
  legendText: { fontFamily: fonts.medium, color: colors.muted, fontSize: 8 },
  pinch: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  personCard: { backgroundColor: colors.maroon, borderRadius: 20, marginTop: 12, padding: 14, ...shadow },
  personTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  personRelation: { color: colors.gold, fontFamily: fonts.devanagari, fontSize: 13 },
  personName: { color: colors.white, fontFamily: fonts.bold, fontSize: 15 },
  personMeta: { color: 'rgba(255,255,255,.68)', fontFamily: fonts.regular, fontSize: 9, marginTop: 3 },
  personArrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.goldSoft, alignItems: 'center', justifyContent: 'center' },
  personStats: { flexDirection: 'row', alignItems: 'center', marginTop: 13, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,.16)', paddingTop: 11, gap: 14 },
  personStatN: { color: colors.white, fontFamily: fonts.bold, fontSize: 14 },
  personStatL: { color: 'rgba(255,255,255,.58)', fontFamily: fonts.bold, fontSize: 6.5, letterSpacing: .5 },
  statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,.18)' },
  connectButton: { marginLeft: 'auto', height: 38, borderRadius: 12, paddingHorizontal: 13, backgroundColor: 'rgba(255,255,255,.13)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  connectText: { color: colors.white, fontFamily: fonts.bold, fontSize: 10 },
  branchHeading: { marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  branchHindi: { color: colors.maroon, fontFamily: fonts.devanagari, fontSize: 18, lineHeight: 22 },
  branchTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  branchCount: { color: colors.gold, fontFamily: fonts.bold, fontSize: 8, letterSpacing: .8 },
  branchCard: { minHeight: 81, padding: 12, backgroundColor: colors.white, borderRadius: 18, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 11 },
  branchMark: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  branchCardHindi: { color: colors.maroon, fontFamily: fonts.devanagari, fontSize: 12, lineHeight: 14 },
  branchCardName: { color: colors.ink, fontFamily: fonts.bold, fontSize: 12 },
  branchMeta: { color: colors.muted, fontFamily: fonts.regular, fontSize: 9, marginTop: 3 },
  newBadge: { minWidth: 30, height: 30, borderRadius: 15, backgroundColor: colors.maroonSoft, alignItems: 'center', justifyContent: 'center' },
  newText: { color: colors.maroon, fontFamily: fonts.bold, fontSize: 10 },
  branchList: { padding: 20, paddingTop: 14, paddingBottom: 30 },
  branchIntro: { flexDirection: 'row', gap: 13, alignItems: 'center', marginBottom: 17, padding: 15, backgroundColor: colors.goldSoft, borderRadius: 19 },
  branchIcon: { width: 52, height: 52, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  branchIntroTitle: { color: colors.ink, fontFamily: fonts.bold, fontSize: 13 },
  branchIntroText: { color: colors.muted, fontFamily: fonts.regular, fontSize: 10, lineHeight: 15, marginTop: 3 },
  avatarStack: { flexDirection: 'row', marginTop: 8 },
  follow: { paddingHorizontal: 13, height: 36, backgroundColor: colors.maroon, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  following: { backgroundColor: colors.maroonSoft, borderWidth: 1, borderColor: '#D8B5BF' },
  followText: { color: colors.white, fontFamily: fonts.bold, fontSize: 9 },
});
