# 🌙 İslami Asistan — Kurulum & Test Rehberi

## 📋 Proje Özeti

Production-ready İslami mobil uygulama:
- **Namaz Vakitleri** (GPS + Aladhan API)
- **Kıble Bulucu** (Magnetometre sensörü)
- **Zikirmatik** (Titreşimli sayaç)
- **Dua Kütüphanesi** (20+ dua, Arapça/Türkçe)
- **İbadet Takibi** (Haftalık grafik)
- **Premium Paywall** (Abonelik sistemi)
- **Reklam Sistemi** (AdMob hazır)
- **Bildirimler** (Namaz vakti, günlük sure)

---

## 🚀 YÖNTEM 1: Expo Snack (Hiçbir Şey Kurmadan)

### Adımlar:
1. **https://snack.expo.dev** adresine gidin
2. Sol üstten **"Add file"** butonuna tıklayın
3. Bu projedeki TÜM `.tsx` ve `.ts` dosyalarını aynı klasör yapısıyla ekleyin:
   - `App.tsx` → kök dizine
   - `src/constants/theme.ts`
   - `src/store/appStore.ts`
   - `src/data/duas.ts`
   - `src/data/dhikrs.ts`
   - `src/utils/prayerTimes.ts`
   - `src/utils/notifications.ts`
   - `src/components/AdBanner.tsx`
   - `src/screens/HomeScreen.tsx`
   - `src/screens/QiblaScreen.tsx`
   - `src/screens/ZikirScreen.tsx`
   - `src/screens/DuaScreen.tsx`
   - `src/screens/TakipScreen.tsx`
   - `src/screens/ProfilScreen.tsx`
   - `src/screens/PaywallScreen.tsx`
   - `src/screens/SureDetayScreen.tsx`
4. **package.json** içindeki bağımlılıkları Snack'in "Dependencies" paneline ekleyin
5. **Telefon ile test**: Expo Go uygulamasını indirip QR kodu tarayın

---

## 💻 YÖNTEM 2: Bilgisayarda Kurulum (Önerilen)

### Gereksinimler:
- Node.js 18+ (https://nodejs.org)
- Expo CLI

### Kurulum:
```bash
# 1. Proje klasörüne gir
cd islami-asistan

# 2. Bağımlılıkları yükle
npm install

# 3. Uygulamayı başlat
npx expo start
```

### Test Seçenekleri:
```bash
npx expo start          # QR kod — Expo Go ile test
npx expo start --android  # Android emülatör
npx expo start --ios      # iOS simülatör (Mac gerekli)
```

---

## 📱 TELEFONDA TEST (Expo Go)

1. Telefonunuza **Expo Go** yükleyin:
   - iOS: App Store'dan "Expo Go"
   - Android: Play Store'dan "Expo Go"
2. `npx expo start` çalıştırın
3. QR kodu Expo Go ile tarayın
4. Uygulama telefonunuzda açılır! ✅

---

## 🏪 STORE'A YÜKLEME (EAS Build)

### 1. EAS CLI Kurulumu:
```bash
npm install -g eas-cli
eas login
```

### 2. Android (APK/AAB):
```bash
eas build --platform android --profile production
```

### 3. iOS (IPA):
```bash
eas build --platform ios --profile production
```

### 4. Gönderme:
```bash
eas submit --platform android
eas submit --platform ios
```

---

## 💰 REKLAM SİSTEMİ (AdMob) — Production İçin

1. **https://admob.google.com** → Hesap aç
2. Uygulama ekle → iOS ve Android için ayrı App ID al
3. `app.json`'a ekle:
```json
"plugins": [
  ["expo-ads-admob", {
    "androidAppId": "ca-app-pub-XXXXX~XXXXX",
    "iosAppId": "ca-app-pub-XXXXX~XXXXX"
  }]
]
```
4. `AdBanner.tsx` içindeki mock komponenti gerçek AdMob koduyla değiştir

### Gerçek AdMob Kodu:
```bash
npx expo install expo-ads-admob
# veya
npx expo install react-native-google-mobile-ads
```

---

## 💎 PREMIUM (In-App Purchase) — Production İçin

### RevenueCat (Önerilen):
```bash
npm install react-native-purchases
```

```typescript
// Kurulum
import Purchases from 'react-native-purchases';
Purchases.configure({ apiKey: 'your_revenuecat_key' });

// Satın alma
const packages = await Purchases.getOfferings();
await Purchases.purchasePackage(packages.current.monthly);
```

App Store Connect ve Google Play Console'da abonelik ürünleri oluşturmanız gerekir.

---

## 📁 Proje Yapısı

```
islami-asistan/
├── App.tsx                    # Ana giriş, navigasyon
├── app.json                   # Expo konfigürasyon
├── package.json               # Bağımlılıklar
├── babel.config.js            # Babel (Reanimated için)
├── tsconfig.json              # TypeScript
├── STORE_LISTING.txt          # App Store/Play Store metinleri
└── src/
    ├── constants/
    │   └── theme.ts           # Renkler, tipografi, boşluklar
    ├── store/
    │   └── appStore.ts        # Zustand global state
    ├── data/
    │   ├── duas.ts            # 20+ dua verisi
    │   └── dhikrs.ts          # Zikir + Sure verileri
    ├── utils/
    │   ├── prayerTimes.ts     # Namaz vakti API
    │   └── notifications.ts   # Bildirim sistemi
    ├── components/
    │   └── AdBanner.tsx       # Reklam bileşeni
    └── screens/
        ├── HomeScreen.tsx     # Namaz vakitleri + streak
        ├── QiblaScreen.tsx    # Kıble bulucu (pusula)
        ├── ZikirScreen.tsx    # Zikirmatik sayaç
        ├── DuaScreen.tsx      # Dua kütüphanesi
        ├── TakipScreen.tsx    # İbadet takibi
        ├── ProfilScreen.tsx   # Profil + ayarlar
        ├── PaywallScreen.tsx  # Premium satış ekranı
        └── SureDetayScreen.tsx # Sure detay sayfası
```

---

## ✅ Mevcut Özellikler

| Özellik | Durum |
|---------|-------|
| Namaz Vakitleri | ✅ GPS + Aladhan API |
| Kıble Bulucu | ✅ Magnetometre |
| Zikirmatik | ✅ Haptics + istatistik |
| Dua Kütüphanesi | ✅ 20+ dua, favori |
| İbadet Takibi | ✅ Haftalık görünüm |
| Premium Paywall | ✅ UI hazır |
| AdMob Reklamlar | ✅ Mock (production için gerçek AdMob kodu eklenecek) |
| Bildirimler | ✅ Namaz + zikir + sure |
| Dark Mode | ✅ |
| Offline | ✅ AsyncStorage |
| Streak Sistemi | ✅ |
| Günlük Sure | ✅ |
| AI Öneriler | ✅ (kural tabanlı) |

---

## 🔧 Sık Sorulan Sorular

**Kıble pusula çalışmıyor?**
→ Simülatörde magnetometre çalışmaz. Gerçek telefon gerekli.

**Namaz vakitleri yüklenmiyor?**
→ İnternet bağlantısı kontrol edin. Offline'da mock veriler gösterilir.

**Expo Snack'te hata?**
→ Snack SDK sürümünü 51'e ayarlayın (sağ üst köşe).

---

## 📞 Destek

Sorularınız için: destek@islamiasistan.com

Hayırlı ibadeler! 🤲
