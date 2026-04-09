// src/screens/DuaScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Modal, Platform, TextInput, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';
import { ALL_DUAS, DUA_CATEGORIES, Dua } from '../data/duas';
import { InterstitialAd } from '../components/AdBanner';

export const DuaScreen = () => {
  const { isDarkMode, favoriteDuas, toggleFavoriteDua } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDua, setSelectedDua] = useState<Dua | null>(null);
  const [search, setSearch] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [pendingDua, setPendingDua] = useState<Dua | null>(null);
  const openCount = useRef(0);
  const categoryListRef = useRef<FlatList>(null);

  const filteredDuas = ALL_DUAS.filter((d) => {
    if (showFavorites && !favoriteDuas.includes(d.id)) return false;
    if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
    if (search && !d.title.toLowerCase().includes(search.toLowerCase()) &&
        !d.turkishMeaning.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleOpenDua = (dua: Dua) => {
    openCount.current += 1;
    if (openCount.current % 4 === 0) {
      setPendingDua(dua);
      setShowAd(true);
    } else {
      setSelectedDua(dua);
    }
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (pendingDua) {
      setSelectedDua(pendingDua);
      setPendingDua(null);
    }
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setSearch('');
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <InterstitialAd visible={showAd} onClose={handleAdClose} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <View>
          <Text style={styles.headerTitle}>🤲 Dua Kütüphanesi</Text>
          <Text style={styles.headerCount}>{ALL_DUAS.length} dua · {filteredDuas.length} gösteriliyor</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFavorites(!showFavorites)}
          style={[styles.favBtn, showFavorites && { backgroundColor: '#E74C3C' }]}
        >
          <Ionicons name={showFavorites ? 'heart' : 'heart-outline'} size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* KATEGORİLER — Aramanın ÜSTÜNDE */}
      <View style={[styles.categoriesWrapper, { backgroundColor: C.card, borderBottomColor: C.border }]}>
        <FlatList
          ref={categoryListRef}
          horizontal
          data={DUA_CATEGORIES}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item.id;
            const count = item.id === 'all'
              ? ALL_DUAS.length
              : ALL_DUAS.filter((d) => d.category === item.id).length;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? C.primary : C.backgroundAlt,
                    borderColor: isSelected ? C.primary : C.border,
                  },
                ]}
                onPress={() => handleCategorySelect(item.id)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={14}
                  color={isSelected ? '#fff' : C.textSecondary}
                />
                <Text style={[styles.categoryLabel, { color: isSelected ? '#fff' : C.textSecondary }]}>
                  {item.label}
                </Text>
                <View style={[
                  styles.countBadge,
                  { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : C.primary + '20' },
                ]}>
                  <Text style={[styles.countText, { color: isSelected ? '#fff' : C.primary }]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* ARAMA — Kategorilerin ALTINDA */}
      <View style={[styles.searchContainer, { backgroundColor: C.backgroundAlt, borderBottomColor: C.border }]}>
        <Ionicons name="search" size={16} color={C.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder={`${selectedCategory === 'all' ? 'Tüm dualar' : DUA_CATEGORIES.find(c => c.id === selectedCategory)?.label || ''} içinde ara...`}
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Dua Listesi */}
      <FlatList
        data={filteredDuas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isFav = favoriteDuas.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.duaCard, { backgroundColor: C.card, ...SHADOWS.sm }]}
              onPress={() => handleOpenDua(item)}
            >
              <View style={styles.duaCardHeader}>
                <Text style={[styles.duaTitle, { color: C.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => toggleFavoriteDua(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFav ? 'heart' : 'heart-outline'}
                    size={18}
                    color={isFav ? '#E74C3C' : C.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <Text style={[styles.duaArabic, { color: C.primary }]} numberOfLines={1}>
                {item.arabic}
              </Text>
              <Text style={[styles.duaMeaning, { color: C.textSecondary }]} numberOfLines={2}>
                {item.turkishMeaning}
              </Text>
              {item.source && (
                <Text style={[styles.duaSource, { color: C.textMuted }]}>📚 {item.source}</Text>
              )}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.duasList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤲</Text>
            <Text style={[styles.emptyTitle, { color: C.text }]}>
              {showFavorites ? 'Favori dua yok' : 'Dua bulunamadı'}
            </Text>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>
              {showFavorites
                ? 'Beğendiğiniz duaları favorilere ekleyin'
                : 'Farklı bir kategori veya arama deneyin'}
            </Text>
          </View>
        )}
      />

      {/* Dua Detay Modal */}
      <Modal visible={!!selectedDua} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: C.card }]}>
            {selectedDua && (
              <>
                <View style={styles.modalHandle} />
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalTitle, { color: C.text }]}>{selectedDua.title}</Text>
                  <TouchableOpacity onPress={() => setSelectedDua(null)}>
                    <Ionicons name="close" size={24} color={C.textSecondary} />
                  </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={[styles.arabicBox, { backgroundColor: C.primary + '10' }]}>
                    <Text style={[styles.arabicFull, { color: C.primary }]}>
                      {selectedDua.arabic}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionLabel, { color: C.textMuted }]}>Okunuşu</Text>
                    <Text style={[styles.modalSectionText, { color: C.textSecondary }]}>
                      {selectedDua.transliteration}
                    </Text>
                  </View>
                  <View style={styles.modalSection}>
                    <Text style={[styles.modalSectionLabel, { color: C.textMuted }]}>Türkçe Anlamı</Text>
                    <Text style={[styles.modalSectionText, { color: C.text }]}>
                      {selectedDua.turkishMeaning}
                    </Text>
                  </View>
                  {selectedDua.source && (
                    <View style={[styles.sourceBox, { backgroundColor: C.backgroundAlt, borderColor: C.border }]}>
                      <Ionicons name="book-outline" size={16} color={C.primary} />
                      <Text style={[styles.sourceText, { color: C.textSecondary }]}>
                        Kaynak: {selectedDua.source}
                      </Text>
                    </View>
                  )}
                  <View style={{ height: 20 }} />
                </ScrollView>
                <TouchableOpacity
                  style={[styles.favoriteBtn, {
                    backgroundColor: favoriteDuas.includes(selectedDua.id) ? '#E74C3C' : C.primary,
                  }]}
                  onPress={() => toggleFavoriteDua(selectedDua.id)}
                >
                  <Ionicons
                    name={favoriteDuas.includes(selectedDua.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.favoriteBtnText}>
                    {favoriteDuas.includes(selectedDua.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  headerCount: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  favBtn: { padding: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.2)' },

  // KATEGORİLER
  categoriesWrapper: {
    borderBottomWidth: 1,
    paddingVertical: SPACING.sm,
  },
  categoriesList: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  categoryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 1.5,
  },
  categoryLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600' },
  countBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: RADIUS.full, minWidth: 22, alignItems: 'center',
  },
  countText: { fontSize: 10, fontWeight: '800' },

  // ARAMA
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderBottomWidth: 1, gap: SPACING.sm,
  },
  searchInput: { flex: 1, fontSize: FONT_SIZES.sm, paddingVertical: 6 },

  // LİSTE
  duasList: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: 100 },
  duaCard: { borderRadius: RADIUS.lg, padding: SPACING.md, gap: 6 },
  duaCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  duaTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', flex: 1 },
  duaArabic: { fontSize: FONT_SIZES.md, lineHeight: 26, textAlign: 'right' },
  duaMeaning: { fontSize: FONT_SIZES.sm, lineHeight: 18, color: '#666' },
  duaSource: { fontSize: 11 },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.md },
  emptyTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginBottom: SPACING.sm },
  emptyText: { fontSize: FONT_SIZES.md, textAlign: 'center' },

  // MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl,
    maxHeight: '85%', padding: SPACING.lg, paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#ccc', alignSelf: 'center', marginBottom: SPACING.md },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', flex: 1, marginRight: SPACING.sm },
  arabicBox: { padding: SPACING.lg, borderRadius: RADIUS.lg, marginBottom: SPACING.lg },
  arabicFull: { fontSize: FONT_SIZES.xxl, lineHeight: 44, textAlign: 'right' },
  modalSection: { marginBottom: SPACING.lg },
  modalSectionLabel: { fontSize: FONT_SIZES.xs, fontWeight: '700', marginBottom: SPACING.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  modalSectionText: { fontSize: FONT_SIZES.md, lineHeight: 24 },
  sourceBox: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, marginBottom: SPACING.lg },
  sourceText: { fontSize: FONT_SIZES.sm },
  favoriteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: RADIUS.lg },
  favoriteBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZES.md },
});