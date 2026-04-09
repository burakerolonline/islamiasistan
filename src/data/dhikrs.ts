// src/data/dhikrs.ts

export interface Dhikr {
  id: string;
  name: string;
  arabic: string;
  meaning: string;
  defaultTarget: number;
  virtue?: string;
}

export const DHIKRS: Dhikr[] = [
  {
    id: 'subhanallah',
    name: 'Sübhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    meaning: 'Allah\'ı her türlü eksiklikten tenzih ederim',
    defaultTarget: 33,
    virtue: 'Her tesbih için bir ağaç dikilir cennette.',
  },
  {
    id: 'alhamdulillah',
    name: 'Elhamdülillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    meaning: 'Hamd Allah\'a mahsustur',
    defaultTarget: 33,
    virtue: 'Mizanda en ağır kelimedir.',
  },
  {
    id: 'allahuakbar',
    name: 'Allahu Ekber',
    arabic: 'اللَّهُ أَكْبَرُ',
    meaning: 'Allah en büyüktür',
    defaultTarget: 34,
    virtue: 'Cennetin hazinelerinden biridir.',
  },
  {
    id: 'lailahe',
    name: 'Lailahe illallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    meaning: 'Allah\'tan başka ilah yoktur',
    defaultTarget: 100,
    virtue: 'İmanın direğidir, günahları siler.',
  },
  {
    id: 'salavat',
    name: 'Salavat',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ',
    meaning: 'Allah\'ım, Muhammed\'e salat et',
    defaultTarget: 100,
    virtue: 'Her salavata karşılık 10 rahmet iner.',
  },
  {
    id: 'istigfar',
    name: 'İstiğfar',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    meaning: 'Allah\'tan bağışlanma dilerim',
    defaultTarget: 100,
    virtue: 'Rızkı açar, sıkıntıları giderir.',
  },
  {
    id: 'havkale',
    name: 'Havkale',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    meaning: 'Güç ve kuvvet ancak Allah\'ındır',
    defaultTarget: 33,
    virtue: 'Cennet hazinelerinden bir hazinedir.',
  },
  {
    id: 'bismillah',
    name: 'Besmele',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    meaning: 'Rahman ve Rahim olan Allah\'ın adıyla',
    defaultTarget: 21,
  },
];

// src/data/suras.ts
export interface Sura {
  id: number;
  name: string;
  arabicName: string;
  meaning: string;
  verses: number;
  arabicText: string;
  turkishMeaning: string;
  virtue?: string;
}

export const DAILY_SURAS: Sura[] = [
  {
    id: 1,
    name: 'Fatiha Suresi',
    arabicName: 'الفاتحة',
    meaning: 'Açış',
    verses: 7,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
    turkishMeaning: 'Rahman ve Rahim olan Allah\'ın adıyla.\nHamd, alemlerin Rabbi Allah\'a mahsustur.\nO, Rahman\'dır, Rahim\'dir.\nDin gününün sahibidir.\nYalnız sana ibadet ederiz ve yalnız senden yardım dileriz.\nBizi doğru yola ilet.\nNimet verdiklerinin yoluna; gazaba uğrayanların ve sapkınların yoluna değil.',
    virtue: 'Kur\'an\'ın özüdür. Her namazda okunur.',
  },
  {
    id: 112,
    name: 'İhlas Suresi',
    arabicName: 'الإخلاص',
    meaning: 'Samimiyet',
    verses: 4,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ\nاللَّهُ الصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    turkishMeaning: 'De ki: O, Allah\'tır, bir tektir.\nAllah Samed\'dir (Her şey O\'na muhtaçtır, O hiçbir şeye muhtaç değildir).\nO doğurmamış ve doğurulmamıştır.\nHiçbir şey O\'nun dengi değildir.',
    virtue: 'Kur\'an\'ın üçte birine denktir.',
  },
  {
    id: 113,
    name: 'Felak Suresi',
    arabicName: 'الفلق',
    meaning: 'Sabahın aydınlığı',
    verses: 5,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nمِن شَرِّ مَا خَلَقَ\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    turkishMeaning: 'De ki: Sabahın Rabbine sığınırım.\nYarattığı şeylerin şerrinden.\nKaranlığı çöktüğünde gecenin şerrinden.\nDüğümlere üfleyenlerin şerrinden.\nHaset ettiğinde hasetçinin şerrinden.',
    virtue: 'Her gece okuyanı sabaha kadar korur.',
  },
  {
    id: 114,
    name: 'Nas Suresi',
    arabicName: 'الناس',
    meaning: 'İnsanlar',
    verses: 6,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ\nمَلِكِ النَّاسِ\nإِلَٰهِ النَّاسِ\nمِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nمِنَ الْجِنَّةِ وَالنَّاسِ',
    turkishMeaning: 'De ki: İnsanların Rabbine sığınırım.\nİnsanların Melik\'ine.\nİnsanların İlah\'ına.\nSinsi vesvesecinin şerrinden.\nİnsanların göğüslerine vesvese veren o şeytanın şerrinden.\nCinden ve insandan olan şeytanların şerrinden.',
    virtue: 'Felak ile birlikte okunması tavsiye edilir.',
  },
  {
    id: 36,
    name: 'Yasin Suresi',
    arabicName: 'يس',
    meaning: 'Ey İnsan',
    verses: 83,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nيس\nوَالْقُرْآنِ الْحَكِيمِ\nإِنَّكَ لَمِنَ الْمُرْسَلِينَ...',
    turkishMeaning: 'Yâ-Sîn. Hikmet dolu Kur\'an\'a andolsun ki sen, gönderilen peygamberlerdensin...',
    virtue: 'Kur\'an\'ın kalbidir. Ölülerinizin yanında okuyunuz.',
  },
  {
    id: 55,
    name: 'Rahman Suresi',
    arabicName: 'الرحمن',
    meaning: 'Rahmet Eden',
    verses: 78,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nالرَّحْمَنُ\nعَلَّمَ الْقُرْآنَ...',
    turkishMeaning: 'Rahman. Kur\'an\'ı öğretti...',
    virtue: 'Allah\'ın nimetlerini hatırlatır. "Rabbinizin hangi nimetlerini yalanlıyorsunuz?"',
  },
  {
    id: 67,
    name: 'Mülk Suresi',
    arabicName: 'الملك',
    meaning: 'Hükümranlık',
    verses: 30,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\nتَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ...',
    turkishMeaning: 'Mülk elinde bulunan Allah\'ın şanı yücedir...',
    virtue: 'Her gece okuyanı kabir azabından korur.',
  },
];

export const getTodaysSura = (): Sura => {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_SURAS[dayOfYear % DAILY_SURAS.length];
};
