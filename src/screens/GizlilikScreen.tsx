// src/screens/GizlilikScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

export const GizlilikScreen = ({ navigation }: any) => {
  const { isDarkMode } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const Section = ({ title, content }: { title: string; content: string }) => (
    <View style={[styles.section, { backgroundColor: C.card }]}>
      <Text style={[styles.sectionTitle, { color: C.primary }]}>{title}</Text>
      <Text style={[styles.sectionContent, { color: C.text }]}>{content}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gizlilik Politikası</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: C.primary + '15', borderColor: C.primary + '30' }]}>
          <Text style={[styles.introText, { color: C.primaryMed }]}>
            Son güncelleme: Nisan 2025{'\n'}
            Bu politika, İslami Asistan uygulamasının kişisel verilerinizi nasıl işlediğini açıklamaktadır.
          </Text>
        </View>

        <Section
          title="1. Toplanan Bilgiler"
          content="İslami Asistan uygulaması aşağıdaki bilgileri toplar:\n\n• Konum Bilgisi: Namaz vakitlerini hesaplamak ve kıble yönünü belirlemek amacıyla yalnızca uygulama açıkken konum bilginize erişilir. Bu bilgi üçüncü taraflarla paylaşılmaz ve sunucularımızda saklanmaz.\n\n• Kullanım Verileri: İbadet takibi, zikir sayısı ve favori dualar gibi veriler yalnızca cihazınızda yerel olarak saklanır. Bu veriler buluta aktarılmaz."
        />

        <Section
          title="2. Bilgilerin Kullanımı"
          content="Topladığımız bilgiler yalnızca şu amaçlarla kullanılır:\n\n• Konumunuza özel namaz vakitlerini hesaplamak\n• Kıble yönünü doğru göstermek\n• Uygulama içi tercihlerinizi kaydetmek\n\nBu bilgiler hiçbir şekilde satılmaz, kiralanmaz veya üçüncü taraflarla paylaşılmaz."
        />

        <Section
          title="3. Reklam"
          content="Uygulamamız Google AdMob reklamlarını kullanmaktadır. AdMob, reklam göstermek amacıyla reklam kimliğinizi kullanabilir. AdMob'un gizlilik politikasına https://policies.google.com/privacy adresinden ulaşabilirsiniz.\n\nReklam kişiselleştirmesini cihaz ayarlarınızdan kapatabilirsiniz."
        />

        <Section
          title="4. Veri Güvenliği"
          content="Tüm kullanıcı verileri cihazınızda yerel olarak saklanır. Uygulamamızın kendi sunucularına herhangi bir kişisel veri aktarımı yapılmamaktadır. Cihazınızın güvenliği sizin sorumluluğunuzdadır."
        />

        <Section
          title="5. Çocukların Gizliliği"
          content="Uygulamamız 13 yaş altı çocuklar için özel olarak tasarlanmamıştır. 13 yaş altı çocuklardan bilerek kişisel veri toplamıyoruz. Eğer çocuğunuzun bize kişisel bilgi sağladığını fark ederseniz lütfen bizimle iletişime geçin."
        />

        <Section
          title="6. İzinler"
          content="Uygulama şu izinleri kullanır:\n\n• Konum İzni: Namaz vakitleri ve kıble için (zorunlu değil, elle şehir seçilebilir)\n• Bildirim İzni: Namaz vakti hatırlatmaları için\n• İnternet İzni: Namaz vakitleri ve Kur'an verilerini indirmek için"
        />

        <Section
          title="7. Değişiklikler"
          content="Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda uygulama içinden bildirim yapılacaktır. Politikayı düzenli olarak incelemenizi öneririz."
        />

        <Section
          title="8. İletişim"
          content="Gizlilik politikamız hakkında sorularınız için:\n\nE-posta: destek@islamiasistan.com\n\nSorularınızı en kısa sürede yanıtlamaya çalışacağız."
        />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, paddingTop: Platform.OS === 'ios' ? 56 : SPACING.lg,
  },
  backBtn: { padding: SPACING.xs },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: '700', color: '#fff' },
  content: { padding: SPACING.lg, gap: SPACING.md },
  introCard: {
    borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1,
  },
  introText: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
  section: { borderRadius: RADIUS.lg, padding: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', marginBottom: SPACING.sm },
  sectionContent: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
});