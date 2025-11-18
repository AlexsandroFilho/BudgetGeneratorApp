// src/navigation/AppStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { OrcamentosScreen } from '../screens/Orcamento/Orcamentos';
import { HeaderProfileButton } from '../components/HeaderProfileButton';

// Tipagem para as rotas do App Logado
export type AppStackParamList = {
  Home: undefined;
  Orcamentos: undefined;
  // Futuras telas como 'DetalheOrcamento', 'Configuracoes', etc.
};

const MainStack = createStackNavigator<AppStackParamList>();

export const AppStack = () => {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Orcamentos"
        component={OrcamentosScreen}
        options={{
          title: 'Gerar Orçamento',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#228F2F', // Verde principal
          },
          headerTintColor: '#FFFFFF', // Cor do texto e do botão de voltar
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => <HeaderProfileButton />,
        }}
      />
      {/* Adicione outras rotas do app logado aqui */}
    </MainStack.Navigator>
  );
};