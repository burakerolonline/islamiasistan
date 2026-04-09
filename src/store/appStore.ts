// src/store/appStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PrayerRecord {
  date: string;
  fajr: boolean;
  sunrise: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface DhikrRecord {
  date: string;
  name: string;
  count: number;
  target: number;
}

export interface AppState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  streakCount: number;
  lastOpenedDate: string;
  updateStreak: () => void;
  prayerRecords: PrayerRecord[];
  togglePrayer: (date: string, prayer: keyof Omit<PrayerRecord, 'date'>) => void;
  getTodayRecord: () => PrayerRecord;
  dhikrRecords: DhikrRecord[];
  currentDhikrCount: number;
  currentDhikrTarget: number;
  currentDhikrName: string;
  setCurrentDhikr: (name: string, target: number) => void;
  incrementDhikr: () => void;
  resetDhikr: () => void;
  saveDhikrRecord: () => void;
  favoriteDuas: string[];
  toggleFavoriteDua: (id: string) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  latitude: number | null;
  longitude: number | null;
  cityName: string;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  setLocation: (lat: number, lon: number, city: string) => void;
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const TODAY = () => new Date().toISOString().split('T')[0];

const DEFAULT_RECORD = (date: string): PrayerRecord => ({
  date, fajr: false, sunrise: false, dhuhr: false, asr: false, maghrib: false, isha: false,
});

export const useAppStore = create<AppState>((set, get) => ({
  isDarkMode: false,
  toggleDarkMode: () => { set((s) => ({ isDarkMode: !s.isDarkMode })); get().saveToStorage(); },

  streakCount: 0,
  lastOpenedDate: '',
  updateStreak: () => {
    const today = TODAY();
    const { lastOpenedDate, streakCount } = get();
    if (lastOpenedDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split('T')[0];
    const newStreak = lastOpenedDate === yStr ? streakCount + 1 : 1;
    set({ streakCount: newStreak, lastOpenedDate: today });
    get().saveToStorage();
  },

  prayerRecords: [],
  togglePrayer: (date, prayer) => {
    const records = [...get().prayerRecords];
    let rec = records.find((r) => r.date === date);
    if (!rec) { rec = DEFAULT_RECORD(date); records.push(rec); }
    rec[prayer] = !rec[prayer];
    set({ prayerRecords: records });
    get().saveToStorage();
  },
  getTodayRecord: () => {
    const today = TODAY();
    return get().prayerRecords.find((r) => r.date === today) || DEFAULT_RECORD(today);
  },

  dhikrRecords: [],
  currentDhikrCount: 0,
  currentDhikrTarget: 33,
  currentDhikrName: 'Sübhanallah',
  setCurrentDhikr: (name, target) => set({ currentDhikrName: name, currentDhikrTarget: target, currentDhikrCount: 0 }),
  incrementDhikr: () => {
    const { currentDhikrCount, currentDhikrTarget } = get();
    if (currentDhikrCount < currentDhikrTarget) set({ currentDhikrCount: currentDhikrCount + 1 });
  },
  resetDhikr: () => set({ currentDhikrCount: 0 }),
  saveDhikrRecord: () => {
    const { currentDhikrCount, currentDhikrTarget, currentDhikrName, dhikrRecords } = get();
    set({ dhikrRecords: [...dhikrRecords, { date: TODAY(), name: currentDhikrName, count: currentDhikrCount, target: currentDhikrTarget }] });
    get().saveToStorage();
  },

  favoriteDuas: [],
  toggleFavoriteDua: (id) => {
    const favs = get().favoriteDuas;
    set({ favoriteDuas: favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id] });
    get().saveToStorage();
  },

  notificationsEnabled: true,
  setNotificationsEnabled: (val) => { set({ notificationsEnabled: val }); get().saveToStorage(); },

  latitude: null,
  longitude: null,
  cityName: '',
  selectedCity: 'İstanbul',
  setSelectedCity: (city) => { set({ selectedCity: city }); get().saveToStorage(); },
  setLocation: (lat, lon, city) => set({ latitude: lat, longitude: lon, cityName: city }),

  loadFromStorage: async () => {
    try {
      const data = await AsyncStorage.getItem('@islami_asistan_state');
      if (data) {
        const p = JSON.parse(data);
        set({
          isDarkMode: p.isDarkMode ?? false,
          streakCount: p.streakCount ?? 0,
          lastOpenedDate: p.lastOpenedDate ?? '',
          prayerRecords: p.prayerRecords ?? [],
          dhikrRecords: p.dhikrRecords ?? [],
          favoriteDuas: p.favoriteDuas ?? [],
          notificationsEnabled: p.notificationsEnabled ?? true,
          selectedCity: p.selectedCity ?? 'İstanbul',
        });
      }
    } catch (e) { console.log('Storage load error:', e); }
  },

  saveToStorage: async () => {
    const s = get();
    try {
      await AsyncStorage.setItem('@islami_asistan_state', JSON.stringify({
        isDarkMode: s.isDarkMode,
        streakCount: s.streakCount,
        lastOpenedDate: s.lastOpenedDate,
        prayerRecords: s.prayerRecords,
        dhikrRecords: s.dhikrRecords,
        favoriteDuas: s.favoriteDuas,
        notificationsEnabled: s.notificationsEnabled,
        selectedCity: s.selectedCity,
      }));
    } catch (e) { console.log('Storage save error:', e); }
  },
}));