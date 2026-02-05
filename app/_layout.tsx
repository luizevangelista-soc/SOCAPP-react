import { Slot } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      {/* Configura a StatusBar global */}
      <StatusBar barStyle="light-content" backgroundColor="#3E8E97" />

      {/* Slot renderiza a tela atual (login, home, etc) */}
      <Slot />
    </SafeAreaProvider>
  );
}
