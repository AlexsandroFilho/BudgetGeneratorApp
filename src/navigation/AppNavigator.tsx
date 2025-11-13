// src/navigation/AppNavigator.tsx

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
// 1. Importamos os dois fluxos de navegação que criamos
import { AppStack, AppStackParamList } from './AppStack';
import { AuthNavigator, AuthStackParamList } from './AuthNavigator';
import { useAuth } from '../context/AuthContext';

// ATENÇÃO: Tipagem combinada de todos os navegadores
// Isso é útil se precisarmos navegar entre o fluxo de Auth e o App
export type RootStackParamList = AuthStackParamList & AppStackParamList;


// 2. O componente principal AppNavigator (sem React.FC)
export const AppNavigator = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#228F2F" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* 3. O 'coração' do seu app: decide qual fluxo mostrar */}
      {token
        ? <AppStack />      // Usuário logado: Mostra o App (Orçamentos)
        : <AuthNavigator /> // Usuário deslogado: Mostra o Fluxo de Autenticação (Intro/Login)
      }
    </NavigationContainer>
  );
};