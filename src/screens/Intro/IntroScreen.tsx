// src/screens/Intro/IntroScreen.tsx

import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

// Componentes e Hooks
import { ThemedText, ThemedView } from '../../components';
import { useThemeColor } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { FeatureBox } from '../../components/FeatureBox';
import { AuthModal } from './components/AuthModal';

// Dados e Estilos
import { mainFeatures, secondaryFeatures } from './IntroData';
import { styles } from './InstroStyle';

// Navegação
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';

type IntroScreenProps = StackScreenProps<RootStackParamList, 'Intro'>;

export const IntroScreen = (props: IntroScreenProps) => {
  const { navigation } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const { isLoading } = useAuth();

  const primaryColor = useThemeColor({}, 'primary');
  const buttonColor = useThemeColor({}, 'button');
  const navBackgroundColor = useThemeColor({}, 'boxBackground');
  const backgroundColor = useThemeColor({}, 'background');

  const insets = useSafeAreaInsets();

  const handleStart = () => {
    setModalVisible(true);
  };

  const handleAuthSuccess = () => {
    setModalVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.navbar, { backgroundColor: navBackgroundColor, paddingTop: insets.top }]}>
        <ThemedText type="title" style={styles.navbarTitle}>BudgetGenerator</ThemedText>
        <TouchableOpacity style={[styles.navbarButton, { backgroundColor: buttonColor }]} onPress={handleStart}>
          <ThemedText style={styles.navbarButtonText}>Entrar</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.headerSection}>
          <ThemedText type="title" style={[styles.title, { color: primaryColor }]}>
            Gere Orçamentos Profissionais com IA
          </ThemedText>
          <ThemedText style={styles.lead}>
            Transforme suas ideias em orçamentos detalhados e precisos com a ajuda da nossa inteligência artificial. Perfeito para profissionais iniciantes e experientes.
          </ThemedText>
        </View>

        <View style={styles.featuresSection}>
          {mainFeatures.map((feature, index) => (
            <FeatureBox key={`main-${index}`} feature={feature} />
          ))}
        </View>

        <View style={styles.secondarySection}>
          <ThemedText type="title" style={[styles.sectionTitle, { color: primaryColor }]}>
            Por que escolher nossa plataforma?
          </ThemedText>
          {secondaryFeatures.map((feature, index) => (
            <FeatureBox key={`secondary-${index}`} feature={feature} />
          ))}
        </View>

      </ScrollView>

      <AuthModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLoginSuccess={handleAuthSuccess}
        isLoading={isLoading}
      />
    </ThemedView>
  );
};