export type Story = {
  id: string;
  name: string;
  kin: string;
  time: string;
  type: 'voice' | 'photo';
  source: number;
};

export const images = {
  dadi: require('../assets/images/dadi.jpg'),
  chacha: require('../assets/images/chacha.jpg'),
  couple: require('../assets/images/couple.jpg'),
  vintage: require('../assets/images/family-vintage.jpg'),
  restored: require('../assets/images/family-restored.jpg'),
  wedding: require('../assets/images/family-wedding.jpg'),
  likhari: require('../assets/images/likhari-1888.jpg'),
  taj: require('../assets/images/ancestral-home.jpg'),
};

export const stories: Story[] = [
  { id: 'you', name: 'Your story', kin: 'Add memory', time: 'now', type: 'photo', source: images.couple },
  { id: '1', name: 'Dadi', kin: '15s voice memory', time: '8m', type: 'voice', source: images.dadi },
  { id: '2', name: 'Chacha ji', kin: 'From Kanpur', time: '24m', type: 'photo', source: images.chacha },
  { id: '3', name: 'Bua & Fufaji', kin: 'Old days', time: '1h', type: 'voice', source: images.couple },
  { id: '4', name: 'Delhi branch', kin: 'Family update', time: '2h', type: 'photo', source: images.wedding },
];

export type Chat = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  unread: number;
  kind: 'channel' | 'branch' | 'private';
  avatar?: number;
  color: string;
  muted?: boolean;
};

export const chats: Chat[] = [
  { id: 'announcements', title: 'Kul Announcements', subtitle: 'Maa: Holi milan is on Sunday 🌼', time: '9:42 AM', unread: 3, kind: 'channel', color: '#800020' },
  { id: 'kanpur', title: 'Kanpur Cousins', subtitle: 'Rohan: Sending the old album tonight', time: '9:18 AM', unread: 6, kind: 'branch', color: '#C07A24' },
  { id: 'elders', title: 'Elders’ Aashirwad', subtitle: 'Dadi sent a voice memory · 0:15', time: 'Yesterday', unread: 1, kind: 'channel', color: '#7C4B2F', muted: true },
  { id: 'meera', title: 'Meera Bua', subtitle: '✓✓ The restoration looks beautiful', time: 'Yesterday', unread: 0, kind: 'private', avatar: images.dadi, color: '#A94261' },
  { id: 'jaipur', title: 'Jaipur Branch', subtitle: 'Ananya: 4 photos', time: 'Friday', unread: 0, kind: 'branch', color: '#2D7A69' },
  { id: 'arjun', title: 'Arjun Bhaiya', subtitle: '✓✓ See you at the puja!', time: 'Thursday', unread: 0, kind: 'private', avatar: images.chacha, color: '#486A8B' },
];

export type Relative = {
  id: string;
  name: string;
  kinship: string;
  branch: string;
  blood: string;
  city: string;
  phone: string;
  avatar?: number;
  initials: string;
  color: string;
};

export const relatives: Relative[] = [
  { id: '1', name: 'Rajesh Sharma', kinship: 'Aapke Chacha', branch: 'Kanpur branch', blood: 'B+', city: 'Kanpur', phone: '+919810000101', avatar: images.chacha, initials: 'RS', color: '#8B4E3D' },
  { id: '2', name: 'Meera Trivedi', kinship: 'Aapki Bua', branch: 'Lucknow branch', blood: 'O+', city: 'Lucknow', phone: '+919810000102', avatar: images.dadi, initials: 'MT', color: '#A94261' },
  { id: '3', name: 'Devendra Sharma', kinship: 'Aapke Tauji', branch: 'Delhi branch', blood: 'A+', city: 'New Delhi', phone: '+919810000103', initials: 'DS', color: '#69519B' },
  { id: '4', name: 'Shalini Sharma', kinship: 'Aapki Chachi', branch: 'Kanpur branch', blood: 'AB+', city: 'Kanpur', phone: '+919810000104', initials: 'SS', color: '#C07A24' },
  { id: '5', name: 'Aarav Sharma', kinship: 'Aapke Cousin', branch: 'Mumbai branch', blood: 'B-', city: 'Mumbai', phone: '+919810000105', initials: 'AS', color: '#337E73' },
  { id: '6', name: 'Kamla Devi', kinship: 'Aapki Dadi', branch: 'Mool shakha', blood: 'O-', city: 'Prayagraj', phone: '+919810000106', avatar: images.dadi, initials: 'KD', color: '#800020' },
  { id: '7', name: 'Nitin & Reena', kinship: 'Aapke Mama-Mami', branch: 'Jaipur branch', blood: 'A-', city: 'Jaipur', phone: '+919810000107', avatar: images.couple, initials: 'NR', color: '#76522E' },
];
