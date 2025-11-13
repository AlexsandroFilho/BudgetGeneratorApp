// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// 1. IMPORTAÇÃO DA TELA
// Confirme o caminho, que deve ser a partir de 'navigation' para 'screens/Intro'
import { IntroScreen } from '../screens/Intro/IntroScreen';
// Futuras telas:
// import { LoginScreen } from '../screens/Auth/LoginScreen'; 
// import { CadastroScreen } from '../screens/Auth/CadastroScreen'; 


// 2. TIPAGEM (Definida AQUI, ou importada se estiver em outro arquivo)
export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined; // Tela futura
  Cadastro: undefined; // Tela futura
};

// 3. O restante do código (já está correto)

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Intro">
      {/* Tela atual de introdução, que será sua tela de destino para Login/Cadastro */}
      <AuthStack.Screen
        name="Intro"
        component={IntroScreen} // <-- O erro some com a importação acima
        options={{ headerShown: false }}
      />
      {/* Telas futuras:
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Cadastro" component={CadastroScreen} />
      */}
    </AuthStack.Navigator>
  );
};