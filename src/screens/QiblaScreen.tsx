// src/screens/QiblaScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Platform, TouchableOpacity,
} from 'react-native';
import { Magnetometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/appStore';
import { LIGHT_COLORS, DARK_COLORS, SPACING, RADIUS, FONT_SIZES } from '../constants/theme';

const MECCA_LAT = 21.4225;
const MECCA_LON = 39.8262;

const toRad = (deg: number) => deg * (Math.PI / 180);

const calculateQiblaDirection = (lat: number, lon: number): number => {
  const dLon = toRad(MECCA_LON - lon);
  const lat1 = toRad(lat);
  const lat2 = toRad(MECCA_LAT);
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

export const QiblaScreen = () => {
  const { isDarkMode, latitude, longitude } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  const [magnetometer, setMagnetometer] = useState(0);
  const [qiblaDir, setQiblaDir] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [accuracy, setAccuracy] = useState('Kalibre ediliyor...');

  const compassAnim = useRef(new Animated.Value(0)).current;
  const needleAnim = useRef(new Animated.Value(0)).current;
  const prevCompass = useRef(0);
  const prevNeedle = useRef(0);

  useEffect(() => {
    if (latitude && longitude) {
      setQiblaDir(calculateQiblaDirection(latitude, longitude));
    }
    startMagnetometer();
    return () => { subscription?.remove(); };
  }, [latitude, longitude]);

  const startMagnetometer = async () => {
    try {
      const available = await Magnetometer.isAvailableAsync();
      if (!available) {
        setIsAvailable(false);
        return;
      }
      Magnetometer.setUpdateInterval(100);
      const sub = Magnetometer.addListener((data) => {
        const { x, y } = data;
        let angle = Math.atan2(y, x) * (180 / Math.PI);
        angle = angle >= 0 ? angle : angle + 360;
        angle = (360 - angle) % 360;
        setMagnetometer(angle);
        setAccuracy(
          Math.abs(data.x) > 50 || Math.abs(data.y) > 50 ? 'İyi' : 'Kalibre edin'
        );
      });
      setSubscription(sub);
    } catch (e) {
      setIsAvailable(false);
    }
  };

  useEffect(() => {
    let compassRotation = -magnetometer;
    let delta = compassRotation - prevCompass.current;
    if (delta > 180) compassRotation -= 360;
    if (delta < -180) compassRotation += 360;

    Animated.spring(compassAnim, {
      toValue: compassRotation,
      useNativeDriver: true,
      damping: 15,
      stiffness: 80,
    }).start();
    prevCompass.current = compassRotation;

    if (qiblaDir !== null) {
      let needleRotation = qiblaDir - magnetometer;
      let nd = needleRotation - prevNeedle.current;
      if (nd > 180) needleRotation -= 360;
      if (nd < -180) needleRotation += 360;

      Animated.spring(needleAnim, {
        toValue: needleRotation,
        useNativeDriver: true,
        damping: 15,
        stiffness: 80,
      }).start();
      prevNeedle.current = needleRotation;
    }
  }, [magnetometer, qiblaDir]);

  const compassRotateStr = compassAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const needleRotateStr = needleAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  const isAligned = qiblaDir !== null && Math.abs(((magnetometer - qiblaDir + 180 + 360) % 360) - 180) < 10;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <View style={[styles.header, { backgroundColor: C.primary }]}>
        <Text style={styles.headerTitle}>🧭 Kıble Bulucu</Text>
        {latitude && longitude && (
          <Text style={styles.headerSub}>
            Yön: {qiblaDir !== null ? `${Math.round(qiblaDir)}°` : '—'}
          </Text>
        )}
      </View>

      {!isAvailable ? (
        <View style={styles.unavailable}>
          <Ionicons name="compass-outline" size={80} color={C.textMuted} />
          <Text style={[styles.unavailableTitle, { color: C.text }]}>Pusula Kullanılamıyor</Text>
          <Text style={[styles.unavailableText, { color: C.textSecondary }]}>
            Cihazınızda manyetometre sensörü bulunamadı.
            {'\n'}Simülatörde gerçek pusula çalışmaz.
          </Text>
        </View>
      ) : (
        <View style={styles.compassArea}>
          {/* Compass Rose */}
          <Animated.View style={[styles.compassRose, { transform: [{ rotate: compassRotateStr }] }]}>
            <View style={[styles.compassCircle, { borderColor: C.primary + '40', backgroundColor: C.card }]}>
              {/* Cardinal directions */}
              {['K', 'D', 'G', 'B'].map((dir, i) => (
                <View key={dir} style={[styles.cardinalContainer, { transform: [{ rotate: `${i * 90}deg` }] }]}>
                  <Text style={[
                    styles.cardinal,
                    { color: dir === 'K' ? C.error : C.textSecondary },
                    dir === 'K' && { fontWeight: '900', fontSize: FONT_SIZES.lg },
                  ]}>
                    {dir}
                  </Text>
                </View>
              ))}
              {/* Degree marks */}
              {Array.from({ length: 36 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.degreeMark,
                    { transform: [{ rotate: `${i * 10}deg` }] },
                    { backgroundColor: i % 9 === 0 ? C.primary : C.border },
                    i % 9 === 0 ? styles.degreeMarkLarge : styles.degreeMarkSmall,
                  ]}
                />
              ))}
            </View>
          </Animated.View>

          {/* Qibla Needle */}
          <Animated.View style={[styles.needleContainer, { transform: [{ rotate: needleRotateStr }] }]}>
            <View style={styles.needleWrapper}>
              <View style={[styles.needleTop, { backgroundColor: isAligned ? '#00C853' : C.accent }]} />
              <View style={[styles.needleCenter, { backgroundColor: C.card, borderColor: C.border }]} />
              <View style={[styles.needleBottom, { backgroundColor: C.textMuted }]} />
            </View>
          </Animated.View>

          {/* Center dot */}
          <View style={[styles.centerDot, { backgroundColor: C.primary }]} />

          {/* Kaaba icon at top of needle */}
          <Text style={styles.kaabaIcon}>🕋</Text>
        </View>
      )}

      {/* Info Cards */}
      <View style={[styles.infoRow]}>
        <View style={[styles.infoCard, { backgroundColor: C.card }]}>
          <Ionicons name="compass" size={20} color={C.primary} />
          <Text style={[styles.infoLabel, { color: C.textMuted }]}>Yön</Text>
          <Text style={[styles.infoValue, { color: C.text }]}>
            {Math.round(magnetometer)}°
          </Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: C.card }]}>
          <Text style={{ fontSize: 20 }}>🕋</Text>
          <Text style={[styles.infoLabel, { color: C.textMuted }]}>Kıble</Text>
          <Text style={[styles.infoValue, { color: C.text }]}>
            {qiblaDir !== null ? `${Math.round(qiblaDir)}°` : '—'}
          </Text>
        </View>
        <View style={[styles.infoCard, { backgroundColor: isAligned ? '#00C853' + '20' : C.card }]}>
          <Ionicons name={isAligned ? 'checkmark-circle' : 'radio-button-off'} size={20} color={isAligned ? '#00C853' : C.textMuted} />
          <Text style={[styles.infoLabel, { color: C.textMuted }]}>Durum</Text>
          <Text style={[styles.infoValue, { color: isAligned ? '#00C853' : C.text, fontSize: FONT_SIZES.sm }]}>
            {isAligned ? 'Hizalandı!' : 'Çevirin'}
          </Text>
        </View>
      </View>

      <View style={[styles.calibrateBar, { backgroundColor: C.card }]}>
        <Ionicons name="information-circle-outline" size={16} color={C.textMuted} />
        <Text style={[styles.calibrateText, { color: C.textSecondary }]}>
          Pusula doğruluğu: {accuracy}. Sekiz şekli çizerek kalibre edin.
        </Text>
      </View>

      {!latitude && (
        <View style={[styles.warningBar, { backgroundColor: C.warning + '20' }]}>
          <Ionicons name="location-outline" size={16} color={C.warning} />
          <Text style={[styles.warningText, { color: C.warning }]}>
            Kıble hesabı için konum izni gerekli. Ana sayfadan izin verin.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl, alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', color: '#fff' },
  headerSub: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  compassArea: { alignItems: 'center', justifyContent: 'center', marginVertical: SPACING.xl, height: 280 },
  compassRose: { position: 'absolute', width: 260, height: 260 },
  compassCircle: {
    width: 260, height: 260, borderRadius: 130,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  cardinalContainer: { position: 'absolute', width: '100%', height: '100%', alignItems: 'center' },
  cardinal: { position: 'absolute', top: 10, fontSize: FONT_SIZES.md, fontWeight: '700' },
  degreeMark: { position: 'absolute', top: 4, width: 2, height: 8 },
  degreeMarkLarge: { height: 12, width: 2 },
  degreeMarkSmall: { height: 6, opacity: 0.4 },
  needleContainer: { position: 'absolute', width: 8, height: 200, alignItems: 'center' },
  needleWrapper: { flex: 1, alignItems: 'center', width: '100%' },
  needleTop: { width: 6, flex: 1, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  needleCenter: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, marginVertical: 2 },
  needleBottom: { width: 4, flex: 0.7, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, opacity: 0.5 },
  centerDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6 },
  kaabaIcon: { position: 'absolute', top: -10, fontSize: 20 },
  unavailable: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  unavailableTitle: { fontSize: FONT_SIZES.xl, fontWeight: '700', marginTop: SPACING.lg, marginBottom: SPACING.sm },
  unavailableText: { textAlign: 'center', lineHeight: 22, fontSize: FONT_SIZES.md },
  infoRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.sm },
  infoCard: { flex: 1, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center', gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  infoLabel: { fontSize: FONT_SIZES.xs },
  infoValue: { fontSize: FONT_SIZES.md, fontWeight: '700' },
  calibrateBar: { flexDirection: 'row', alignItems: 'center', margin: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.md, gap: SPACING.sm },
  calibrateText: { flex: 1, fontSize: FONT_SIZES.sm, lineHeight: 18 },
  warningBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: SPACING.lg, padding: SPACING.md, borderRadius: RADIUS.md, gap: SPACING.sm },
  warningText: { flex: 1, fontSize: FONT_SIZES.sm },
});