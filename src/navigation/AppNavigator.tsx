// src/navigation/AppNavigator.tsx

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// 1. Importamos os dois fluxos de navegação que criamos
import { AppStack, AppStackParamList } from './AppStack'; 
import { AuthNavigator, AuthStackParamList } from './AuthNavigator'; 

// ATENÇÃO: Tipagem combinada de todos os navegadores
// Isso é útil se precisarmos navegar entre o fluxo de Auth e o App
export type RootStackParamList = AuthStackParamList & AppStackParamList;


// 2. O componente principal AppNavigator (sem React.FC)
export const AppNavigator = () => {
  // ATENÇÃO: Este estado é simulado! 
  // Na vida real, você usaria um Hook ou Context para saber se o usuário está logado.
  // Mude para 'true' para ver a lista de Orçamentos; 'false' para ver a tela Intro/Login.
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  return (
    <NavigationContainer>
      {/* 3. O 'coração' do seu app: decide qual fluxo mostrar */}
      {isAuthenticated 
        ? <AppStack />      // Usuário logado: Mostra o App (Orçamentos)
        : <AuthNavigator /> // Usuário deslogado: Mostra o Fluxo de Autenticação (Intro/Login)
      }
    </NavigationContainer>
  );
};