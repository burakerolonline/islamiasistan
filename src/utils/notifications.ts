// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';
import { PrayerTimes } from './prayerTimes';
import { getTodaysSura } from '../data/dhikrs';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

const parseTime = (timeStr: string): { hour: number; minute: number } => {
  const [h, m] = timeStr.split(':').map(Number);
  return { hour: h, minute: m };
};

export const schedulePrayerNotifications = async (times: PrayerTimes) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const prayers = [
    { name: 'Sabah (İmsak)', time: times.Fajr, emoji: '🌅' },
    { name: 'Öğle', time: times.Dhuhr, emoji: '☀️' },
    { name: 'İkindi', time: times.Asr, emoji: '⛅' },
    { name: 'Akşam', time: times.Maghrib, emoji: '🌇' },
    { name: 'Yatsı', time: times.Isha, emoji: '🌙' },
  ];

  for (const prayer of prayers) {
    const { hour, minute } = parseTime(prayer.time);
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${prayer.emoji} ${prayer.name} Vakti`,
          body: `${prayer.name} namazı vakti girdi. Hayırlı namaz! 🤲`,
          sound: true,
        },
        trigger: { hour, minute, repeats: true } as any,
      });
    } catch (e) {
      console.log('Notification error:', e);
    }
  }

  await scheduleDailySuraNotification();
  await scheduleDhikrReminder();
};

export const scheduleDailySuraNotification = async () => {
  try {
    const sura = getTodaysSura();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `📖 Bugünün Suresi: ${sura.name}`,
        body: `"${sura.meaning}" — ${sura.verses} ayet. Okumak için dokunun!`,
      },
      trigger: { hour: 9, minute: 0, repeats: true } as any,
    });
  } catch (e) {
    console.log('Sura notification error:', e);
  }
};

export const scheduleDhikrReminder = async () => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📿 Günlük Zikir Hatırlatıcı',
        body: 'Bugünkü zikrinizi yapmayı unutmayın. سُبْحَانَ اللَّهِ',
      },
      trigger: { hour: 8, minute: 0, repeats: true } as any,
    });
  } catch (e) {
    console.log('Dhikr reminder error:', e);
  }
};