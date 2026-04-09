// src/components/AdBanner.tsx
// Snack'te mock reklam gösterir.
// Gerçek projede react-native-google-mobile-ads kullanılır.

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── AdMob ID'leri ───────────────────────────────────────────
export const ADMOB_APP_ID = 'ca-app-pub-1477681170501482~8751442388';
export const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-1477681170501482/4625126004';

// Test modunda test ID kullan, production'da gerçek ID kullan
// export const ADMOB_INTERSTITIAL_ID = __DEV__
//   ? 'ca-app-pub-3940256099942544/1033173712'  // Google test ID
//   : 'ca-app-pub-1477681170501482/4625126004'; // Gerçek ID

// ─── Gerçek AdMob Kodu (react-native-google-mobile-ads kurulunca açılacak) ───
// import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
// const interstitial = InterstitialAd.createForAdRequest(ADMOB_INTERSTITIAL_ID);
// export const loadInterstitialAd = () => interstitial.load();
// export const showInterstitialAd = () => {
//   if (interstitial.loaded) interstitial.show();
// };

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const InterstitialAd: React.FC<Props> = ({ visible, onClose }) => {
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCanClose(false);
      setCountdown(5);
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 300, useNativeDriver: true,
      }).start();

      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timer); setCanClose(true); return 0; }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <View style={styles.topBar}>
          <Text style={styles.adLabel}>REKLAM</Text>
          <TouchableOpacity
            style={[styles.closeBtn, !canClose && styles.closeBtnDisabled]}
            onPress={canClose ? onClose : undefined}
          >
            {canClose
              ? <Ionicons name="close" size={18} color="#fff" />
              : <Text style={styles.closeBtnCountdown}>{countdown}</Text>
            }
          </TouchableOpacity>
        </View>

        <View style={styles.adContent}>
          <View style={styles.adIconBg}>
            <Text style={styles.adIcon}>📱</Text>
          </View>
          <Text style={styles.adTitle}>Reklam Alanı</Text>
          <Text style={styles.adDesc}>
            Bu alan AdMob tarafından{'\n'}doldurulacak
          </Text>
          <Text style={styles.adId}>ID: {ADMOB_INTERSTITIAL_ID}</Text>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.skipBtn, canClose && styles.skipBtnActive]}
            onPress={canClose ? onClose : undefined}
          >
            <Text style={[styles.skipText, canClose && styles.skipTextActive]}>
              {canClose ? 'Reklamı Geç →' : `Reklamı Geç (${countdown})`}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export const BannerAd: React.FC = () => (
  <View style={styles.banner}>
    <Ionicons name="megaphone-outline" size={12} color="#999" />
    <Text style={styles.bannerText}>  Reklam</Text>
  </View>
);

// Geriye dönük uyumluluk için
export const AdBanner = BannerAd;

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', width, height },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 12,
  },
  adLabel: { color: '#aaa', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#333', alignItems: 'center', justifyContent: 'center',
  },
  closeBtnDisabled: { backgroundColor: '#1a1a1a' },
  closeBtnCountdown: { color: '#777', fontSize: 13, fontWeight: '700' },
  adContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  adIconBg: {
    width: 100, height: 100, borderRadius: 24,
    backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24, borderWidth: 1, borderColor: '#333',
  },
  adIcon: { fontSize: 48 },
  adTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  adDesc: { fontSize: 15, color: '#aaa', textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  adId: { fontSize: 10, color: '#444', textAlign: 'center' },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 48 },
  skipBtn: {
    backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  skipBtnActive: { backgroundColor: '#1B4332', borderColor: '#40916C' },
  skipText: { color: '#555', fontSize: 15, fontWeight: '600' },
  skipTextActive: { color: '#fff' },
  banner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 6, backgroundColor: '#f5f5f5',
    borderTopWidth: 1, borderTopColor: '#eee',
  },
  bannerText: { fontSize: 11, color: '#999' },
});