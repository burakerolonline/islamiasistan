// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  RefreshControl, ActivityIndicator, Platform, Modal, FlatList, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import {
  fetchPrayerTimesByCity, getPrayerList, getCurrentAndNextPrayer,
  getCountdownToNextPrayer, getMockPrayerTimes, PrayerTimes, TURKEY_CITIES,
} from '../utils/prayerTimes';
import { getTodaysSura } from '../data/dhikrs';

const PRAYER_ICONS: Record<string, string> = {
  Fajr: 'partly-sunny-outline',
  Sunrise: 'sunny-outline',
  Dhuhr: 'sunny',
  Asr: 'cloud-sun-outline',
  Maghrib: 'sunset-outline',
  Isha: 'moon-outline',
};

export const HomeScreen = ({ navigation }: any) => {
  const {
    isDarkMode, streakCount,
    selectedCity, setSelectedCity, updateStreak,
  } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [nextPrayer, setNextPrayer] = useState('');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');

  const todaySura = getTodaysSura();

  const loadPrayerTimes = useCallback(async (city?: string) => {
    const useCity = city || selectedCity || 'İstanbul';
    setLoading(true);
    const times = await fetchPrayerTimesByCity(useCity);
    setPrayerTimes(times || getMockPrayerTimes());
    setLoading(false);
  }, [selectedCity]);

  useEffect(() => {
    updateStreak();
    loadPrayerTimes();
  }, [selectedCity]);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const { current, next, nextTime } = getCurrentAndNextPrayer(prayerTimes);
      setCurrentPrayer(current);
      setNextPrayer(next);
      setCountdown(getCountdownToNextPrayer(nextTime));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrayerTimes();
    setRefreshing(false);
  };

  const filteredCities = TURKEY_CITIES.filter(c =>
    c.name.toLowerCase().includes(citySearch.toLowerCase())
  );

  const today = new Date();
  const dateStr = today.toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: C.primary }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerGreeting}>Esselamu Aleykum 🌙</Text>
            <Text style={styles.headerDate}>{dateStr}</Text>
            {/* Şehir Seçici Butonu */}
            <TouchableOpacity
              style={styles.cityBtn}
              onPress={() => { setCitySearch(''); setShowCityPicker(true); }}
            >
              <Ionicons name="location" size={13} color="rgba(255,255,255,0.9)" />
              <Text style={styles.cityBtnText}>{selectedCity || 'İstanbul'}</Text>
              <Ionicons name="chevron-down" size={13} color="rgba(255,255,255,0.9)" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.streakBadge}
            onPress={() => navigation.navigate('Profil')}
          >
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakNum}>{streakCount}</Text>
            <Text style={styles.streakLabel}>Gün</Text>
          </TouchableOpacity>
        </View>

        {/* Sonraki Vakit Sayacı */}
        {prayerTimes && (
          <View style={[styles.countdownCard, { backgroundColor: C.primaryMed }]}>
            <Text style={styles.countdownLabel}>Sonraki Vakit: {nextPrayer === 'Fajr' ? 'İmsak' : nextPrayer === 'Sunrise' ? 'Güneş' : nextPrayer === 'Dhuhr' ? 'Öğle' : nextPrayer === 'Asr' ? 'İkindi' : nextPrayer === 'Maghrib' ? 'Akşam' : 'Yatsı'}</Text>
            <Text style={styles.countdownTime}>{countdown}</Text>
            <Text style={styles.countdownSub}>içinde</Text>
          </View>
        )}

        {/* Namaz Vakitleri */}
        <View style={[styles.section, { backgroundColor: C.card, ...SHADOWS.md }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>🕌 Namaz Vakitleri</Text>
            {loading && <ActivityIndicator size="small" color={C.primary} />}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={C.primary} />
              <Text style={[styles.loadingText, { color: C.textSecondary }]}>Vakitler yükleniyor...</Text>
            </View>
          ) : prayerTimes ? (
            getPrayerList(prayerTimes).map((prayer, idx) => (
              <View
                key={prayer.key}
                style={[
                  styles.prayerRow,
                  prayer.isCurrent && { backgroundColor: C.primary + '20' },
                  prayer.isNext && { backgroundColor: C.accent + '15' },
                  { borderBottomColor: C.borderLight },
                  idx === 5 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.prayerLeft}>
                  <Ionicons
                    name={PRAYER_ICONS[prayer.key] as any}
                    size={20}
                    color={prayer.isCurrent ? C.primary : prayer.isNext ? C.accent : C.textMuted}
                  />
                  <Text style={[
                    styles.prayerName,
                    { color: prayer.isCurrent ? C.primary : C.text },
                    prayer.isCurrent && { fontWeight: '700' },
                  ]}>
                    {prayer.name}
                  </Text>
                  {prayer.isCurrent && (
                    <View style={[styles.badge, { backgroundColor: C.primary }]}>
                      <Text style={styles.badgeText}>Şu an</Text>
                    </View>
                  )}
                  {prayer.isNext && (
                    <View style={[styles.badge, { backgroundColor: C.accent }]}>
                      <Text style={styles.badgeText}>Sonraki</Text>
                    </View>
                  )}
                </View>
                <Text style={[
                  styles.prayerTime,
                  { color: prayer.isCurrent ? C.primary : prayer.isNext ? C.accent : C.text },
                  (prayer.isCurrent || prayer.isNext) && { fontWeight: '700' },
                ]}>
                  {prayer.time}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.errorText, { color: C.textSecondary }]}>
              Vakitler yüklenemedi.
            </Text>
          )}
        </View>

        {/* Bugünün Suresi */}
        <TouchableOpacity
          style={[styles.suraCard, { backgroundColor: C.card, ...SHADOWS.sm }]}
          onPress={() => navigation.navigate('SureDetay', { sura: todaySura })}
        >
          <View style={styles.suraHeader}>
            <View style={[styles.suraIconBg, { backgroundColor: C.primary + '20' }]}>
              <Text style={styles.suraIcon}>📖</Text>
            </View>
            <View style={styles.suraInfo}>
              <Text style={[styles.suraLabel, { color: C.textMuted }]}>Bugünün Suresi</Text>
              <Text style={[styles.suraName, { color: C.text }]}>{todaySura.name}</Text>
              <Text style={[styles.suraVerse, { color: C.textSecondary }]}>
                {todaySura.verses} ayet · {todaySura.meaning}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.textMuted} />
          </View>
          {todaySura.virtue && (
            <View style={[styles.suraVirtue, { backgroundColor: C.primary + '10', borderLeftColor: C.primary }]}>
              <Text style={[styles.suraVirtueText, { color: C.primaryLight }]}>✨ {todaySura.virtue}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Hızlı Erişim */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={() => navigation.navigate('Zikir')}
          >
            <Text style={styles.quickIcon}>📿</Text>
            <Text style={[styles.quickLabel, { color: C.text }]}>Zikirmatik</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={() => navigation.navigate('Kıble')}
          >
            <Text style={styles.quickIcon}>🧭</Text>
            <Text style={[styles.quickLabel, { color: C.text }]}>Kıble</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={() => navigation.navigate('Dualar')}
          >
            <Text style={styles.quickIcon}>🤲</Text>
            <Text style={[styles.quickLabel, { color: C.text }]}>Dualar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={() => navigation.navigate('Ayetler')}
          >
            <Text style={styles.quickIcon}>📖</Text>
            <Text style={[styles.quickLabel, { color: C.text }]}>Ayetler</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      {/* Şehir Seçici Modal */}
      <Modal visible={showCityPicker} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { backgroundColor: C.primary }]}>
            <TouchableOpacity onPress={() => setShowCityPicker(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>🏙️ Şehir Seçin</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Arama */}
          <View style={[styles.citySearch, { backgroundColor: C.card, borderBottomColor: C.border }]}>
            <Ionicons name="search" size={18} color={C.textMuted} />
            <TextInput
              style={[styles.citySearchInput, { color: C.text }]}
              placeholder="İl ara..."
              placeholderTextColor={C.textMuted}
              value={citySearch}
              onChangeText={setCitySearch}
              autoFocus
            />
            {citySearch.length > 0 && (
              <TouchableOpacity onPress={() => setCitySearch('')}>
                <Ionicons name="close-circle" size={18} color={C.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Şehir Listesi */}
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const isSelected = selectedCity === item.name;
              return (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    { borderBottomColor: C.borderLight },
                    isSelected && { backgroundColor: C.primary + '15' },
                  ]}
                  onPress={() => {
                    setSelectedCity(item.name);
                    setShowCityPicker(false);
                    loadPrayerTimes(item.name);
                  }}
                >
                  <Text style={[styles.cityItemText, { color: isSelected ? C.primary : C.text }]}>
                    {item.name}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={C.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
  },
  headerGreeting: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff', marginBottom: 4 },
  headerDate: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  cityBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm, paddingVertical: 5,
    borderRadius: RADIUS.full, alignSelf: 'flex-start',
  },
  cityBtnText: { fontSize: FONT_SIZES.sm, color: '#fff', fontWeight: '600' },
  streakBadge: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.md, padding: SPACING.sm,
  },
  streakFire: { fontSize: 20 },
  streakNum: { fontSize: FONT_SIZES.xl, fontWeight: '900', color: '#fff' },
  streakLabel: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.8)' },
  countdownCard: {
    margin: SPACING.lg, borderRadius: RADIUS.lg,
    padding: SPACING.xl, alignItems: 'center',
  },
  countdownLabel: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  countdownTime: { fontSize: FONT_SIZES.xxxl, fontWeight: '900', color: '#fff' },
  countdownSub: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  section: { margin: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.lg, paddingBottom: SPACING.md,
  },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  loadingContainer: { padding: SPACING.xxl, alignItems: 'center' },
  loadingText: { marginTop: SPACING.sm, fontSize: FONT_SIZES.sm },
  prayerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderBottomWidth: 1,
  },
  prayerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  prayerName: { fontSize: FONT_SIZES.md, marginLeft: SPACING.sm },
  prayerTime: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full, marginLeft: SPACING.sm },
  badgeText: { fontSize: 10, color: '#fff', fontWeight: '700' },
  errorText: { padding: SPACING.lg, textAlign: 'center' },
  suraCard: {
    margin: SPACING.lg, marginTop: 0, borderRadius: RADIUS.lg,
    overflow: 'hidden', padding: SPACING.lg,
  },
  suraHeader: { flexDirection: 'row', alignItems: 'center' },
  suraIconBg: {
    width: 48, height: 48, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md,
  },
  suraIcon: { fontSize: 24 },
  suraInfo: { flex: 1 },
  suraLabel: { fontSize: FONT_SIZES.xs, marginBottom: 2 },
  suraName: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  suraVerse: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  suraVirtue: {
    marginTop: SPACING.md, padding: SPACING.sm,
    borderRadius: RADIUS.sm, borderLeftWidth: 3,
  },
  suraVirtueText: { fontSize: FONT_SIZES.sm, fontStyle: 'italic' },
  quickActions: {
    flexDirection: 'row', paddingHorizontal: SPACING.lg,
    gap: SPACING.sm, marginBottom: SPACING.lg,
  },
  quickBtn: { flex: 1, alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.md },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: FONT_SIZES.xs, fontWeight: '600', textAlign: 'center' },
  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 56 : SPACING.lg,
  },
  modalTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: '#fff' },
  citySearch: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderBottomWidth: 1,
  },
  citySearchInput: { flex: 1, fontSize: FONT_SIZES.md, paddingVertical: 8 },
  cityItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md + 2, borderBottomWidth: 1,
  },
  cityItemText: { fontSize: FONT_SIZES.md, fontWeight: '500' },
});