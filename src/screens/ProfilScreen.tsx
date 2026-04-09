// src/screens/ProfilScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Platform, Alert, Modal, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';

const EMAILJS_SERVICE_ID = 'service_4p3g5jh';
const EMAILJS_TEMPLATE_ID = 'template_u8wa698';
const EMAILJS_PUBLIC_KEY = 'UgOrmNVeXFR3IKqAY';

export const ProfilScreen = ({ navigation }: any) => {
  const { isDarkMode, toggleDarkMode, streakCount, notificationsEnabled, setNotificationsEnabled, prayerRecords, dhikrRecords } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [showFeedback, setShowFeedback] = useState(false);
  const [isimField, setIsimField] = useState('');
  const [mesajField, setMesajField] = useState('');
  const [sending, setSending] = useState(false);

  const totalPrayers = prayerRecords.reduce((sum, r) =>
    sum + [r.fajr, r.sunrise, r.dhuhr, r.asr, r.maghrib, r.isha].filter(Boolean).length, 0);
  const totalDhikr = dhikrRecords.reduce((sum, r) => sum + r.count, 0);

  const sendFeedback = async () => {
    if (!mesajField.trim()) {
      Alert.alert('Uyarı', 'Lütfen mesajınızı yazın.');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: {
            name: isimField.trim() || 'Anonim Kullanıcı',
            message: mesajField.trim(),
            time: new Date().toLocaleString('tr-TR'),
          },
        }),
      });

      if (res.status === 200) {
        Alert.alert('Teşekkürler! 🤲', 'Geri bildiriminiz başarıyla gönderildi.');
        setIsimField('');
        setMesajField('');
        setShowFeedback(false);
      } else {
        Alert.alert('Hata', 'Mesaj gönderilemedi. Lütfen tekrar deneyin.');
      }
    } catch {
      Alert.alert('Hata', 'İnternet bağlantınızı kontrol edin.');
    }
    setSending(false);
  };

  const SettingRow = ({ icon, label, sublabel, onPress, rightComponent, last = false }: any) => (
    <TouchableOpacity
      style={[styles.settingRow, !last && { borderBottomColor: C.borderLight, borderBottomWidth: 1 }]}
      onPress={onPress}
      disabled={!onPress && !rightComponent}
    >
      <View style={[styles.settingIcon, { backgroundColor: C.primary + '15' }]}>
        <Ionicons name={icon} size={18} color={C.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: C.text }]}>{label}</Text>
        {sublabel && <Text style={[styles.settingSublabel, { color: C.textMuted }]}>{sublabel}</Text>}
      </View>
      {rightComponent || (onPress && <Ionicons name="chevron-forward" size={18} color={C.textMuted} />)}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>⚙️ Profil & Ayarlar</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* İstatistikler */}
        <View style={[styles.statsBanner, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={[styles.statNum, { color: C.text }]}>{streakCount}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>Gün Serisi</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: C.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>🕌</Text>
            <Text style={[styles.statNum, { color: C.text }]}>{totalPrayers}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>Toplam Namaz</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: C.border }]} />
          <View style={styles.statItem}>
            <Text style={styles.statEmoji}>📿</Text>
            <Text style={[styles.statNum, { color: C.text }]}>{totalDhikr}</Text>
            <Text style={[styles.statLabel, { color: C.textSecondary }]}>Toplam Zikir</Text>
          </View>
        </View>

        {/* Görünüm */}
        <View style={[styles.settingsSection, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>GÖRÜNÜM</Text>
          <SettingRow
            icon="moon" label="Gece Modu"
            sublabel={isDarkMode ? 'Açık' : 'Kapalı'}
            rightComponent={
              <Switch value={isDarkMode} onValueChange={toggleDarkMode}
                trackColor={{ false: '#ccc', true: C.primary }} thumbColor="#fff" />
            }
            last
          />
        </View>

        {/* Bildirimler */}
        <View style={[styles.settingsSection, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>BİLDİRİMLER</Text>
          <SettingRow
            icon="notifications" label="Namaz Vakti Bildirimleri"
            sublabel={notificationsEnabled ? 'Açık' : 'Kapalı'}
            rightComponent={
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#ccc', true: C.primary }} thumbColor="#fff" />
            }
          />
          <SettingRow icon="book" label="Günlük Sure Bildirimi"
            sublabel="Her gün farklı sure" onPress={() => {}} last />
        </View>

        {/* Uygulama */}
        <View style={[styles.settingsSection, { backgroundColor: C.card, ...SHADOWS.sm }]}>
          <Text style={[styles.sectionTitle, { color: C.textMuted }]}>UYGULAMA</Text>
          <SettingRow icon="star" label="Uygulamayı Değerlendir"
            sublabel="Bizi destekleyin ⭐"
            onPress={() => Alert.alert('Teşekkürler!', 'Değerlendirme için yönlendiriliyorsunuz.')} />
          <SettingRow icon="share-social" label="Arkadaşlarınla Paylaş"
            onPress={() => Alert.alert('Paylaş', 'İslami Asistan uygulamasını paylaşın!')} />
          <SettingRow icon="mail" label="Geri Bildirim Gönder"
            sublabel="Görüşlerinizi bize iletın"
            onPress={() => setShowFeedback(true)} />
          <SettingRow icon="shield-checkmark" label="Gizlilik Politikası"
            onPress={() => navigation.navigate('Gizlilik')} />
          <SettingRow icon="document-text" label="Kullanım Şartları"
            onPress={() => navigation.navigate('KullanimSartlari')} last />
        </View>

        {/* Versiyon */}
        <View style={styles.versionContainer}>
          <Text style={styles.appLogo}>🌙</Text>
          <Text style={[styles.appName, { color: C.textMuted }]}>İslami Asistan</Text>
          <Text style={[styles.version, { color: C.textMuted }]}>Sürüm 1.0.0</Text>
          <Text style={[styles.copyright, { color: C.textMuted }]}>Made with 🤍 for Muslims</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Geri Bildirim Modal */}
      <Modal visible={showFeedback} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { backgroundColor: C.primary }]}>
            <TouchableOpacity onPress={() => setShowFeedback(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>💬 Geri Bildirim</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.modalDesc, { color: C.textSecondary }]}>
              Görüş ve önerilerinizi bizimle paylaşın. Her geri bildirim uygulamayı daha iyi yapmamıza yardımcı olur. 🤲
            </Text>

            {/* İsim */}
            <Text style={[styles.inputLabel, { color: C.text }]}>İsminiz (isteğe bağlı)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: C.card, borderColor: C.border }]}>
              <Ionicons name="person-outline" size={18} color={C.textMuted} />
              <TextInput
                style={[styles.input, { color: C.text }]}
                placeholder="Adınız..."
                placeholderTextColor={C.textMuted}
                value={isimField}
                onChangeText={setIsimField}
              />
            </View>

            {/* Mesaj */}
            <Text style={[styles.inputLabel, { color: C.text }]}>Mesajınız *</Text>
            <View style={[styles.inputWrapper, styles.textAreaWrapper, { backgroundColor: C.card, borderColor: C.border }]}>
              <TextInput
                style={[styles.input, styles.textArea, { color: C.text }]}
                placeholder="Görüş, öneri veya hata bildirimi..."
                placeholderTextColor={C.textMuted}
                value={mesajField}
                onChangeText={setMesajField}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Gönder Butonu */}
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: C.primary, opacity: sending ? 0.7 : 1 }]}
              onPress={sendFeedback}
              disabled={sending}
            >
              <Ionicons name={sending ? 'hourglass-outline' : 'send'} size={20} color="#fff" />
              <Text style={styles.sendBtnText}>
                {sending ? 'Gönderiliyor...' : 'Gönder'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.privacyNote, { color: C.textMuted }]}>
              🔒 Mesajınız gizli tutulur, üçüncü taraflarla paylaşılmaz.
            </Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  statsBanner: { margin: SPACING.lg, borderRadius: RADIUS.lg, padding: SPACING.lg, flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', gap: 2 },
  statEmoji: { fontSize: 20 },
  statNum: { fontSize: FONT_SIZES.xl, fontWeight: '900' },
  statLabel: { fontSize: FONT_SIZES.xs, textAlign: 'center' },
  statDivider: { width: 1, height: '80%', alignSelf: 'center' },
  settingsSection: { margin: SPACING.lg, marginTop: 0, borderRadius: RADIUS.lg, overflow: 'hidden' },
  sectionTitle: { fontSize: FONT_SIZES.xs, fontWeight: '700', letterSpacing: 1, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, gap: SPACING.md },
  settingIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: FONT_SIZES.md, fontWeight: '500' },
  settingSublabel: { fontSize: FONT_SIZES.xs, marginTop: 2 },
  versionContainer: { alignItems: 'center', paddingVertical: SPACING.xl },
  appLogo: { fontSize: 32, marginBottom: SPACING.sm },
  appName: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  version: { fontSize: FONT_SIZES.sm, marginTop: 2 },
  copyright: { fontSize: FONT_SIZES.xs, marginTop: SPACING.xs },
  // Modal
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 56 : SPACING.lg,
  },
  modalTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: '#fff' },
  modalContent: { padding: SPACING.lg, gap: SPACING.md },
  modalDesc: { fontSize: FONT_SIZES.md, lineHeight: 22, marginBottom: SPACING.sm },
  inputLabel: { fontSize: FONT_SIZES.sm, fontWeight: '600', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    borderWidth: 1, borderRadius: RADIUS.lg, paddingHorizontal: SPACING.md,
  },
  textAreaWrapper: { alignItems: 'flex-start', paddingVertical: SPACING.sm },
  input: { flex: 1, fontSize: FONT_SIZES.md, paddingVertical: SPACING.sm },
  textArea: { minHeight: 120 },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: SPACING.sm, padding: SPACING.lg, borderRadius: RADIUS.lg, marginTop: SPACING.sm,
  },
  sendBtnText: { color: '#fff', fontSize: FONT_SIZES.lg, fontWeight: '700' },
  privacyNote: { fontSize: FONT_SIZES.xs, textAlign: 'center', marginTop: SPACING.sm },
});