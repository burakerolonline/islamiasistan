// src/screens/SureDetayScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import { Sura } from '../data/dhikrs';

export const SureDetayScreen = ({ route, navigation }: any) => {
  const { sura }: { sura: Sura } = route.params;
  const { isDarkMode } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerArabic}>{sura.arabicName}</Text>
          <Text style={styles.headerTitle}>{sura.name}</Text>
          <Text style={styles.headerMeta}>{sura.verses} Ayet · {sura.meaning}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Virtue */}
        {sura.virtue && (
          <View style={[styles.virtueCard, { backgroundColor: C.primary + '15', borderColor: C.primary + '30' }]}>
            <Text style={styles.virtueIcon}>✨</Text>
            <Text style={[styles.virtueText, { color: C.primaryMed }]}>{sura.virtue}</Text>
          </View>
        )}

        {/* Arabic Text */}
        <View style={[styles.arabicCard, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <View style={[styles.bismillahRow, { borderBottomColor: C.border }]}>
            <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Arapça Metin</Text>
          </View>
          <Text style={[styles.arabicText, { color: C.primary }]}>
            {sura.arabicText}
          </Text>
        </View>

        {/* Turkish Meaning */}
        <View style={[styles.meaningCard, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Türkçe Meali</Text>
          <Text style={[styles.meaningText, { color: C.text }]}>
            {sura.turkishMeaning}
          </Text>
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>Sure Bilgisi</Text>
          <View style={styles.infoRow}>
            <View style={[styles.infoItem, { backgroundColor: C.backgroundAlt }]}>
              <Text style={[styles.infoNum, { color: C.primary }]}>{sura.id}</Text>
              <Text style={[styles.infoItemLabel, { color: C.textSecondary }]}>Sure No</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: C.backgroundAlt }]}>
              <Text style={[styles.infoNum, { color: C.primary }]}>{sura.verses}</Text>
              <Text style={[styles.infoItemLabel, { color: C.textSecondary }]}>Ayet Sayısı</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: C.backgroundAlt }]}>
              <Text style={[styles.infoLabel2, { color: C.primary }]}>{sura.meaning}</Text>
              <Text style={[styles.infoItemLabel, { color: C.textSecondary }]}>Anlamı</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : SPACING.lg,
    paddingBottom: SPACING.lg, paddingHorizontal: SPACING.lg,
  },
  backBtn: { marginRight: SPACING.md, padding: SPACING.xs },
  headerContent: { flex: 1, alignItems: 'center' },
  headerArabic: { fontSize: FONT_SIZES.xxl, color: '#fff', fontWeight: '400' },
  headerTitle: { fontSize: FONT_SIZES.lg, color: '#fff', fontWeight: '700', marginTop: 4 },
  headerMeta: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  content: { padding: SPACING.lg },
  virtueCard: { borderRadius: RADIUS.md, padding: SPACING.md, borderWidth: 1, flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.md },
  virtueIcon: { fontSize: 16 },
  virtueText: { flex: 1, fontSize: FONT_SIZES.sm, lineHeight: 20, fontStyle: 'italic' },
  arabicCard: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.md },
  bismillahRow: { padding: SPACING.md, borderBottomWidth: 1 },
  sectionLabel: { fontSize: FONT_SIZES.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  arabicText: { fontSize: FONT_SIZES.xl, lineHeight: 44, textAlign: 'right', padding: SPACING.lg },
  meaningCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md },
  meaningText: { fontSize: FONT_SIZES.md, lineHeight: 26, marginTop: SPACING.sm },
  infoCard: { borderRadius: RADIUS.lg, padding: SPACING.lg },
  infoRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  infoItem: { flex: 1, padding: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center' },
  infoNum: { fontSize: FONT_SIZES.xxl, fontWeight: '900' },
  infoLabel2: { fontSize: FONT_SIZES.sm, fontWeight: '700' },
  infoItemLabel: { fontSize: FONT_SIZES.xs, marginTop: 2 },
  infoLabel: { fontSize: FONT_SIZES.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
});
