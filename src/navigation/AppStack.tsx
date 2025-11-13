// src/navigation/AppStack.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// A tela de Orçamentos é a principal do seu aplicativo.
import { OrcamentosScreen } from '../screens/Orcamento/Orcamentos'; 

// Tipagem para as rotas do App Logado
export type AppStackParamList = {
  Orcamentos: undefined;
  // Futuras telas como 'DetalheOrcamento', 'Configuracoes', etc.
};

const MainStack = createStackNavigator<AppStackParamList>();

export const AppStack = () => {
  return (
    <MainStack.Navigator initialRouteName="Orcamentos">
      <MainStack.Screen 
        name="Orcamentos" 
        component={OrcamentosScreen} 
        options={{ title: 'Meus Orçamentos', headerShown: false }} 
      />
      {/* Adicione outras rotas do app logado aqui */}
    </MainStack.Navigator>
  );
};