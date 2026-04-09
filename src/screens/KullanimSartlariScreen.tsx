// src/screens/KullanimSartlariScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

export const KullanimSartlariScreen = ({ navigation }: any) => {
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
        <Text style={styles.headerTitle}>Kullanım Şartları</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: C.primary + '15', borderColor: C.primary + '30' }]}>
          <Text style={[styles.introText, { color: C.primaryMed }]}>
            Son güncelleme: Nisan 2025{'\n'}
            İslami Asistan uygulamasını kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız.
          </Text>
        </View>

        <Section
          title="1. Hizmet Tanımı"
          content="İslami Asistan, Müslümanların günlük ibadet hayatını kolaylaştırmak amacıyla tasarlanmış bir mobil uygulamadır. Uygulama; namaz vakitleri, kıble bulucu, zikirmatik, dua kütüphanesi ve Kur'an-ı Kerim okuma gibi özellikler sunmaktadır."
        />

        <Section
          title="2. Kullanım Koşulları"
          content="Bu uygulamayı kullanırken şu kurallara uymayı kabul edersiniz:\n\n• Uygulamayı yalnızca yasal amaçlarla kullanmak\n• Uygulamanın içeriğini izinsiz kopyalamak veya dağıtmamak\n• Uygulamanın normal işleyişini bozmaya yönelik girişimlerde bulunmamak\n• Diğer kullanıcıların deneyimini olumsuz etkileyecek davranışlardan kaçınmak"
        />

        <Section
          title="3. Dini İçerik"
          content="Uygulamadaki dini içerikler (namaz vakitleri, dualar, Kur'an meali) güvenilir kaynaklardan derlenmektedir. Ancak:\n\n• Namaz vakitleri yaklaşık hesaplamaya dayanır, kesin referans için Diyanet İşleri Başkanlığı'nın resmi kaynaklarını kullanınız.\n• Dua ve ayet mealleri Diyanet İşleri Başkanlığı'nın yayımladığı metinlere dayanmaktadır.\n• Dini konularda kesin hüküm için yetkili din alimlerine başvurunuz."
        />

        <Section
          title="4. Fikri Mülkiyet"
          content="Uygulamada yer alan tüm içerikler, tasarımlar, kodlar ve materyaller telif hakkı ile korunmaktadır. Kur'an-ı Kerim metinleri ve mealleri kamusal alan kaynaklar veya açık lisanslı kaynaklardan alınmıştır. İzinsiz kullanım yasaktır."
        />

        <Section
          title="5. Sorumluluk Reddi"
          content="İslami Asistan uygulaması 'olduğu gibi' sunulmaktadır. Aşağıdaki konularda garanti verilmemektedir:\n\n• Namaz vakitlerinin mutlak doğruluğu\n• Kıble yönünün hassasiyeti (cihaz sensörüne bağlıdır)\n• Uygulamanın kesintisiz çalışması\n• İnternet bağlantısı gerektiren özelliklerin her zaman erişilebilir olması"
        />

        <Section
          title="6. Reklam"
          content="Uygulama, hizmetlerin sürdürülebilirliği için reklam içerebilir. Reklamlar Google AdMob tarafından sunulmaktadır. Rahatsız edici bir reklam ile karşılaşırsanız lütfen bize bildirin."
        />

        <Section
          title="7. Değişiklikler"
          content="Bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutarız. Güncel şartlar her zaman uygulama içinden erişilebilir olacaktır. Uygulamayı kullanmaya devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir."
        />

        <Section
          title="8. Fesih"
          content="Bu şartları ihlal etmeniz durumunda uygulamaya erişiminizi sınırlama veya sonlandırma hakkını saklı tutarız. Uygulamayı cihazınızdan silerek hizmeti dilediğiniz zaman sonlandırabilirsiniz."
        />

        <Section
          title="9. Uygulanacak Hukuk"
          content="Bu kullanım şartları Türkiye Cumhuriyeti kanunlarına tabidir. Herhangi bir anlaşmazlık durumunda Türkiye mahkemeleri yetkilidir."
        />

        <Section
          title="10. İletişim"
          content="Kullanım şartlarımız hakkında sorularınız için:\n\nE-posta: destek@islamiasistan.com\n\nHayırlı günler ve hayırlı ibadетler dileriz. 🤲"
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
  introCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, borderWidth: 1 },
  introText: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
  section: { borderRadius: RADIUS.lg, padding: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '700', marginBottom: SPACING.sm },
  sectionContent: { fontSize: FONT_SIZES.sm, lineHeight: 22 },
});