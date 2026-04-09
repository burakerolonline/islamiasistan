// App.tsx
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { useAppStore } from './src/store/appStore';
import { LIGHT_COLORS, DARK_COLORS } from './src/constants/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { QiblaScreen } from './src/screens/QiblaScreen';
import { ZikirScreen } from './src/screens/ZikirScreen';
import { DuaScreen } from './src/screens/DuaScreen';
import { AyetlerScreen } from './src/screens/AyetlerScreen';
import { ProfilScreen } from './src/screens/ProfilScreen';
import { SureDetayScreen } from './src/screens/SureDetayScreen';
import { GizlilikScreen } from './src/screens/GizlilikScreen';
import { KullanimSartlariScreen } from './src/screens/KullanimSartlariScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { isDarkMode } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        tabBarIcon: ({ focused, color }) => {
          const iconMap: Record<string, [string, string]> = {
            'Ana Sayfa': ['home', 'home-outline'],
            'Kıble': ['compass', 'compass-outline'],
            'Zikir': ['radio-button-on', 'radio-button-off-outline'],
            'Dualar': ['hand-left', 'hand-left-outline'],
            'Ayetler': ['book', 'book-outline'],
            'Profil': ['person', 'person-outline'],
          };
          const [filledIcon, outlineIcon] = iconMap[route.name] || ['home', 'home-outline'];
          return (
            <Ionicons
              name={(focused ? filledIcon : outlineIcon) as any}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Kıble" component={QiblaScreen} />
      <Tab.Screen name="Zikir" component={ZikirScreen} />
      <Tab.Screen name="Dualar" component={DuaScreen} />
      <Tab.Screen name="Ayetler" component={AyetlerScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isDarkMode, loadFromStorage } = useAppStore();
  const C = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  useEffect(() => {
    loadFromStorage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.background }}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: isDarkMode,
            colors: {
              primary: C.primary,
              background: C.background,
              card: C.card,
              text: C.text,
              border: C.border,
              notification: C.primary,
            },
          }}
        >
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="SureDetay" component={SureDetayScreen} />
            <Stack.Screen name="Gizlilik" component={GizlilikScreen} />
            <Stack.Screen name="KullanimSartlari" component={KullanimSartlariScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}