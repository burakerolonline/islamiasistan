// src/screens/ZikirScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Platform, Modal, FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import { DHIKRS } from '../data/dhikrs';

export const ZikirScreen = ({ navigation }: any) => {
  const {
    isDarkMode,
    currentDhikrCount, currentDhikrTarget, currentDhikrName,
    setCurrentDhikr, incrementDhikr, resetDhikr, saveDhikrRecord, dhikrRecords,
  } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [showSelector, setShowSelector] = React.useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const celebrateAnim = useRef(new Animated.Value(0)).current;

  const isComplete = currentDhikrCount >= currentDhikrTarget;
  const progress = currentDhikrCount / currentDhikrTarget;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (isComplete) {
      Animated.sequence([
        Animated.spring(celebrateAnim, { toValue: 1, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(celebrateAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [currentDhikrCount]);

  const handlePress = async () => {
    if (isComplete) return;
    incrementDhikr();

    // Haptic feedback
    if (Platform.OS !== 'web') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Button animation
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
  };

  const handleReset = async () => {
    if (currentDhikrCount > 0) saveDhikrRecord();
    resetDhikr();
    if (Platform.OS !== 'web') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [C.primary, C.primaryLight, '#00C853'],
  });

  const currentDhikr = DHIKRS.find((d) => d.name === currentDhikrName) || DHIKRS[0];

  // Today's total
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTotal = dhikrRecords
    .filter((r) => r.date === todayStr)
    .reduce((sum, r) => sum + r.count, 0) + currentDhikrCount;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>📿 Zikirmatik</Text>
        <Text style={styles.todayTotal}>Bugün: {todayTotal} zikir</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dhikr Selector */}
        <TouchableOpacity
          style={[styles.selectorBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
          onPress={() => setShowSelector(true)}
        >
          <View style={styles.selectorContent}>
            <Text style={[styles.arabicSmall, { color: C.primary }]}>{currentDhikr.arabic}</Text>
            <Text style={[styles.dhikrName, { color: C.text }]}>{currentDhikrName}</Text>
            <Text style={[styles.dhikrMeaning, { color: C.textSecondary }]}>{currentDhikr.meaning}</Text>
          </View>
          <View style={styles.selectorRight}>
            <Text style={[styles.targetText, { color: C.primary }]}>{currentDhikrTarget}×</Text>
            <Ionicons name="chevron-down" size={20} color={C.textMuted} />
          </View>
        </TouchableOpacity>

        {/* Progress Ring Area */}
        <View style={styles.counterArea}>
          {/* Progress Arc (simplified as bar) */}
          <View style={[styles.progressRingBg, { borderColor: C.border }]}>
            <Animated.View
              style={[
                styles.progressRingFill,
                {
                  backgroundColor: isComplete ? '#00C853' : C.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Big Counter Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.counterBtn,
                {
                  backgroundColor: isComplete ? '#00C853' : C.primary,
                  ...SHADOWS.lg,
                },
              ]}
              onPress={handlePress}
              activeOpacity={0.9}
            >
              <Text style={styles.counterNumber}>{currentDhikrCount}</Text>
              <Text style={styles.counterOf}>/ {currentDhikrTarget}</Text>
              {isComplete ? (
                <Text style={styles.completeText}>✓ Tamamlandı!</Text>
              ) : (
                <Text style={styles.tapText}>Dokun</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Celebrate */}
          <Animated.View style={[styles.celebrate, { opacity: celebrateAnim, transform: [{ scale: celebrateAnim }] }]}>
            <Text style={styles.celebrateText}>🎉 Tebrikler! {currentDhikrName} tamamlandı!</Text>
          </Animated.View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={handleReset}
          >
            <Ionicons name="refresh" size={22} color={C.textSecondary} />
            <Text style={[styles.controlLabel, { color: C.textSecondary }]}>Sıfırla</Text>
          </TouchableOpacity>

          <View style={[styles.remainingBadge, { backgroundColor: C.primary + '20' }]}>
            <Text style={[styles.remainingText, { color: C.primary }]}>
              {Math.max(0, currentDhikrTarget - currentDhikrCount)} kaldı
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.controlBtn, { backgroundColor: C.card, ...SHADOWS.sm }]}
            onPress={() => { saveDhikrRecord(); }}
          >
            <Ionicons name="save-outline" size={22} color={C.textSecondary} />
            <Text style={[styles.controlLabel, { color: C.textSecondary }]}>Kaydet</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Records */}
        {dhikrRecords.filter((r) => r.date === todayStr).length > 0 && (
          <View style={[styles.recordsSection, { backgroundColor: C.card, ...SHADOWS.sm }]}>
            <Text style={[styles.recordsTitle, { color: C.text }]}>📊 Bugünkü Zikirler</Text>
            {dhikrRecords
              .filter((r) => r.date === todayStr)
              .reverse()
              .slice(0, 5)
              .map((rec, idx) => (
                <View key={idx} style={[styles.recordRow, { borderBottomColor: C.borderLight }]}>
                  <Text style={[styles.recordName, { color: C.text }]}>{rec.name}</Text>
                  <View style={[styles.recordBadge, { backgroundColor: C.primary + '20' }]}>
                    <Text style={[styles.recordCount, { color: C.primary }]}>{rec.count}/{rec.target}</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Dhikr Virtue */}
        {currentDhikr.virtue && (
          <View style={[styles.virtueBanner, { backgroundColor: C.primaryLighter + '15', borderColor: C.primaryLighter + '40' }]}>
            <Text style={styles.virtueIcon}>✨</Text>
            <Text style={[styles.virtueText, { color: C.primaryMed }]}>{currentDhikr.virtue}</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Dhikr Selector Modal */}
      <Modal visible={showSelector} transparent animationType="slide">
        <View style={[styles.modalOverlay]}>
          <View style={[styles.modalSheet, { backgroundColor: C.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: C.text }]}>Zikir Seç</Text>
              <TouchableOpacity onPress={() => setShowSelector(false)}>
                <Ionicons name="close" size={24} color={C.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DHIKRS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dhikrOption,
                    { borderBottomColor: C.borderLight },
                    item.name === currentDhikrName && { backgroundColor: C.primary + '15' },
                  ]}
                  onPress={() => {
                    setCurrentDhikr(item.name, item.defaultTarget);
                    setShowSelector(false);
                  }}
                >
                  <View style={styles.dhikrOptionContent}>
                    <Text style={[styles.dhikrOptionArabic, { color: C.primary }]}>{item.arabic}</Text>
                    <Text style={[styles.dhikrOptionName, { color: C.text }]}>{item.name}</Text>
                    <Text style={[styles.dhikrOptionMeaning, { color: C.textSecondary }]}>{item.meaning}</Text>
                  </View>
                  <View style={styles.dhikrOptionRight}>
                    <Text style={[styles.dhikrOptionTarget, { color: C.primary }]}>{item.defaultTarget}×</Text>
                    {item.name === currentDhikrName && (
                      <Ionicons name="checkmark-circle" size={20} color={C.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  todayTotal: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  selectorBtn: { margin: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center' },
  selectorContent: { flex: 1 },
  arabicSmall: { fontSize: FONT_SIZES.xl, fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif', marginBottom: 4, textAlign: 'right' },
  dhikrName: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  dhikrMeaning: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  selectorRight: { alignItems: 'center', gap: 4 },
  targetText: { fontSize: FONT_SIZES.xl, fontWeight: '900' },
  counterArea: { alignItems: 'center', paddingVertical: SPACING.lg },
  progressRingBg: { width: '80%', height: 6, borderRadius: 3, backgroundColor: 'transparent', borderWidth: 1, marginBottom: SPACING.xl, overflow: 'hidden' },
  progressRingFill: { height: '100%', borderRadius: 3 },
  counterBtn: {
    width: 220, height: 220, borderRadius: 110,
    alignItems: 'center', justifyContent: 'center',
  },
  counterNumber: { fontSize: 64, fontWeight: '900', color: '#fff', lineHeight: 70 },
  counterOf: { fontSize: FONT_SIZES.lg, color: 'rgba(255,255,255,0.8)' },
  completeText: { fontSize: FONT_SIZES.md, color: '#fff', fontWeight: '700', marginTop: 4 },
  tapText: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  celebrate: { position: 'absolute', bottom: -10 },
  celebrateText: { fontSize: FONT_SIZES.md, fontWeight: '700', textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xxl, marginBottom: SPACING.lg },
  controlBtn: { alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.md, gap: 4 },
  controlLabel: { fontSize: FONT_SIZES.xs },
  remainingBadge: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  remainingText: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  recordsSection: { margin: SPACING.lg, borderRadius: RADIUS.lg, overflow: 'hidden', padding: SPACING.lg },
  recordsTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', marginBottom: SPACING.md },
  recordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  recordName: { fontSize: FONT_SIZES.md },
  recordBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full },
  recordCount: { fontSize: FONT_SIZES.sm, fontWeight: '600' },
  virtueBanner: { margin: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm },
  virtueIcon: { fontSize: 16 },
  virtueText: { flex: 1, fontSize: FONT_SIZES.sm, lineHeight: 20, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, maxHeight: '75%', paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1 },
  modalTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700' },
  dhikrOption: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1 },
  dhikrOptionContent: { flex: 1 },
  dhikrOptionArabic: { fontSize: FONT_SIZES.lg, marginBottom: 4, textAlign: 'right' },
  dhikrOptionName: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  dhikrOptionMeaning: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  dhikrOptionRight: { alignItems: 'center', gap: 4, marginLeft: SPACING.md },
  dhikrOptionTarget: { fontSize: FONT_SIZES.md, fontWeight: '700' },
});