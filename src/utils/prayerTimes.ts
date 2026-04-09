// src/utils/prayerTimes.ts
import axios from 'axios';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string;
}

export interface PrayerInfo {
  key: string;
  name: string;
  time: string;
  isCurrent: boolean;
  isNext: boolean;
  timeInMinutes: number;
}

// Tüm 81 il — Aladhan API'nin tanıdığı isimler
export const TURKEY_CITIES = [
  { id: 'adana', name: 'Adana' },
  { id: 'adiyaman', name: 'Adıyaman' },
  { id: 'afyonkarahisar', name: 'Afyonkarahisar' },
  { id: 'agri', name: 'Ağrı' },
  { id: 'aksaray', name: 'Aksaray' },
  { id: 'amasya', name: 'Amasya' },
  { id: 'ankara', name: 'Ankara' },
  { id: 'antalya', name: 'Antalya' },
  { id: 'ardahan', name: 'Ardahan' },
  { id: 'artvin', name: 'Artvin' },
  { id: 'aydin', name: 'Aydın' },
  { id: 'balikesir', name: 'Balıkesir' },
  { id: 'bartin', name: 'Bartın' },
  { id: 'batman', name: 'Batman' },
  { id: 'bayburt', name: 'Bayburt' },
  { id: 'bilecik', name: 'Bilecik' },
  { id: 'bingol', name: 'Bingöl' },
  { id: 'bitlis', name: 'Bitlis' },
  { id: 'bolu', name: 'Bolu' },
  { id: 'burdur', name: 'Burdur' },
  { id: 'bursa', name: 'Bursa' },
  { id: 'canakkale', name: 'Çanakkale' },
  { id: 'cankiri', name: 'Çankırı' },
  { id: 'corum', name: 'Çorum' },
  { id: 'denizli', name: 'Denizli' },
  { id: 'diyarbakir', name: 'Diyarbakır' },
  { id: 'duzce', name: 'Düzce' },
  { id: 'edirne', name: 'Edirne' },
  { id: 'elazig', name: 'Elazığ' },
  { id: 'erzincan', name: 'Erzincan' },
  { id: 'erzurum', name: 'Erzurum' },
  { id: 'eskisehir', name: 'Eskişehir' },
  { id: 'gaziantep', name: 'Gaziantep' },
  { id: 'giresun', name: 'Giresun' },
  { id: 'gumushane', name: 'Gümüşhane' },
  { id: 'hakkari', name: 'Hakkari' },
  { id: 'hatay', name: 'Hatay' },
  { id: 'igdir', name: 'Iğdır' },
  { id: 'isparta', name: 'Isparta' },
  { id: 'istanbul', name: 'İstanbul' },
  { id: 'izmir', name: 'İzmir' },
  { id: 'kahramanmaras', name: 'Kahramanmaraş' },
  { id: 'karabuk', name: 'Karabük' },
  { id: 'karaman', name: 'Karaman' },
  { id: 'kars', name: 'Kars' },
  { id: 'kastamonu', name: 'Kastamonu' },
  { id: 'kayseri', name: 'Kayseri' },
  { id: 'kilis', name: 'Kilis' },
  { id: 'kirikkale', name: 'Kırıkkale' },
  { id: 'kirklareli', name: 'Kırklareli' },
  { id: 'kirsehir', name: 'Kırşehir' },
  { id: 'kocaeli', name: 'Kocaeli' },
  { id: 'konya', name: 'Konya' },
  { id: 'kutahya', name: 'Kütahya' },
  { id: 'malatya', name: 'Malatya' },
  { id: 'manisa', name: 'Manisa' },
  { id: 'mardin', name: 'Mardin' },
  { id: 'mersin', name: 'Mersin' },
  { id: 'mugla', name: 'Muğla' },
  { id: 'mus', name: 'Muş' },
  { id: 'nevsehir', name: 'Nevşehir' },
  { id: 'nigde', name: 'Niğde' },
  { id: 'ordu', name: 'Ordu' },
  { id: 'osmaniye', name: 'Osmaniye' },
  { id: 'rize', name: 'Rize' },
  { id: 'sakarya', name: 'Sakarya' },
  { id: 'samsun', name: 'Samsun' },
  { id: 'sanliurfa', name: 'Şanlıurfa' },
  { id: 'siirt', name: 'Siirt' },
  { id: 'sinop', name: 'Sinop' },
  { id: 'sirnak', name: 'Şırnak' },
  { id: 'sivas', name: 'Sivas' },
  { id: 'tekirdag', name: 'Tekirdağ' },
  { id: 'tokat', name: 'Tokat' },
  { id: 'trabzon', name: 'Trabzon' },
  { id: 'tunceli', name: 'Tunceli' },
  { id: 'usak', name: 'Uşak' },
  { id: 'van', name: 'Van' },
  { id: 'yalova', name: 'Yalova' },
  { id: 'yozgat', name: 'Yozgat' },
  { id: 'zonguldak', name: 'Zonguldak' },
];

export const fetchPrayerTimesByCity = async (cityName: string): Promise<PrayerTimes | null> => {
  try {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    const res = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${encodeURIComponent(cityName)}&country=Turkey&method=13&school=1`,
      { timeout: 10000 }
    );

    const timings = res.data?.data?.timings;
    if (!timings) return null;

    return {
      Fajr: timings.Fajr,
      Sunrise: timings.Sunrise,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
      date: today.toISOString().split('T')[0],
    };
  } catch (e) {
    console.log('Prayer times city error:', e);
    return null;
  }
};

export const fetchPrayerTimes = async (lat: number, lon: number): Promise<PrayerTimes | null> => {
  try {
    const today = new Date();
    const timestamp = Math.floor(today.getTime() / 1000);
    const res = await axios.get(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lon}&method=13&school=1`,
      { timeout: 10000 }
    );
    const timings = res.data?.data?.timings;
    if (!timings) return null;
    return {
      Fajr: timings.Fajr,
      Sunrise: timings.Sunrise,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
      date: today.toISOString().split('T')[0],
    };
  } catch (e) {
    console.log('Prayer times error:', e);
    return null;
  }
};

const timeToMinutes = (timeStr: string): number => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};

export const getCurrentAndNextPrayer = (times: PrayerTimes): { current: string; next: string; nextTime: string } => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { key: 'Fajr', minutes: timeToMinutes(times.Fajr) },
    { key: 'Sunrise', minutes: timeToMinutes(times.Sunrise) },
    { key: 'Dhuhr', minutes: timeToMinutes(times.Dhuhr) },
    { key: 'Asr', minutes: timeToMinutes(times.Asr) },
    { key: 'Maghrib', minutes: timeToMinutes(times.Maghrib) },
    { key: 'Isha', minutes: timeToMinutes(times.Isha) },
  ];

  let current = 'Isha';
  let next = 'Fajr';
  let nextTime = times.Fajr;

  for (let i = 0; i < prayers.length; i++) {
    if (currentMinutes < prayers[i].minutes) {
      next = prayers[i].key;
      nextTime = (times as any)[prayers[i].key];
      current = i > 0 ? prayers[i - 1].key : 'Isha';
      break;
    }
  }

  return { current, next, nextTime };
};

export const getCountdownToNextPrayer = (nextTime: string): string => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const nextMinutes = timeToMinutes(nextTime);
  let diff = nextMinutes - currentMinutes;
  if (diff < 0) diff += 1440;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h === 0) return `${m} dakika`;
  return `${h} saat ${m} dakika`;
};

export const getPrayerList = (times: PrayerTimes): PrayerInfo[] => {
  const { current, next } = getCurrentAndNextPrayer(times);
  const names: Record<string, string> = {
    Fajr: 'İmsak (Sabah)',
    Sunrise: 'Güneş',
    Dhuhr: 'Öğle',
    Asr: 'İkindi',
    Maghrib: 'Akşam',
    Isha: 'Yatsı',
  };
  return ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((key) => ({
    key,
    name: names[key],
    time: (times as any)[key],
    isCurrent: current === key,
    isNext: next === key,
    timeInMinutes: timeToMinutes((times as any)[key]),
  }));
};

export const getMockPrayerTimes = (): PrayerTimes => ({
  Fajr: '05:20',
  Sunrise: '06:52',
  Dhuhr: '13:05',
  Asr: '16:30',
  Maghrib: '19:15',
  Isha: '20:45',
  date: new Date().toISOString().split('T')[0],
});