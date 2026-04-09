// src/screens/AyetlerScreen.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Platform, Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';

interface SureItem {
  no: number;
  ad: string;
  arapca: string;
  ayet: number;
  tur: string;
  anlam: string;
}

interface Ayet {
  numara: number;
  arapca: string;
  okunus: string;
  turkce: string;
}

const SURELER: SureItem[] = [
  { no: 1, ad: 'Fatiha', arapca: 'الفاتحة', ayet: 7, tur: 'Mekkî', anlam: 'Açılış' },
  { no: 2, ad: 'Bakara', arapca: 'البقرة', ayet: 286, tur: 'Medenî', anlam: 'İnek' },
  { no: 3, ad: 'Al-i İmran', arapca: 'آل عمران', ayet: 200, tur: 'Medenî', anlam: 'İmran Ailesi' },
  { no: 4, ad: 'Nisa', arapca: 'النساء', ayet: 176, tur: 'Medenî', anlam: 'Kadınlar' },
  { no: 5, ad: 'Maide', arapca: 'المائدة', ayet: 120, tur: 'Medenî', anlam: 'Sofra' },
  { no: 6, ad: 'Enam', arapca: 'الأنعام', ayet: 165, tur: 'Mekkî', anlam: 'Hayvanlar' },
  { no: 7, ad: 'Araf', arapca: 'الأعراف', ayet: 206, tur: 'Mekkî', anlam: 'Yüksek Yerler' },
  { no: 8, ad: 'Enfal', arapca: 'الأنفال', ayet: 75, tur: 'Medenî', anlam: 'Ganimetler' },
  { no: 9, ad: 'Tevbe', arapca: 'التوبة', ayet: 129, tur: 'Medenî', anlam: 'Tövbe' },
  { no: 10, ad: 'Yunus', arapca: 'يونس', ayet: 109, tur: 'Mekkî', anlam: 'Yunus' },
  { no: 11, ad: 'Hud', arapca: 'هود', ayet: 123, tur: 'Mekkî', anlam: 'Hud' },
  { no: 12, ad: 'Yusuf', arapca: 'يوسف', ayet: 111, tur: 'Mekkî', anlam: 'Yusuf' },
  { no: 13, ad: 'Rad', arapca: 'الرعد', ayet: 43, tur: 'Medenî', anlam: 'Gök Gürültüsü' },
  { no: 14, ad: 'İbrahim', arapca: 'إبراهيم', ayet: 52, tur: 'Mekkî', anlam: 'İbrahim' },
  { no: 15, ad: 'Hicr', arapca: 'الحجر', ayet: 99, tur: 'Mekkî', anlam: 'Hicr Vadisi' },
  { no: 16, ad: 'Nahl', arapca: 'النحل', ayet: 128, tur: 'Mekkî', anlam: 'Arı' },
  { no: 17, ad: 'İsra', arapca: 'الإسراء', ayet: 111, tur: 'Mekkî', anlam: 'Gece Yolculuğu' },
  { no: 18, ad: 'Kehf', arapca: 'الكهف', ayet: 110, tur: 'Mekkî', anlam: 'Mağara' },
  { no: 19, ad: 'Meryem', arapca: 'مريم', ayet: 98, tur: 'Mekkî', anlam: 'Meryem' },
  { no: 20, ad: 'Taha', arapca: 'طه', ayet: 135, tur: 'Mekkî', anlam: 'Tâ-Hâ' },
  { no: 21, ad: 'Enbiya', arapca: 'الأنبياء', ayet: 112, tur: 'Mekkî', anlam: 'Peygamberler' },
  { no: 22, ad: 'Hac', arapca: 'الحج', ayet: 78, tur: 'Medenî', anlam: 'Hac' },
  { no: 23, ad: 'Müminun', arapca: 'المؤمنون', ayet: 118, tur: 'Mekkî', anlam: 'Müminler' },
  { no: 24, ad: 'Nur', arapca: 'النور', ayet: 64, tur: 'Medenî', anlam: 'Işık' },
  { no: 25, ad: 'Furkan', arapca: 'الفرقان', ayet: 77, tur: 'Mekkî', anlam: 'Hak-Batıl Ayırt Edici' },
  { no: 26, ad: 'Şuara', arapca: 'الشعراء', ayet: 227, tur: 'Mekkî', anlam: 'Şairler' },
  { no: 27, ad: 'Neml', arapca: 'النمل', ayet: 93, tur: 'Mekkî', anlam: 'Karıncalar' },
  { no: 28, ad: 'Kasas', arapca: 'القصص', ayet: 88, tur: 'Mekkî', anlam: 'Kıssalar' },
  { no: 29, ad: 'Ankebut', arapca: 'العنكبوت', ayet: 69, tur: 'Mekkî', anlam: 'Örümcek' },
  { no: 30, ad: 'Rum', arapca: 'الروم', ayet: 60, tur: 'Mekkî', anlam: 'Rumlar' },
  { no: 31, ad: 'Lokman', arapca: 'لقمان', ayet: 34, tur: 'Mekkî', anlam: 'Lokman' },
  { no: 32, ad: 'Secde', arapca: 'السجدة', ayet: 30, tur: 'Mekkî', anlam: 'Secde' },
  { no: 33, ad: 'Ahzab', arapca: 'الأحزاب', ayet: 73, tur: 'Medenî', anlam: 'Gruplar' },
  { no: 34, ad: 'Sebe', arapca: 'سبأ', ayet: 54, tur: 'Mekkî', anlam: 'Sebe' },
  { no: 35, ad: 'Fatır', arapca: 'فاطر', ayet: 45, tur: 'Mekkî', anlam: 'Yaratan' },
  { no: 36, ad: 'Yasin', arapca: 'يس', ayet: 83, tur: 'Mekkî', anlam: 'Yâ-Sîn' },
  { no: 37, ad: 'Saffat', arapca: 'الصافات', ayet: 182, tur: 'Mekkî', anlam: 'Saf Bağlayanlar' },
  { no: 38, ad: 'Sad', arapca: 'ص', ayet: 88, tur: 'Mekkî', anlam: 'Sâd' },
  { no: 39, ad: 'Zümer', arapca: 'الزمر', ayet: 75, tur: 'Mekkî', anlam: 'Gruplar' },
  { no: 40, ad: 'Mümin', arapca: 'غافر', ayet: 85, tur: 'Mekkî', anlam: 'Mümin' },
  { no: 41, ad: 'Fussilet', arapca: 'فصلت', ayet: 54, tur: 'Mekkî', anlam: 'Açıklanmış' },
  { no: 42, ad: 'Şura', arapca: 'الشورى', ayet: 53, tur: 'Mekkî', anlam: 'Danışma' },
  { no: 43, ad: 'Zuhruf', arapca: 'الزخرف', ayet: 89, tur: 'Mekkî', anlam: 'Altın Süsler' },
  { no: 44, ad: 'Duhan', arapca: 'الدخان', ayet: 59, tur: 'Mekkî', anlam: 'Duman' },
  { no: 45, ad: 'Casiye', arapca: 'الجاثية', ayet: 37, tur: 'Mekkî', anlam: 'Diz Çöken' },
  { no: 46, ad: 'Ahkaf', arapca: 'الأحقاف', ayet: 35, tur: 'Mekkî', anlam: 'Kum Tepeleri' },
  { no: 47, ad: 'Muhammed', arapca: 'محمد', ayet: 38, tur: 'Medenî', anlam: 'Muhammed' },
  { no: 48, ad: 'Fetih', arapca: 'الفتح', ayet: 29, tur: 'Medenî', anlam: 'Fetih' },
  { no: 49, ad: 'Hucurat', arapca: 'الحجرات', ayet: 18, tur: 'Medenî', anlam: 'Odalar' },
  { no: 50, ad: 'Kaf', arapca: 'ق', ayet: 45, tur: 'Mekkî', anlam: 'Kâf' },
  { no: 51, ad: 'Zariyat', arapca: 'الذاريات', ayet: 60, tur: 'Mekkî', anlam: 'Savuranlar' },
  { no: 52, ad: 'Tur', arapca: 'الطور', ayet: 49, tur: 'Mekkî', anlam: 'Tur Dağı' },
  { no: 53, ad: 'Necm', arapca: 'النجم', ayet: 62, tur: 'Mekkî', anlam: 'Yıldız' },
  { no: 54, ad: 'Kamer', arapca: 'القمر', ayet: 55, tur: 'Mekkî', anlam: 'Ay' },
  { no: 55, ad: 'Rahman', arapca: 'الرحمن', ayet: 78, tur: 'Medenî', anlam: 'Rahman' },
  { no: 56, ad: 'Vakia', arapca: 'الواقعة', ayet: 96, tur: 'Mekkî', anlam: 'Büyük Olay' },
  { no: 57, ad: 'Hadid', arapca: 'الحديد', ayet: 29, tur: 'Medenî', anlam: 'Demir' },
  { no: 58, ad: 'Mücadele', arapca: 'المجادلة', ayet: 22, tur: 'Medenî', anlam: 'Tartışan Kadın' },
  { no: 59, ad: 'Haşr', arapca: 'الحشر', ayet: 24, tur: 'Medenî', anlam: 'Sürgün' },
  { no: 60, ad: 'Mümtehine', arapca: 'الممتحنة', ayet: 13, tur: 'Medenî', anlam: 'Sınanan Kadın' },
  { no: 61, ad: 'Saf', arapca: 'الصف', ayet: 14, tur: 'Medenî', anlam: 'Saf' },
  { no: 62, ad: 'Cuma', arapca: 'الجمعة', ayet: 11, tur: 'Medenî', anlam: 'Cuma' },
  { no: 63, ad: 'Münafikun', arapca: 'المنافقون', ayet: 11, tur: 'Medenî', anlam: 'Münafıklar' },
  { no: 64, ad: 'Teğabün', arapca: 'التغابن', ayet: 18, tur: 'Medenî', anlam: 'Aldatma' },
  { no: 65, ad: 'Talak', arapca: 'الطلاق', ayet: 12, tur: 'Medenî', anlam: 'Boşanma' },
  { no: 66, ad: 'Tahrim', arapca: 'التحريم', ayet: 12, tur: 'Medenî', anlam: 'Yasaklama' },
  { no: 67, ad: 'Mülk', arapca: 'الملك', ayet: 30, tur: 'Mekkî', anlam: 'Hükümranlık' },
  { no: 68, ad: 'Kalem', arapca: 'القلم', ayet: 52, tur: 'Mekkî', anlam: 'Kalem' },
  { no: 69, ad: 'Hakka', arapca: 'الحاقة', ayet: 52, tur: 'Mekkî', anlam: 'Gerçekleşecek' },
  { no: 70, ad: 'Mearic', arapca: 'المعارج', ayet: 44, tur: 'Mekkî', anlam: 'Yükselen Yollar' },
  { no: 71, ad: 'Nuh', arapca: 'نوح', ayet: 28, tur: 'Mekkî', anlam: 'Nuh' },
  { no: 72, ad: 'Cin', arapca: 'الجن', ayet: 28, tur: 'Mekkî', anlam: 'Cinler' },
  { no: 73, ad: 'Müzzemmil', arapca: 'المزمل', ayet: 20, tur: 'Mekkî', anlam: 'Örtünen' },
  { no: 74, ad: 'Müddessir', arapca: 'المدثر', ayet: 56, tur: 'Mekkî', anlam: 'Bürünen' },
  { no: 75, ad: 'Kıyame', arapca: 'القيامة', ayet: 40, tur: 'Mekkî', anlam: 'Kıyamet' },
  { no: 76, ad: 'İnsan', arapca: 'الإنسان', ayet: 31, tur: 'Medenî', anlam: 'İnsan' },
  { no: 77, ad: 'Mürselat', arapca: 'المرسلات', ayet: 50, tur: 'Mekkî', anlam: 'Gönderilenler' },
  { no: 78, ad: 'Nebe', arapca: 'النبأ', ayet: 40, tur: 'Mekkî', anlam: 'Haber' },
  { no: 79, ad: 'Naziat', arapca: 'النازعات', ayet: 46, tur: 'Mekkî', anlam: 'Söküp Alanlar' },
  { no: 80, ad: 'Abese', arapca: 'عبس', ayet: 42, tur: 'Mekkî', anlam: 'Yüzünü Ekşitti' },
  { no: 81, ad: 'Tekvir', arapca: 'التكوير', ayet: 29, tur: 'Mekkî', anlam: 'Dürülme' },
  { no: 82, ad: 'İnfitar', arapca: 'الانفطار', ayet: 19, tur: 'Mekkî', anlam: 'Yarılma' },
  { no: 83, ad: 'Mutaffifin', arapca: 'المطففين', ayet: 36, tur: 'Mekkî', anlam: 'Hile Yapanlar' },
  { no: 84, ad: 'İnşikak', arapca: 'الانشقاق', ayet: 25, tur: 'Mekkî', anlam: 'Yarılma' },
  { no: 85, ad: 'Büruc', arapca: 'البروج', ayet: 22, tur: 'Mekkî', anlam: 'Burçlar' },
  { no: 86, ad: 'Tarık', arapca: 'الطارق', ayet: 17, tur: 'Mekkî', anlam: 'Gece Gelen' },
  { no: 87, ad: 'Ala', arapca: 'الأعلى', ayet: 19, tur: 'Mekkî', anlam: 'En Yüce' },
  { no: 88, ad: 'Gaşiye', arapca: 'الغاشية', ayet: 26, tur: 'Mekkî', anlam: 'Bürüyen' },
  { no: 89, ad: 'Fecr', arapca: 'الفجر', ayet: 30, tur: 'Mekkî', anlam: 'Şafak' },
  { no: 90, ad: 'Beled', arapca: 'البلد', ayet: 20, tur: 'Mekkî', anlam: 'Şehir' },
  { no: 91, ad: 'Şems', arapca: 'الشمس', ayet: 15, tur: 'Mekkî', anlam: 'Güneş' },
  { no: 92, ad: 'Leyl', arapca: 'الليل', ayet: 21, tur: 'Mekkî', anlam: 'Gece' },
  { no: 93, ad: 'Duha', arapca: 'الضحى', ayet: 11, tur: 'Mekkî', anlam: 'Kuşluk Vakti' },
  { no: 94, ad: 'İnşirah', arapca: 'الشرح', ayet: 8, tur: 'Mekkî', anlam: 'Açılma' },
  { no: 95, ad: 'Tin', arapca: 'التين', ayet: 8, tur: 'Mekkî', anlam: 'İncir' },
  { no: 96, ad: 'Alak', arapca: 'العلق', ayet: 19, tur: 'Mekkî', anlam: 'Kan Pıhtısı' },
  { no: 97, ad: 'Kadir', arapca: 'القدر', ayet: 5, tur: 'Mekkî', anlam: 'Kadir Gecesi' },
  { no: 98, ad: 'Beyyine', arapca: 'البينة', ayet: 8, tur: 'Medenî', anlam: 'Açık Delil' },
  { no: 99, ad: 'Zilzal', arapca: 'الزلزلة', ayet: 8, tur: 'Medenî', anlam: 'Deprem' },
  { no: 100, ad: 'Adiyat', arapca: 'العاديات', ayet: 11, tur: 'Mekkî', anlam: 'Koşanlar' },
  { no: 101, ad: 'Karia', arapca: 'القارعة', ayet: 11, tur: 'Mekkî', anlam: 'Çarpan Felaket' },
  { no: 102, ad: 'Tekasür', arapca: 'التكاثر', ayet: 8, tur: 'Mekkî', anlam: 'Çoğalma Yarışı' },
  { no: 103, ad: 'Asr', arapca: 'العصر', ayet: 3, tur: 'Mekkî', anlam: 'Asır' },
  { no: 104, ad: 'Hümeze', arapca: 'الهمزة', ayet: 9, tur: 'Mekkî', anlam: 'İftira Eden' },
  { no: 105, ad: 'Fil', arapca: 'الفيل', ayet: 5, tur: 'Mekkî', anlam: 'Fil' },
  { no: 106, ad: 'Kureyş', arapca: 'قريش', ayet: 4, tur: 'Mekkî', anlam: 'Kureyş' },
  { no: 107, ad: 'Maun', arapca: 'الماعون', ayet: 7, tur: 'Mekkî', anlam: 'Yardım' },
  { no: 108, ad: 'Kevser', arapca: 'الكوثر', ayet: 3, tur: 'Mekkî', anlam: 'Kevser' },
  { no: 109, ad: 'Kafirun', arapca: 'الكافرون', ayet: 6, tur: 'Mekkî', anlam: 'Kafirler' },
  { no: 110, ad: 'Nasr', arapca: 'النصر', ayet: 3, tur: 'Medenî', anlam: 'Yardım' },
  { no: 111, ad: 'Tebbet', arapca: 'المسد', ayet: 5, tur: 'Mekkî', anlam: 'Helak Olsun' },
  { no: 112, ad: 'İhlas', arapca: 'الإخلاص', ayet: 4, tur: 'Mekkî', anlam: 'Samimiyet' },
  { no: 113, ad: 'Felak', arapca: 'الفلق', ayet: 5, tur: 'Mekkî', anlam: 'Sabahın Aydınlığı' },
  { no: 114, ad: 'Nas', arapca: 'الناس', ayet: 6, tur: 'Mekkî', anlam: 'İnsanlar' },
];

export const AyetlerScreen = () => {
  const { isDarkMode } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [search, setSearch] = useState('');
  const [selectedSure, setSelectedSure] = useState<SureItem | null>(null);
  const [ayetler, setAyetler] = useState<Ayet[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredSureler = SURELER.filter((s) =>
    s.ad.toLowerCase().includes(search.toLowerCase()) ||
    s.anlam.toLowerCase().includes(search.toLowerCase()) ||
    String(s.no).includes(search)
  );

  const loadSure = useCallback(async (sure: SureItem) => {
    setSelectedSure(sure);
    setAyetler([]);
    setErrorMsg('');
    setLoading(true);

    const cacheKey = `@sure_cache_v4_${sure.no}`;
    try {
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        setAyetler(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch (_) {}

    try {
      // quran.com API — Türkçe meal (id:77 Diyanet) + kelime okunuşları
      const res = await fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${sure.no}?translations=77&fields=text_uthmani&word_fields=transliteration&per_page=300`
      );
      const data = await res.json();

      if (data.verses && Array.isArray(data.verses)) {
        const combined: Ayet[] = data.verses.map((v: any) => {
          // Kelime kelime okunuşları birleştir (son "end" kelimesini atla)
          const okunus = v.words
            ? v.words
                .filter((w: any) => w.char_type_name !== 'end')
                .map((w: any) => (w.transliteration && w.transliteration.text) || '')
                .join(' ')
                .trim()
            : '';

          return {
            numara: v.verse_number,
            arapca: v.text_uthmani || '',
            okunus: okunus,
            turkce: v.translations && v.translations[0]
              ? v.translations[0].text
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&#39;/g, "'")
                  .replace(/<[^>]*>/g, '')
              : '',
          };
        });

        setAyetler(combined);
        try {
          await AsyncStorage.setItem(cacheKey, JSON.stringify(combined));
        } catch (_) {}
      } else {
        setErrorMsg('Sure yüklenemedi. Lütfen tekrar deneyin.');
      }
    } catch (_) {
      setErrorMsg('İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.');
    }

    setLoading(false);
  }, []);

  const renderSureItem = ({ item }: { item: SureItem }) => (
    <TouchableOpacity
      style={[styles.sureCard, { backgroundColor: C.card, ...SHADOWS.sm }]}
      onPress={() => loadSure(item)}
    >
      <View style={[styles.sureNo, { backgroundColor: C.primary + '15' }]}>
        <Text style={[styles.sureNoText, { color: C.primary }]}>{item.no}</Text>
      </View>
      <View style={styles.sureInfo}>
        <Text style={[styles.sureAd, { color: C.text }]}>{item.ad} Suresi</Text>
        <Text style={[styles.sureMeta, { color: C.textMuted }]}>
          {item.ayet} ayet · {item.tur} · {item.anlam}
        </Text>
      </View>
      <Text style={[styles.sureArapca, { color: C.primary }]}>{item.arapca}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>📖 Kur'an-ı Kerim</Text>
        <Text style={styles.headerSub}>114 Sure · 6236 Ayet · Diyanet Meali</Text>
      </View>

      {/* Arama */}
      <View style={[styles.searchBar, { backgroundColor: C.card, borderBottomColor: C.border }]}>
        <Ionicons name="search" size={18} color={C.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder="Sure adı, anlam veya numara ara..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Sure Listesi */}
      <FlatList
        data={filteredSureler}
        keyExtractor={(item) => String(item.no)}
        renderItem={renderSureItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>📖</Text>
            <Text style={[styles.emptyText, { color: C.textSecondary }]}>Sure bulunamadı</Text>
          </View>
        )}
      />

      {/* Sure Detay Modal */}
      <Modal
        visible={selectedSure !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedSure(null)}
      >
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          {selectedSure && (
            <>
              {/* Modal Header */}
              <View style={[styles.modalHeader, { backgroundColor: C.primary }]}>
                <TouchableOpacity onPress={() => setSelectedSure(null)} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>{selectedSure.ad} Suresi</Text>
                  <Text style={styles.modalSub}>
                    {selectedSure.ayet} ayet · {selectedSure.tur} · {selectedSure.anlam}
                  </Text>
                </View>
                <Text style={styles.modalArapca}>{selectedSure.arapca}</Text>
              </View>

              {/* Besmele */}
              {selectedSure.no !== 9 && selectedSure.no !== 1 && (
                <View style={[styles.besmele, { backgroundColor: C.primary + '10' }]}>
                  <Text style={[styles.besmeleText, { color: C.primary }]}>
                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                  </Text>
                </View>
              )}

              {/* Yükleniyor */}
              {loading && (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color={C.primary} />
                  <Text style={[styles.loadingText, { color: C.textSecondary }]}>
                    {selectedSure.ad} Suresi yükleniyor...
                  </Text>
                  <Text style={[styles.loadingHint, { color: C.textMuted }]}>
                    İlk açılışta internet gereklidir.{'\n'}Sonraki açılışlarda offline çalışır.
                  </Text>
                </View>
              )}

              {/* Hata */}
              {!loading && errorMsg !== '' && (
                <View style={styles.errorBox}>
                  <Ionicons name="wifi-outline" size={56} color={C.textMuted} />
                  <Text style={[styles.errorText, { color: C.text }]}>{errorMsg}</Text>
                  <TouchableOpacity
                    style={[styles.retryBtn, { backgroundColor: C.primary }]}
                    onPress={() => loadSure(selectedSure)}
                  >
                    <Text style={styles.retryText}>Tekrar Dene</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Ayetler */}
              {!loading && ayetler.length > 0 && (
                <FlatList
                  data={ayetler}
                  keyExtractor={(item) => String(item.numara)}
                  contentContainerStyle={styles.ayetList}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <View style={[styles.ayetCard, { backgroundColor: C.card, borderLeftColor: C.primary }]}>
                      <View style={[styles.ayetNoBox, { backgroundColor: C.primary }]}>
                        <Text style={styles.ayetNo}>{item.numara}</Text>
                      </View>
                      <View style={styles.ayetContent}>
                        <Text style={[styles.ayetArapca, { color: C.primary }]}>
                          {item.arapca}
                        </Text>
                        <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
                        <Text style={[styles.ayetOkunus, { color: C.textSecondary }]}>
                          {item.okunus}
                        </Text>
                        <View style={[styles.divider, { backgroundColor: C.borderLight }]} />
                        <Text style={[styles.ayetTurkce, { color: C.text }]}>
                          {item.turkce}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: SPACING.xl,
    paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
    alignItems: 'center',
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md, paddingVertical: 6 },
  list: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: 100 },
  sureCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: RADIUS.lg, padding: SPACING.md, gap: SPACING.md,
  },
  sureNo: {
    width: 44, height: 44, borderRadius: RADIUS.md,
    alignItems: 'center', justifyContent: 'center',
  },
  sureNoText: { fontSize: FONT_SIZES.md, fontWeight: '800' },
  sureInfo: { flex: 1 },
  sureAd: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  sureMeta: { fontSize: FONT_SIZES.xs, marginTop: 2 },
  sureArapca: { fontSize: FONT_SIZES.xl },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: SPACING.md },
  emptyText: { fontSize: FONT_SIZES.lg },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 56 : SPACING.lg,
  },
  backBtn: { padding: SPACING.xs },
  modalHeaderText: { flex: 1 },
  modalTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: '#fff' },
  modalSub: { fontSize: FONT_SIZES.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  modalArapca: { fontSize: FONT_SIZES.xxl, color: 'rgba(255,255,255,0.9)' },
  besmele: {
    padding: SPACING.lg, alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  besmeleText: { fontSize: FONT_SIZES.xl, lineHeight: 40 },
  loadingBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: SPACING.md, padding: SPACING.xxl,
  },
  loadingText: { fontSize: FONT_SIZES.lg, fontWeight: '600', textAlign: 'center' },
  loadingHint: { fontSize: FONT_SIZES.sm, textAlign: 'center', lineHeight: 20 },
  errorBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: SPACING.lg, padding: SPACING.xxl,
  },
  errorText: { fontSize: FONT_SIZES.md, textAlign: 'center', lineHeight: 22 },
  retryBtn: {
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZES.md },
  ayetList: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 60 },
  ayetCard: {
    borderRadius: RADIUS.lg, overflow: 'hidden',
    borderLeftWidth: 4, flexDirection: 'row',
  },
  ayetNoBox: {
    width: 36, alignItems: 'center',
    justifyContent: 'flex-start', paddingTop: SPACING.md,
  },
  ayetNo: { color: '#fff', fontSize: FONT_SIZES.xs, fontWeight: '800' },
  ayetContent: { flex: 1, padding: SPACING.md },
  ayetArapca: { fontSize: FONT_SIZES.xl, lineHeight: 40, textAlign: 'right' },
  divider: { height: 1, marginVertical: SPACING.sm },
  ayetOkunus: { fontSize: FONT_SIZES.sm, lineHeight: 20, fontStyle: 'italic' },
  ayetTurkce: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
});