// App.tsx
import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // Importar SafeAreaProvider

export default function App() {
  return (
    <SafeAreaProvider> {/* Envolver o AppNavigator com SafeAreaProvider */}
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

