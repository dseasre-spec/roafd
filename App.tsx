import React, { useCallback } from 'react';
import { View, I18nManager, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
  Tajawal_800ExtraBold,
} from '@expo-google-fonts/tajawal';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { BottomTabNavigator } from './src/navigation/BottomTabNavigator';

// Force RTL
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
    Tajawal_800ExtraBold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View style={{ flex: 1 }} onLayout={onLayout}>
          <StatusBar style="dark" backgroundColor="#F7F4EF" />
          <BottomTabNavigator />
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
